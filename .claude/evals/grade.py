#!/usr/bin/env python3
"""Chấm phần văn của một lần chạy eval, rồi in báo cáo so sánh with / without.

    python3 .claude/evals/grade.py 20260821-1530
    python3 .claude/evals/grade.py 20260821-1530 --no-judge   # chỉ tổng hợp phần máy chấm
    python3 .claude/evals/grade.py --compare 20260820-1100 20260821-1530

Phần máy chấm (build, check_lesson) đã được run.py ghi sẵn — ở đây chỉ tổng hợp lại.
Phần văn thì gọi `claude -p` làm giám khảo với thang trong rubric.md.

Giám khảo LLM dao động ±1–2 điểm. Đọc phần "Lưu ý về độ nhiễu" trong rubric.md trước khi
kết luận skill tốt lên hay xấu đi.
"""
import argparse
import json
import os
import re
import subprocess
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
EVALS = os.path.join(ROOT, ".claude", "evals")
RESULTS = os.path.join(EVALS, "results")
CRITERIA = ["xưng hô", "mở bằng căng thẳng", "ví von & con số", "hài hước", "icon", "kiến thức đúng"]


def read(p, limit=None):
    if not os.path.isfile(p):
        return ""
    with open(p, encoding="utf-8", errors="replace") as f:
        s = f.read()
    return s[:limit] if limit else s


def collect_prose(rundir):
    """Gom chữ để chấm: câu trả lời trong chat + các file bài học đã tạo."""
    parts = [read(os.path.join(rundir, "answer.md"), 20000)]
    art = os.path.join(rundir, "artifacts")
    if os.path.isdir(art):
        for name in sorted(os.listdir(art)):
            if name.endswith((".tsx", ".ts", ".js")) and "lessons" in name:
                parts.append(f"\n\n===== {name} =====\n" + read(os.path.join(art, name), 40000))
    return "\n".join(p for p in parts if p.strip())


def judge(prose, expect):
    rubric = read(os.path.join(EVALS, "rubric.md"))
    prompt = f"""Bạn là giám khảo. Chấm đoạn nội dung dưới đây theo thang sau.

{rubric}

--- KỲ VỌNG CỦA CASE NÀY ---
{expect}

--- NỘI DUNG CẦN CHẤM ---
{prose[:60000]}

--- YÊU CẦU ---
Trả về DUY NHẤT một khối JSON, không thêm chữ nào ngoài nó:
{{"scores": {{"xưng hô": 0-2, "mở bằng căng thẳng": 0-2, "ví von & con số": 0-2,
"hài hước": 0-2, "icon": 0-2, "kiến thức đúng": 0-2}},
"total": <tổng>, "sai_kiến_thức": [<liệt kê chỗ sai cụ thể, rỗng nếu không có>],
"nhận_xét": "<2-3 câu: mạnh gì, yếu gì, sửa SKILL thế nào để lần sau tốt hơn>"}}"""
    r = subprocess.run(["claude", "-p", prompt, "--output-format", "json"],
                       capture_output=True, text=True, timeout=900)
    try:
        result = json.loads(r.stdout).get("result", "")
    except Exception:
        result = r.stdout
    m = re.search(r"\{.*\}", result, re.S)
    if not m:
        return {"error": "giám khảo không trả về JSON", "raw": result[-500:]}
    try:
        return json.loads(m.group(0))
    except Exception as e:
        return {"error": f"JSON hỏng: {e}", "raw": m.group(0)[-500:]}


