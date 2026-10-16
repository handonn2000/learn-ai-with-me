#!/usr/bin/env python3
"""Kiểm tra cơ học một bài học của learn-ai-with-me.

    python3 .claude/skills/new-lesson/scripts/check_lesson.py b4
    python3 .claude/skills/new-lesson/scripts/check_lesson.py b1 b3 b4

Bắt những lỗi mà mắt hay bỏ sót: quên nối route, anchor nav trỏ vào id không tồn tại,
storageKey trùng bài khác, sót dấu vết trích nguồn, giọng văn tuột về vô danh.

Không chấm được văn hay dở — chạy xong vẫn phải tự đọc lại bài.
Chạy trên b1 hoặc b3 để thấy mốc của một bài đã đạt chuẩn.
"""
import json
import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
LESSONS = os.path.join(ROOT, "src", "features", "lessons")
APP = os.path.join(ROOT, "src", "App.tsx")
COURSE = os.path.join(ROOT, "src", "content", "courses", "csc14003", "index.ts")

# Icon trang trí. Cố tình KHÔNG tính ✓ ✗ → ← ▶ ❚ … vì đó là ký hiệu giao diện, không phải mốc.
EMOJI = re.compile(r"[\U0001F300-\U0001FAFF⛰-⛿⌨✏⚠]")

# Dấu vết nguồn tham khảo. Nguồn chỉ được nằm ở Course.description, không nằm trong bài.
SOURCE_TRACES = [
    (r"\bAIMA\b", "AIMA"),
    (r"\bHCMUS\b", "HCMUS"),
    (r"\bCS188\b", "CS188"),
    (r"\bBerkeley\b", "Berkeley"),
    (r"Lecture\s*0?\d", "Lecture<N>"),
    (r"\bHomework\s*\d", "Homework<N>"),
    (r"[Nn]guồn\s*:", "Nguồn:"),
    (r"\bslide\b", "slide"),
    (r"Russell|Norvig", "tên tác giả giáo trình"),
]

GREEN, RED, YELLOW, DIM, OFF = "\033[32m", "\033[31m", "\033[33m", "\033[2m", "\033[0m"
if not sys.stdout.isatty():
    GREEN = RED = YELLOW = DIM = OFF = ""


class Report:
    def __init__(self, lesson_id):
        self.id = lesson_id
        self.rows = []

    def ok(self, msg):
        self.rows.append(("ok", msg))

    def warn(self, msg):
        self.rows.append(("warn", msg))

    def fail(self, msg):
        self.rows.append(("fail", msg))

    @property
    def failed(self):
        return any(k == "fail" for k, _ in self.rows)

    def render(self):
        mark = {"ok": GREEN + "  ok  " + OFF, "warn": YELLOW + " warn " + OFF, "fail": RED + " FAIL " + OFF}
        print("\n" + "─" * 62)
        print(f"  {self.id}")
        print("─" * 62)
        for kind, msg in self.rows:
            print(f"{mark[kind]} {msg}")


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def lesson_sources(lesson_id):
    """Mọi file trong folder bài học đó."""
    d = os.path.join(LESSONS, lesson_id)
    if not os.path.isdir(d):
        return {}
    out = {}
    for name in sorted(os.listdir(d)):
        if name.endswith((".tsx", ".ts")):
            out[name] = read(os.path.join(d, name))
    return out


