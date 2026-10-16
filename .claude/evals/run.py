#!/usr/bin/env python3
"""Chạy các case eval qua `claude -p` trong bản sao repo, rồi chấm phần máy chấm được.

    python3 .claude/evals/run.py                       # tất cả case, cả 2 biến thể
    python3 .claude/evals/run.py --case voice-rewrite  # một case
    python3 .claude/evals/run.py --variant with        # bỏ baseline cho nhanh
    python3 .claude/evals/run.py --keep-sandbox        # giữ bản sao để mở ra xem

Mỗi case chạy hai biến thể: `with` (có .claude/skills) và `without` (đã xóa skills) —
để trả lời câu hỏi thật sự đáng hỏi: skill có làm kết quả tốt lên không.

TỐN TIỀN VÀ THỜI GIAN. Case b4-full là một phiên Claude Code đầy đủ. Chạy hết 3 case × 2
biến thể là 6 phiên. Bắt đầu bằng --case voice-rewrite cho rẻ.
"""
import argparse
import datetime
import json
import os
import shutil
import subprocess
import sys
import time

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
EVALS = os.path.join(ROOT, ".claude", "evals")
RESULTS = os.path.join(EVALS, "results")
SANDBOX_ROOT = "/tmp/lawm-evals"
CHECKER = ".claude/skills/new-lesson/scripts/check_lesson.py"
SKIP = ["node_modules", "dist", ".claude/evals/results", ".DS_Store"]


def sh(cmd, cwd=None, timeout=None, env=None):
    return subprocess.run(cmd, cwd=cwd, timeout=timeout, env=env,
                          capture_output=True, text=True)


def make_sandbox(dest, variant):
    """Bản sao repo để agent tự do sửa. node_modules symlink cho nhanh."""
    if os.path.exists(dest):
        shutil.rmtree(dest)
    os.makedirs(dest)
    args = ["rsync", "-a"]
    for s in SKIP:
        args += ["--exclude", s]
    args += [ROOT + "/", dest + "/"]
    r = sh(args)
    if r.returncode != 0:
        raise RuntimeError("rsync hỏng: " + r.stderr)
    src_nm = os.path.join(ROOT, "node_modules")
    if os.path.isdir(src_nm):
        os.symlink(src_nm, os.path.join(dest, "node_modules"))
    if variant == "without":
        shutil.rmtree(os.path.join(dest, ".claude", "skills"), ignore_errors=True)
        # Bỏ luôn con trỏ trong CLAUDE.md để baseline thật sự không biết skill tồn tại.
        cm = os.path.join(dest, "CLAUDE.md")
        if os.path.isfile(cm):
            with open(cm, encoding="utf-8") as f:
                txt = f.read()
            head, sep, tail = txt.partition("\n## Skill\n")
            if sep:
                rest = tail.split("\n## ", 1)
                txt = head + ("\n## " + rest[1] if len(rest) > 1 else "")
            with open(cm, "w", encoding="utf-8") as f:
                f.write(txt)


def changed_files(sandbox):
    """File nào agent đã tạo hoặc sửa so với repo gốc."""
    args = ["diff", "-rq"]
    for s in SKIP:
        args += ["--exclude", os.path.basename(s)]
    args += [ROOT, sandbox]
    out = sh(args).stdout
    created, modified = [], []
    for line in out.splitlines():
        if line.startswith("Only in " + sandbox):
            body = line[len("Only in "):]
            d, _, name = body.partition(": ")
            path = os.path.join(d, name)
            if os.path.isdir(path):
                # Thư mục mới: liệt kê từng file bên trong, không thì artifacts hụt sạch.
                for dirpath, _dirs, names in os.walk(path):
                    for n in names:
                        created.append(os.path.relpath(os.path.join(dirpath, n), sandbox))
            else:
                created.append(os.path.relpath(path, sandbox))
        elif line.startswith("Files ") and line.endswith(" differ"):
            parts = line[len("Files "):-len(" differ")].split(" and ")
            if len(parts) == 2:
                modified.append(os.path.relpath(parts[1], sandbox))
    return sorted(created), sorted(modified)


def machine_checks(sandbox, lesson_id):
    """Phần máy chấm được — rẻ, khách quan, chính là lưới bắt hồi quy."""
    out = {}
    b = sh(["npm", "run", "build"], cwd=sandbox, timeout=600)
    out["build_ok"] = b.returncode == 0
    out["build_tail"] = (b.stdout + b.stderr).strip()[-1200:]
    if lesson_id:
        c = sh(["python3", CHECKER, lesson_id, "--json"], cwd=sandbox, timeout=120)
        try:
            data = json.loads(c.stdout)
            lesson = data["lessons"][0]
            out["check_failed"] = lesson["failed"]
            out["check_counts"] = lesson["counts"]
            out["check_rows"] = lesson["rows"]
        except Exception:
            out["check_failed"] = True
            out["check_error"] = (c.stdout + c.stderr)[-800:]
    return out