def grade_run(stamp, do_judge):
    base = os.path.join(RESULTS, stamp)
    if not os.path.isdir(base):
        sys.exit(f"không thấy {base}")
    rows = []
    for name in sorted(os.listdir(base)):
        rundir = os.path.join(base, name)
        meta_p = os.path.join(rundir, "meta.json")
        if not os.path.isfile(meta_p):
            continue
        meta = json.load(open(meta_p, encoding="utf-8"))
        gp = os.path.join(rundir, "grade.json")
        if do_judge and not os.path.isfile(gp):
            prose = collect_prose(rundir)
            print(f"  chấm {name} ({len(prose)} ký tự) …", flush=True)
            g = judge(prose, meta.get("expect", "")) if prose.strip() else {"error": "không có chữ để chấm"}
            json.dump(g, open(gp, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
        meta["grade"] = json.load(open(gp, encoding="utf-8")) if os.path.isfile(gp) else {}
        rows.append(meta)
    return rows


def fmt_table(rows):
    out = ["| case | biến thể | build | check | điểm văn | kiến thức | $ | phút |",
           "|---|---|---|---|---|---|---|---|"]
    for m in rows:
        c = m.get("checks", {})
        build = "—" if "build_ok" not in c else ("✓" if c["build_ok"] else "✗")
        chk = "—" if "check_failed" not in c else ("✓" if not c["check_failed"] else "✗")
        g = m.get("grade", {})
        total = g.get("total")
        know = (g.get("scores") or {}).get("kiến thức đúng")
        wrong = g.get("sai_kiến_thức") or []
        know_cell = "—" if know is None else ("✗ " + str(len(wrong)) + " chỗ" if wrong else f"{know}/2")
        out.append("| {} | {} | {} | {} | {} | {} | {} | {} |".format(
            m["case"], m["variant"], build, chk,
            "—" if total is None else f"**{total}**/12", know_cell,
            f'{m.get("cost_usd") or 0:.2f}', f'{(m.get("duration_s") or 0)/60:.1f}'))
    return "\n".join(out)


def write_report(stamp, rows):
    lines = [f"# Eval {stamp}", "", fmt_table(rows), ""]

    by_case = {}
    for m in rows:
        by_case.setdefault(m["case"], {})[m["variant"]] = m
    deltas = []
    for case, vs in by_case.items():
        w, wo = vs.get("with"), vs.get("without")
        if w and wo and w.get("grade", {}).get("total") is not None and wo.get("grade", {}).get("total") is not None:
            d = w["grade"]["total"] - wo["grade"]["total"]
            deltas.append((case, d))
    if deltas:
        lines += ["## Skill có ăn thua không", ""]
        for case, d in deltas:
            verdict = "skill giúp rõ" if d >= 3 else ("khác biệt nằm trong nhiễu" if abs(d) < 3 else "skill làm TỆ đi")
            lines.append(f"- **{case}**: {d:+d} điểm — {verdict}")
        lines += ["", "_Chênh lệch < 3 điểm không đáng tin — xem rubric.md § độ nhiễu._", ""]

    lines += ["## Nhận xét từng lượt", ""]
    for m in rows:
        g = m.get("grade", {})
        lines.append(f"### {m['case']} · {m['variant']}")
        if g.get("error"):
            lines.append(f"- chấm hỏng: {g['error']}")
        for w in (g.get("sai_kiến_thức") or []):
            lines.append(f"- ⚠️ **sai kiến thức**: {w}")
        if g.get("nhận_xét"):
            lines.append(f"- {g['nhận_xét']}")
        c = m.get("checks", {})
        for row in c.get("check_rows", []):
            if row["kind"] in ("fail", "warn"):
                lines.append(f"- `{row['kind']}` {row['msg']}")
        if not c.get("build_ok", True):
            lines.append("- build HỎNG:\n\n```\n" + (c.get("build_tail", "")[-600:]) + "\n```")
        if m.get("files_created"):
            lines.append(f"- tạo {len(m['files_created'])} file, sửa {len(m.get('files_modified', []))} file")
        lines.append("")

    p = os.path.join(RESULTS, stamp, "report.md")
    open(p, "w", encoding="utf-8").write("\n".join(lines))
    return p


def compare(a, b):
    def load(s):
        p = os.path.join(RESULTS, s, "runs.json")
        rows = json.load(open(p, encoding="utf-8")) if os.path.isfile(p) else []
        for m in rows:
            gp = os.path.join(RESULTS, s, f"{m['case']}__{m['variant']}", "grade.json")
            m["grade"] = json.load(open(gp, encoding="utf-8")) if os.path.isfile(gp) else {}
        return {(m["case"], m["variant"]): m for m in rows}

    A, B = load(a), load(b)
    print(f"\n{a}  →  {b}\n")
    print("| case | biến thể | trước | sau | Δ |")
    print("|---|---|---|---|---|")
    for k in sorted(set(A) | set(B)):
        ta = (A.get(k, {}).get("grade") or {}).get("total")
        tb = (B.get(k, {}).get("grade") or {}).get("total")
        d = "—" if ta is None or tb is None else f"{tb - ta:+d}"
        print(f"| {k[0]} | {k[1]} | {ta if ta is not None else '—'} | {tb if tb is not None else '—'} | {d} |")
    print("\nChênh < 3 điểm là nhiễu, đừng kết luận vội (rubric.md § độ nhiễu).")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("stamp", nargs="?", help="thư mục lần chạy, vd 20260821-1530")
    ap.add_argument("--no-judge", action="store_true", help="bỏ giám khảo LLM, chỉ tổng hợp máy chấm")
    ap.add_argument("--compare", nargs=2, metavar=("TRƯỚC", "SAU"))
    args = ap.parse_args()

    if args.compare:
        compare(*args.compare)
        return 0
    if not args.stamp:
        stamps = sorted(d for d in os.listdir(RESULTS) if os.path.isdir(os.path.join(RESULTS, d)))
        if not stamps:
            sys.exit("chưa có lần chạy nào — chạy run.py trước.")
        args.stamp = stamps[-1]
        print(f"(không truyền stamp — lấy lần mới nhất: {args.stamp})")

    rows = grade_run(args.stamp, not args.no_judge)
    p = write_report(args.stamp, rows)
    print("\n" + fmt_table(rows))
    print(f"\nbáo cáo đầy đủ: {os.path.relpath(p, ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