def check(lesson_id):
    r = Report(lesson_id)
    files = lesson_sources(lesson_id)
    if not files:
        r.fail(f"không thấy folder src/features/lessons/{lesson_id}/")
        return r

    page_name, page = next(
        ((n, s) for n, s in files.items() if "export default function" in s),
        (None, None),
    )
    if not page:
        r.fail("không file nào trong folder có `export default function` — trang chính đâu?")
        return r
    r.ok(f"trang chính: {page_name}  ({len(files)} file, {sum(s.count(chr(10)) for s in files.values())} dòng)")

    blob = "\n".join(files.values())
    route = f"/courses/csc14003/lessons/{lesson_id}"

    # ---- 1 · route ----
    app = read(APP)
    if f'path="{route}"' in app:
        head_branch = app.split('path="*"')[0]
        if f'path="{route}"' in head_branch:
            r.ok("route đã nối trong App.tsx, nằm ở nhánh full-bleed")
        else:
            r.fail("route nằm SAU route \"*\" hoặc trong nhánh AppHeader → sẽ có 2 thanh nav chồng nhau")
    else:
        r.fail(f'App.tsx chưa có <Route path="{route}" …/> — bài học không tới được người dùng')

    # ---- 2 · lessonPath ----
    course = read(COURSE)
    session = re.search(r"\{\s*id:\s*'%s'.*?\n(?=\s*\{\s*id:|\s*\],)" % lesson_id, course, re.S)
    if not session:
        r.fail(f"không thấy session id '{lesson_id}' trong dữ liệu khóa")
    elif f"lessonPath: '{route}'" in session.group(0):
        r.ok("lessonPath đã set và khớp route")
    elif "lessonPath" in session.group(0):
        r.fail("lessonPath có nhưng KHÁC route trong App.tsx — kiểm lại từng ký tự")
    else:
        r.fail("session chưa có lessonPath → lộ trình vẫn hiện nhãn xám 'đang dựng'")

    # ---- 3 · anchor nav ↔ id ----
    anchors = re.findall(r"href:\s*'#([\w-]+)'", page)
    ids = set(re.findall(r'id="([\w-]+)"', page))
    if not anchors:
        r.warn("LessonNav không có items nào — cố ý?")
    else:
        orphan = [a for a in anchors if a not in ids]
        if orphan:
            r.fail("anchor trỏ vào id không tồn tại: " + ", ".join("#" + a for a in orphan))
        else:
            r.ok(f"{len(anchors)} anchor nav đều khớp id có thật")
        unlisted = sorted(ids - set(anchors) - {"root"})
        if unlisted:
            r.warn("mục có id nhưng không có trong nav: " + ", ".join("#" + i for i in unlisted))

    # ---- 4 · storageKey ----
    keys = re.findall(r"storageKey=\"([\w-]+)\"", page)
    if not keys:
        r.warn("chưa có <CheckList> — bài học nào cũng nên kết bằng khối tự kiểm")
    else:
        for k in keys:
            if not k.startswith(lesson_id):
                r.warn(f"storageKey '{k}' không theo quy ước '<id>-checks'")
            others = []
            for other in sorted(os.listdir(LESSONS)):
                if other == lesson_id or not os.path.isdir(os.path.join(LESSONS, other)):
                    continue
                if f'storageKey="{k}"' in "\n".join(lesson_sources(other).values()):
                    others.append(other)
            if others:
                r.fail(f"storageKey '{k}' trùng với {', '.join(others)} → tick bài này lộ sang bài kia")
        if keys and all(k.startswith(lesson_id) for k in keys):
            r.ok(f"storageKey: {', '.join(keys)}")

    # ---- 5 · điều cấm ----
    if "scrollIntoView" in blob:
        r.fail("dùng scrollIntoView — repo cấm, điều hướng trong trang bằng href='#id'")
    else:
        r.ok("không có scrollIntoView")

    # Vài mẫu chỉ là dấu vết trích nguồn khi nằm trong văn TIẾNG VIỆT. "slide" trong câu tiếng
    # Anh là ĐỘNG TỪ bình thường ("let tiles slide through each other" ở phép nới lỏng 8-puzzle),
    # còn "nguồn:" thì tiếng Anh không có. Tên riêng (AIMA, CS188, Berkeley, Russell/Norvig…)
    # thì là dấu vết ở cả hai thứ tiếng.
    VI_ONLY = {"slide", "Nguồn:"}
    vi_blob_all = "\n".join(s for n, s in files.items() if ".en." not in n)
    en_blob_all = "\n".join(s for n, s in files.items() if ".en." in n)
    found = [label for pat, label in SOURCE_TRACES if re.search(pat, vi_blob_all)]
    found += [label for pat, label in SOURCE_TRACES
              if label not in VI_ONLY and re.search(pat, en_blob_all) and label not in found]
    if found:
        r.fail("còn dấu vết trích nguồn trong bài: " + ", ".join(found) + "  (nguồn chỉ nằm ở Course.description)")
    else:
        r.ok("không còn trích nguồn trong bài")

    # ---- 6 · giọng văn ----
    # Từ khi có bản tiếng Anh, phải TÁCH hai nửa ra rồi mới đo. Đo trên cả cụm thì đếm icon
    # xấp xỉ gấp đôi (trip ngưỡng 12) còn đếm đại từ thì lặng lẽ ngừng đo nửa EN — cả hai đều
    # là hỏng âm thầm. Tự nhận biết theo hậu tố `.en.`, không cần cờ dòng lệnh.
    vi_blob = "\n".join(s for n, s in files.items() if ".en." not in n)
    en_blob = "\n".join(s for n, s in files.items() if ".en." in n)

    toi = len(re.findall(r"\btôi\b", vi_blob, re.I))
    ban = len(re.findall(r"\bbạn\b", vi_blob, re.I))
    if toi < 4 or ban < 12:
        r.warn(f"giọng VI nhạt: {toi}× 'tôi', {ban}× 'bạn' (b1: 10/22 · b3: 10/24) — đọc lại skill lesson-voice")
    else:
        r.ok(f"giọng VI: {toi}× 'tôi', {ban}× 'bạn'")

    if en_blob:
        # Tiếng Anh không có cặp tôi/bạn để đếm, nhưng "I" và "you" vẫn đo được cùng một thứ:
        # bài có người viết hay bài giáo trình vô danh. Xem lesson-voice/references/english.md.
        i_ = len(re.findall(r"\bI\b", en_blob))
        you = len(re.findall(r"\byou\b|\byour\b", en_blob, re.I))
        if i_ < 4 or you < 12:
            r.warn(f"giọng EN nhạt: {i_}× 'I', {you}× 'you' — dịch cứng thường rơi mất người kể")
        else:
            r.ok(f"giọng EN: {i_}× 'I', {you}× 'you'")

    icons = EMOJI.findall(vi_blob)
    uniq = sorted(set(icons))
    if len(icons) > 12:
        r.warn(f"{len(icons)} icon — nhiều quá, app này để ôn đi ôn lại (mốc 5–8): {' '.join(uniq)}")
    elif len(icons) < 3:
        r.warn(f"{len(icons)} icon — icon làm mốc giúp mắt bắt nhịp khi cuộn (mốc 5–8)")
    else:
        r.ok(f"{len(icons)} icon: {' '.join(uniq)}")

    if en_blob:
        en_icons = EMOJI.findall(en_blob)
        if len(en_icons) != len(icons):
            r.warn(f"icon lệch giữa hai bản: VI {len(icons)} vs EN {len(en_icons)} — mốc phải rơi cùng chỗ")

    # ---- 7 · thẻ toán nền ----
    # Trang Lộ trình hứa mỗi buổi mở đầu bằng thẻ ôn toán — thiếu là thất hứa với người học.
    primers = os.path.join(os.path.dirname(COURSE), "math-primers.js")
    has_block = "MathPrimer" in page and 'id="toan"' in page
    has_data = os.path.isfile(primers) and re.search(r"\b%s\s*:" % lesson_id, read(primers))
    if has_block and has_data:
        r.ok("có thẻ toán nền (#toan) và dữ liệu trong math-primers.js")
    elif has_block:
        r.fail("có <MathPrimer> nhưng math-primers.js thiếu khóa '%s'" % lesson_id)
    else:
        r.fail("thiếu thẻ toán nền mở màn — trang Lộ trình đang hứa mỗi buổi có nó (xem skill new-lesson bước 2)")

    # ---- 8 · chế độ trình chiếu (ADR-0006) ----
    # Quên bọc <LessonDeck> thì nút đổi chế độ vẫn hiện mà bấm không có gì xảy ra — im lặng, không lỗi.
    deck_bits = [b for b in ("useDeckMode", "DeckToggle", "<LessonDeck") if b in page]
    if len(deck_bits) == 3:
        if "SLIDES" in page and re.search(r"id:\s*'hero'", page):
            r.ok("chế độ trình chiếu đã nối (SLIDES có slide bìa)")
        else:
            r.fail("có <LessonDeck> nhưng SLIDES thiếu slide bìa {{ id: 'hero' }} — xem wiring.md chỗ 5")
    elif deck_bits:
        r.fail("nối trình chiếu nửa vời, mới có: " + ", ".join(deck_bits) + " (cần đủ cả ba)")
    else:
        r.warn("chưa nối chế độ trình chiếu — xem references/wiring.md chỗ 5")

    # ---- 9 · quiz cuối buổi ----
    # SessionQuiz thiếu dữ liệu thì render ra null: im lặng, không lỗi, và người học mất luôn báo cáo
    # mạnh/yếu trên trang Lộ trình.
    quizzes = os.path.join(os.path.dirname(COURSE), "session-quizzes.js")
    has_quiz_block = "SessionQuiz" in page
    has_quiz_data = os.path.isfile(quizzes) and re.search(r"\b%s\s*:" % lesson_id, read(quizzes))
    if has_quiz_block and has_quiz_data:
        r.ok("có quiz cuối buổi và bộ câu hỏi trong session-quizzes.js")
    elif has_quiz_block:
        r.fail("có <SessionQuiz> nhưng session-quizzes.js thiếu khóa '%s' → quiz render ra rỗng" % lesson_id)
    else:
        r.warn("chưa có quiz cuối buổi — xem references/wiring.md chỗ 6")

    # ---- 10 · vụn vặt hay quên ----
    if "lesson-section--last" not in page:
        r.warn("mục cuối thiếu class lesson-section--last → nội dung dính đáy màn hình")
    if "<CanvasScene" in page and "prefers-reduced-motion" not in page and "lib/motion" not in page:
        r.warn("có canvas nhưng không thấy cờ prefers-reduced-motion")
    return r


