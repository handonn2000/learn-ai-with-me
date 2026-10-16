#!/usr/bin/env python3
"""Bảng trạng thái vòng lặp song ngữ. Chạy các cổng, in xanh/đỏ, exit 0 khi unit ĐÓNG được.

    python3 .claude/scripts/i18n_loop.py b1        # một unit
    python3 .claude/scripts/i18n_loop.py chrome b1 # vài unit
    python3 .claude/scripts/i18n_loop.py --all     # cả dự án
    python3 .claude/scripts/i18n_loop.py b1 --no-build   # vòng trong, bỏ bước build cho nhanh

CỐ Ý KHÔNG gọi `claude -p`. Ba lý do, ghi ở ADR-0010:
  1. Vòng lặp tự động có tính phí mà không có người trong vòng, trên repo chưa từng chạy eval.
  2. `.claude/evals/run.py` đã sở hữu hình dạng "chạy claude trong sandbox" — nhân bản là lệch.
  3. Chất lượng bản dịch là thứ DUY NHẤT vòng lặp tất định không kết thúc dựa vào được, nên
     nó sẽ hoặc dừng sớm hoặc quay mãi.

Nửa "làm" là slash command người gọi: .claude/commands/i18n-unit.md
"""
import hashlib
import json
import os
import subprocess
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SCRIPTS = os.path.join(ROOT, ".claude", "scripts")
ACCEPT = os.path.join(ROOT, ".claude", "i18n", "acceptance.json")
JUDGED = os.path.join(ROOT, ".claude", "i18n", "judged")
STATUS = os.path.join(ROOT, ".claude", "i18n", "status.json")
CHECK_LESSON = os.path.join(ROOT, ".claude", "skills", "new-lesson", "scripts", "check_lesson.py")

GREEN, RED, YELLOW, DIM, BOLD, OFF = "\033[32m", "\033[31m", "\033[33m", "\033[2m", "\033[1m", "\033[0m"
if not sys.stdout.isatty():
    GREEN = RED = YELLOW = DIM = BOLD = OFF = ""


def run(cmd, cwd=ROOT):
    p = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    return p.returncode, p.stdout, p.stderr


def pairs_hash(unit):
    """sha256 của CHỮ NGHĨA trong các file dịch của unit — không phải của byte thô.

    Băm byte thì một thay đổi không phải chữ (thêm cờ `hasPartTests: true`, sửa comment, đổi
    thụt lề) cũng vô hiệu hóa phán quyết, buộc chấm lại một thứ giám khảo không hề đọc. Băm
    đúng phần chuỗi + text node JSX thì: đổi một chữ là hết hiệu lực (đúng như mong muốn),
    còn đổi cấu trúc thì không.
    """
    sys.path.insert(0, SCRIPTS)
    from _jsscan import scan, jsx_texts, block_of  # noqa: E402

    h = hashlib.sha256()
    for pair in unit.get("pairs", []):
        for rel in (pair["vi"], pair["en"]):
            path = os.path.join(ROOT, rel)
            h.update(rel.encode())
            if not os.path.isfile(path):
                h.update(b"<missing>")
                continue
            with open(path, encoding="utf-8") as f:
                src = f.read()
            # File dùng chung nhiều buổi (session-quizzes, math-primers): chỉ băm KHỐI của
            # buổi này. Băm cả file thì dịch xong buổi 2 sẽ vô hiệu hóa phán quyết của buổi 1,
            # dù nội dung buổi 1 không đổi một chữ.
            scope = pair.get("scope_key")
            if scope:
                src = block_of(src, scope) or ""
            code, strs = scan(src)
            for _l, _q, txt in strs:
                h.update(txt.encode())
            for t in jsx_texts(code):
                h.update(t.encode())
    return h.hexdigest()[:16]


def gate_deps(cfg, _unit, _cache):
    pkg = json.load(open(os.path.join(ROOT, "package.json"), encoding="utf-8"))
    got, want = sorted(pkg.get("dependencies", {})), sorted(cfg["deps_allowlist"])
    if got == want:
        return True, f"{len(got)} dependency, đúng danh sách"
    return False, "dependency LỆCH: " + ", ".join(sorted(set(got) ^ set(want)))


def gate_build(_cfg, _unit, cache):
    if "build" not in cache:
        code, out, err = run(["npm", "run", "build"])
        tail = [l for l in (out + err).splitlines() if l.strip()][-1:] or [""]
        cache["build"] = (code == 0, "npm run build sạch" if code == 0 else f"build hỏng: {tail[0][:70]}")
    return cache["build"]


def gate_i18n(_cfg, unit, _cache):
    code, out, _err = run(["python3", os.path.join(SCRIPTS, "check_i18n.py"), unit["id"], "--json"])
    try:
        data = json.loads(out)
    except json.JSONDecodeError:
        return False, "check_i18n.py không trả JSON"
    fails = [row["msg"] for u in data["units"] for row in u["rows"] if row["kind"] == "fail"]
    n_warn = sum(u["counts"]["warn"] for u in data["units"])
    if not fails:
        return True, f"check_i18n sạch{f' ({n_warn} cảnh báo)' if n_warn else ''}"
    return False, f"{len(fails)} lỗi — đầu tiên: {fails[0][:78]}"