def run_one(case, variant, stamp, args):
    name = f"{case['id']}__{variant}"
    sandbox = os.path.join(SANDBOX_ROOT, stamp, name)
    outdir = os.path.join(RESULTS, stamp, name)
    os.makedirs(outdir, exist_ok=True)
    print(f"  ▸ {name} … ", end="", flush=True)

    make_sandbox(sandbox, variant)
    # Biến thể `without` tự sửa CLAUDE.md khi dựng sandbox — trừ đi để không tính nhầm là agent làm.
    pre_created, pre_modified = changed_files(sandbox)

    cmd = ["claude", "-p", case["prompt"],
           "--permission-mode", args.permission_mode,
           "--output-format", "json"]
    if args.model:
        cmd += ["--model", args.model]

    t0 = time.time()
    try:
        r = sh(cmd, cwd=sandbox, timeout=args.timeout)
        raw, err, code = r.stdout, r.stderr, r.returncode
    except subprocess.TimeoutExpired:
        raw, err, code = "", f"TIMEOUT sau {args.timeout}s", -1
    dur = round(time.time() - t0, 1)

    agent = {}
    try:
        agent = json.loads(raw)
    except Exception:
        agent = {"result": raw[-4000:], "_unparsed": True}

    created, modified = changed_files(sandbox)
    created = [f for f in created if f not in pre_created]
    modified = [f for f in modified if f not in pre_modified]
    checks = machine_checks(sandbox, case.get("lesson_id")) if code == 0 else {}

    meta = {
        "case": case["id"], "variant": variant, "stamp": stamp,
        "exit_code": code, "duration_s": dur, "stderr_tail": err[-800:],
        "cost_usd": agent.get("total_cost_usd"),
        "num_turns": agent.get("num_turns"),
        "files_created": created, "files_modified": modified,
        "checks": checks,
        "expect": case.get("expect", ""),
    }
    with open(os.path.join(outdir, "meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
    with open(os.path.join(outdir, "answer.md"), "w", encoding="utf-8") as f:
        f.write(agent.get("result", "") or "")

    art = os.path.join(outdir, "artifacts")
    os.makedirs(art, exist_ok=True)
    for rel in (created + modified)[:60]:
        src = os.path.join(sandbox, rel)
        if not os.path.isfile(src):
            continue
        dst = os.path.join(art, rel.replace(os.sep, "__"))
        try:
            shutil.copyfile(src, dst)
        except OSError:
            pass

    if not args.keep_sandbox:
        shutil.rmtree(sandbox, ignore_errors=True)

    flag = "ok" if code == 0 else f"exit {code}"
    if checks:
        flag += " · build " + ("sạch" if checks.get("build_ok") else "HỎNG")
        if "check_failed" in checks:
            flag += " · check " + ("qua" if not checks["check_failed"] else "TRƯỢT")
    print(f"{dur}s · {flag}")
    return meta


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--case", action="append", help="id case, lặp được. Mặc định: tất cả")
    ap.add_argument("--variant", choices=["with", "without", "both"], default="both")
    ap.add_argument("--model", default=None, help="alias model, vd 'opus' — mặc định theo cấu hình claude")
    ap.add_argument("--permission-mode", default="acceptEdits",
                    help="acceptEdits (mặc định) | bypassPermissions nếu agent hay bị chặn")
    ap.add_argument("--timeout", type=int, default=2400, help="giây cho mỗi lần chạy")
    ap.add_argument("--keep-sandbox", action="store_true")
    args = ap.parse_args()

    if not shutil.which("claude"):
        sys.exit("không thấy lệnh `claude` — cài Claude Code CLI trước.")

    with open(os.path.join(EVALS, "cases.json"), encoding="utf-8") as f:
        cases = json.load(f)["evals"]
    if args.case:
        cases = [c for c in cases if c["id"] in args.case]
        if not cases:
            sys.exit("không case nào khớp --case")

    variants = ["with", "without"] if args.variant == "both" else [args.variant]
    stamp = datetime.datetime.now().strftime("%Y%m%d-%H%M")
    os.makedirs(os.path.join(RESULTS, stamp), exist_ok=True)

    print(f"\nlần chạy {stamp} · {len(cases)} case × {len(variants)} biến thể")
    print(f"kết quả: .claude/evals/results/{stamp}/\n")

    metas = []
    for c in cases:
        print(f"{c['id']}  ({c.get('weight', '?')})")
        for v in variants:
            try:
                metas.append(run_one(c, v, stamp, args))
            except Exception as e:  # một case hỏng không được kéo sập cả lượt
                print(f"    lỗi: {e}")

    with open(os.path.join(RESULTS, stamp, "runs.json"), "w", encoding="utf-8") as f:
        json.dump(metas, f, ensure_ascii=False, indent=2)

    cost = sum(m["cost_usd"] or 0 for m in metas)
    print(f"\nxong {len(metas)} lượt · tổng ~${cost:.2f}")
    print(f"chấm phần văn: python3 .claude/evals/grade.py {stamp}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