def main():
    args = sys.argv[1:]
    as_json = "--json" in args
    ids = [a for a in args if not a.startswith("-")]
    if not ids:
        ids = sorted(d for d in os.listdir(LESSONS) if os.path.isdir(os.path.join(LESSONS, d)))
        if not as_json:
            print(f"{DIM}(không truyền id — kiểm hết: {', '.join(ids)}){OFF}")
    reports = [check(i) for i in ids]

    if as_json:
        # Dùng bởi .claude/evals/run.py — giữ nguyên khóa nếu đổi script.
        print(json.dumps({
            "lessons": [
                {"id": r.id, "failed": r.failed,
                 "counts": {k: sum(1 for kk, _ in r.rows if kk == k) for k in ("ok", "warn", "fail")},
                 "rows": [{"kind": k, "msg": m} for k, m in r.rows]}
                for r in reports
            ],
            "failed": any(r.failed for r in reports),
        }, ensure_ascii=False, indent=2))
        return 1 if any(r.failed for r in reports) else 0

    for rep in reports:
        rep.render()
    bad = [rep.id for rep in reports if rep.failed]
    print()
    if bad:
        print(f"{RED}✗ còn lỗi phải sửa: {', '.join(bad)}{OFF}")
    else:
        print(f"{GREEN}✓ qua hết phần kiểm cơ học.{OFF} Còn lại: npm run build, mở trình duyệt, và tự đọc lại bài.")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