def gate_lesson(_cfg, unit, _cache):
    lid = unit.get("lesson_id")
    if not lid:
        return True, "unit không phải bài học"
    code, out, _err = run(["python3", CHECK_LESSON, lid, "--json"])
    try:
        data = json.loads(out)
    except json.JSONDecodeError:
        return False, "check_lesson.py không trả JSON"
    fails = [row["msg"] for l in data["lessons"] for row in l["rows"] if row["kind"] == "fail"]
    if not fails:
        return True, "check_lesson sạch (đo giọng cả hai bản)"
    return False, f"{len(fails)} lỗi — đầu tiên: {fails[0][:78]}"


def gate_judged(_cfg, unit, _cache):
    """Phán quyết chỉ có giá trị với ĐÚNG nội dung nó đã đọc — hash làm việc đó, không phải trí nhớ."""
    path = os.path.join(JUDGED, unit["id"] + ".json")
    if not os.path.isfile(path):
        return False, "chưa chấm — gọi agent i18n-fidelity-judge cho unit này"
    v = json.load(open(path, encoding="utf-8"))
    if v.get("verdict") != "ĐẠT":
        return False, f"phán quyết {v.get('verdict')!r}: {str(v.get('summary', ''))[:60]}"
    now = pairs_hash(unit)
    if v.get("pairs_hash") != now:
        return False, f"phán quyết ĐÃ CŨ (hash {v.get('pairs_hash')} ≠ {now}) — file dịch đổi sau khi chấm"
    return True, f"ĐẠT, hash {now} còn khớp"


GATES = {"deps": gate_deps, "build": gate_build, "i18n": gate_i18n,
         "lesson": gate_lesson, "judged": gate_judged}
# Ba cổng này do check_i18n.py kiểm luôn bên trong — giữ tên trong acceptance.json cho dễ đọc,
# nhưng không chạy tiến trình riêng.
MERGED_INTO_I18N = {"extraction", "engine"}


def main():
    args = sys.argv[1:]
    cfg = json.load(open(ACCEPT, encoding="utf-8"))
    units = {u["id"]: u for u in cfg["units"]}
    no_build = "--no-build" in args
    ids = [a for a in args if not a.startswith("-")]
    if "--all" in args or not ids:
        ids = list(units)
    bad = [i for i in ids if i not in units]
    if bad:
        print(f"không có unit: {', '.join(bad)}  (có: {', '.join(units)})")
        return 2

    cache, result, closed = {}, {}, []
    for uid in ids:
        unit = units[uid]
        print(f"\n{BOLD}▶ {uid} · {unit['title']}{OFF}")
        rows, all_ok = [], True
        for g in unit["gates"]:
            if g in MERGED_INTO_I18N:
                continue
            if g == "build" and no_build:
                rows.append(("build", None, "bỏ qua (--no-build)"))
                continue
            ok, msg = GATES[g](cfg, unit, cache)
            all_ok &= ok
            rows.append((g, ok, msg))
        for g, ok, msg in rows:
            mark = f"{DIM}  --  {OFF}" if ok is None else (f"{GREEN}  ok  {OFF}" if ok else f"{RED} FAIL {OFF}")
            print(f"{mark} {g:<8} {msg}")
        # Unit không khai cổng `judged` sẽ "đóng" mà chưa ai đọc bản dịch bao giờ. Không tự ý
        # sửa cấu hình của người khác — nhưng phải nói ra, vì một cổng xanh sai còn tệ hơn
        # không có cổng nào.
        if "judged" not in unit["gates"]:
            print(f"{YELLOW}  !!   judged   unit này KHÔNG khai cổng judged — "
                  f"nó đóng mà chưa qua giám khảo lần nào{OFF}")
        result[uid] = {"closed": all_ok, "unjudged": "judged" not in unit["gates"],
                       "gates": {g: ok for g, ok, _ in rows}}
        if all_ok:
            closed.append(uid)
            print(f"{GREEN}  ✓ unit ĐÓNG ĐƯỢC{OFF}")

    with open(STATUS, "w", encoding="utf-8") as f:
        json.dump({"units": result, "closed": closed}, f, ensure_ascii=False, indent=2)

    todo = [i for i in ids if i not in closed]
    print()
    if todo:
        print(f"{RED}✗ chưa đóng: {', '.join(todo)}{OFF}   {DIM}(đóng: {', '.join(closed) or '—'}){OFF}")
    else:
        print(f"{GREEN}✓ mọi unit đã đóng: {', '.join(closed)}{OFF}")
    return 1 if todo else 0


if __name__ == "__main__":
    sys.exit(main())
