#!/usr/bin/env python3
"""Kiểm cơ học phần song ngữ VI/EN của learn-ai-with-me.

    python3 .claude/scripts/check_i18n.py                 # kiểm chung + mọi unit
    python3 .claude/scripts/check_i18n.py b1              # một unit
    python3 .claude/scripts/check_i18n.py b1 --json       # cho i18n_loop.py / evals
    python3 .claude/scripts/check_i18n.py b1 --snapshot   # chụp mốc TRƯỚC khi tách chuỗi
    python3 .claude/scripts/check_i18n.py b1 --extraction-audit

PHÂN VAI — đọc kỹ trước khi thêm kiểm mới:

    `tsc` sở hữu CẤU TRÚC. Bundle EN khai `satisfies typeof VI`, module selector khai
    `const M: typeof VI` — thiếu khóa, thừa khóa, sai arity tup() đều là lỗi build.
    Script này sở hữu GIÁ TRỊ: dịch chưa, thẻ HTML còn không, số có sai không, mã có trôi không.

Chép lại thứ `tsc` đã bắt là tạo nguồn sự thật thứ hai rồi để nó lệch. Đừng làm.
"""
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _jsscan import scan, key_names, has_vn, tags, anchors, digits, digits_ok, code_bits, jsx_texts, is_notation, unescape, block_of, VN  # noqa: E402

raw_has_vn = has_vn


def has_vn(s):
    # Romanian names share ă/â with Vietnamese. Exclude exact name tokens only,
    # including when used in prose; never exempt an entire label or sentence.
    return raw_has_vn(re.sub(r"\b(?:Făgăraș|Râmnicu)\b", "", s))

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ACCEPT = os.path.join(ROOT, ".claude", "i18n", "acceptance.json")
BASELINE = os.path.join(ROOT, ".claude", "i18n", "baseline")

GREEN, RED, YELLOW, DIM, OFF = "\033[32m", "\033[31m", "\033[33m", "\033[2m", "\033[0m"
if not sys.stdout.isatty():
    GREEN = RED = YELLOW = DIM = OFF = ""


class Report:
    """Cùng shape với check_lesson.py để evals/run.py nuốt được cả hai."""

    def __init__(self, name):
        self.id = name
        self.rows = []

    def ok(self, m):
        self.rows.append(("ok", m))

    def warn(self, m):
        self.rows.append(("warn", m))

    def fail(self, m):
        self.rows.append(("fail", m))

    @property
    def failed(self):
        return any(k == "fail" for k, _ in self.rows)

    def render(self):
        mark = {"ok": GREEN + "  ok  " + OFF, "warn": YELLOW + " warn " + OFF, "fail": RED + " FAIL " + OFF}
        print("\n" + "─" * 68)
        print(f"  {self.id}")
        print("─" * 68)
        for k, m in self.rows:
            print(f"{mark[k]} {m}")




def only_exports(src, names):
    """Cắt lấy đúng các khai báo `export const <tên> = …` được liệt kê, theo thứ tự trong file.

    Dùng cho file TRỘN data với engine (`vacuum-world.js`): bản EN cố ý chỉ có phần data, vì
    engine đã hết chữ hiển thị nên hai bản dùng chung một bản logic. So cả file thì dãy khóa
    lệch là đương nhiên — mà nhân đôi engine chỉ để chiều bộ kiểm thì đúng là để nó trôi.
    """
    out = []
    for m in re.finditer(r"(?m)^export const (\w+) = ", src):
        if m.group(1) not in names:
            continue
        i = m.end()
        # tới dấu chấm phẩy ở đầu dòng hoặc hết khối
        j = src.find("\n];", i)
        k = src.find("\n};", i)
        cand = [x for x in (j, k) if x != -1]
        end = min(cand) + 3 if cand else len(src)
        out.append(src[m.start():end])
    return "\n".join(out)


def strip_imports(src):
    """Bỏ dòng import/export-from trước khi so.

    Đường dẫn module (`'./vi'`) là chuỗi, nhưng KHÔNG phải nội dung. Bản EN gần như luôn có
    thêm `import type { VI }` mà bản VI không cần — để nguyên thì số chuỗi lệch 1 và mọi phép
    ghép-theo-vị-trí trượt hết một nấc.
    """
    src = re.sub(r"(?m)^\s*(?:import|export)\s[^;\n]*?from\s*(['\"])[^'\"]*\1;?", "", src)
    src = re.sub(r"(?m)^\s*import\s*(['\"])[^'\"]*\1;?", "", src)
    return strip_types(src)


def strip_types(src):
    """Bỏ khai báo `interface`/`type`.

    Thành viên của interface (`topicId: TopicId;`) trông y hệt khóa của object literal với bộ
    rút khóa, nhưng chúng KHÔNG phải nội dung. Bản VI thường giữ khai báo kiểu còn bản EN chỉ
    import kiểu đó về — để nguyên thì hai dãy khóa lệch nhau đúng bằng số thành viên interface,
    và kiểm dừng ngay ở dòng đầu mà không soi được chữ nào.
    """
    out, i = [], 0
    for m in re.finditer(r"(?m)^\s*(?:export\s+)?interface\s+\w+[^{]*\{", src):
        depth, j = 0, m.end() - 1
        while j < len(src):
            depth += (src[j] == "{") - (src[j] == "}")
            if depth == 0:
                break
            j += 1
        out.append(src[i:m.start()])
        i = j + 1
    out.append(src[i:])
    src = "".join(out)
    src = re.sub(r"(?m)^\s*(?:export\s+)?type\s+\w+[^;]*;", "", src)
    # `export const PART_TESTS: TestPart[] = [` — tên biến + chú kiểu cũng trông như một khóa,
    # mà tên export của hai bản thì đương nhiên khác nhau (PART_TESTS vs PART_TESTS_EN).
    return re.sub(r"(?m)^(\s*(?:export\s+)?(?:const|let|var)\s+)\w+\s*:", r"\1_:", src)


def read(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as f:
        return f.read()


def exists(rel):
    return os.path.isfile(os.path.join(ROOT, rel))


def cut(s, n=58):
    s = " ".join(s.split())
    return s if len(s) <= n else s[:n] + "…"


def load_accept():
    with open(ACCEPT, encoding="utf-8") as f:
        return json.load(f)


# ─────────────────────────────── kiểm chung ────────────────────────────────
def check_global(cfg):
    r = Report("chung · toàn repo")

    # 1 · Dependency. In ĐẦU TIÊN vì đây là kiểu hỏng tệ nhất: một `npm install i18next` phá
    #     đúng cái quyết định kiến trúc mà cả thiết kế này dựa vào (ADR-0001 + ADR-0010).
    pkg = json.loads(read("package.json"))
    deps = sorted(pkg.get("dependencies", {}))
    want = sorted(cfg["deps_allowlist"])
    if deps == want:
        r.ok(f"dependency đúng danh sách cho phép: {', '.join(deps)}")
    else:
        extra, missing = set(deps) - set(want), set(want) - set(deps)
        msg = []
        if extra:
            msg.append("THÊM MỚI: " + ", ".join(sorted(extra)))
        if missing:
            msg.append("thiếu: " + ", ".join(sorted(missing)))
        r.fail("dependency lệch — " + " · ".join(msg) + "  (thêm thư viện phải có ADR mới)")

    # 2 · Hai nước đi sai mà thiết kế "locale nằm trong basename" mời gọi.
    bad = []
    for dirpath, dirnames, names in os.walk(os.path.join(ROOT, "src")):
        dirnames[:] = [d for d in dirnames if d != "node_modules"]
        for name in names:
            if not name.endswith((".ts", ".tsx", ".js")):
                continue
            rel = os.path.relpath(os.path.join(dirpath, name), ROOT)
            src = read(rel)
            if re.search(r'<Route\s+path="/en', src):
                bad.append(f"{rel}: có <Route path=\"/en — locale nằm ở basename, KHÔNG có route /en")
            if re.search(r'\bto="/en/', src):
                bad.append(f"{rel}: có to=\"/en/ — Router tự cộng tiền tố, đừng viết tay")
            for m in re.finditer(r'href="(/[^"#][^"]*)"', src):
                if not m.group(1).startswith("//"):
                    bad.append(f"{rel}: href tuyệt đối {m.group(1)} — phải cộng localeBase (ADR-0007)")
    if bad:
        for b in bad[:8]:
            r.fail(b)
    else:
        r.ok("không route /en, không link tuyệt đối viết tay")

    # 3 · topicId phải nằm trong tập đóng, và bảng di trú phải trỏ tới id có thật (ADR-0011).
    topics_src = read("src/content/courses/csc14003/topics.ts")
    ids = set(re.findall(r"'([a-z0-9-]+)'", topics_src.split("] as const")[0]))
    used = set()
    for f in ["src/content/courses/csc14003/session-quizzes.js",
              "src/content/courses/csc14003/session-quizzes.en.js",
              "src/content/courses/csc14003/part-tests.ts"]:
        if exists(f):
            used |= set(re.findall(r"topicId:\s*'([^']+)'", read(f)))
    unknown = sorted(used - ids)
    if unknown:
        r.fail(f"topicId không có trong TOPIC_IDS: {', '.join(unknown)}")
    else:
        r.ok(f"{len(used)} topicId đang dùng đều nằm trong TOPIC_IDS ({len(ids)} id)")

    legacy_vals = set(re.findall(r":\s*'([a-z0-9-]+)',?\s*$", read("src/lib/storage.ts"), re.M))
    legacy_vals |= set(re.findall(r"'(?:Buổi \d+)':\s*'(b\d+)'", read("src/lib/storage.ts")))
    stray = sorted(v for v in legacy_vals if v not in ids and re.fullmatch(r"[a-z][a-z0-9-]*", v))
    stray = [v for v in stray if v not in ("searching", "knowledge", "ml")]  # LEGACY_PART_IDS
    if stray:
        r.fail(f"LEGACY_TOPICS trỏ tới id không tồn tại: {', '.join(stray)} — người học sẽ mất chủ đề")
    else:
        r.ok("LEGACY_TOPICS trỏ tới id có thật (di trú tiến độ an toàn)")

    # 4 · ĐỘ PHỦ UNIT. Kiểm này sinh ra từ một lỗ thật: `part-tests.ts` (36 câu) không nằm
    #     trong pairs của unit nào, nên mọi cổng đều xanh trong khi trang Kiểm tra tổng hợp vẫn
    #     nguyên tiếng Việt ở bản EN. Component thì sạch — DỮ LIỆU nó render mới là chỗ sót.
    #     Không có kiểm này thì cách duy nhất phát hiện là mở trình duyệt lên nhìn.
    declared = set()
    for u in cfg["units"]:
        for pair in u.get("pairs", []):
            declared.add(pair["vi"])
            declared.add(pair["en"])
    exempt = set(cfg.get("undeclared_ok", []))
    undeclared = []
    for base in ("src/content", "src/features", "src/lib", "src/pages", "src/components"):
        for dirpath, dirnames, names in os.walk(os.path.join(ROOT, base)):
            dirnames[:] = [d for d in dirnames if d != "node_modules"]
            for name in names:
                if not name.endswith((".ts", ".tsx", ".js")) or ".en." in name:
                    continue
                rel = os.path.relpath(os.path.join(dirpath, name), ROOT)
                if rel in declared or rel in exempt:
                    continue
                # Chỉ quan tâm file CHỨA CHỮ tiếng Việt trong chuỗi hoặc text node JSX.
                code, strs = scan(read(rel))
                if any(has_vn(x) for _l, _q, x in strs) or any(has_vn(t) for t in jsx_texts(code)):
                    # File nằm trong vi_free của một unit thì đã có người canh rồi.
                    if any(rel in u.get("vi_free", []) for u in cfg["units"]):
                        continue
                    undeclared.append(rel)
    if undeclared:
        for rel in sorted(undeclared)[:8]:
            r.fail(f"{rel}: có chữ tiếng Việt nhưng KHÔNG thuộc unit nào — bản EN sẽ lặng lẽ hiện tiếng Việt")
    else:
        r.ok("mọi file có chữ tiếng Việt đều thuộc một unit (hoặc đã khai miễn trừ)")

    # 5 · File DÙNG CHUNG nhiều buổi phải được TỪNG buổi khai. Lỗ này có thật: unit b2 quên
    #     khai `math-primers.js`, nên thẻ toán nền của bài 2 hiện nguyên tiếng Việt ở bản EN
    #     trong khi mọi cổng vẫn xanh — file có được khai, nhưng ở unit KHÁC.
    shared = {}
    for u in cfg["units"]:
        for pair in u.get("pairs", []):
            if pair.get("scope_key"):
                shared.setdefault(pair["vi"], pair["en"])
    missing = []
    for u in cfg["units"]:
        lid = u.get("lesson_id")
        if not lid:
            continue
        declared = {pair["vi"] for pair in u.get("pairs", [])}
        for vi_rel in shared:
            if vi_rel in declared or not exists(vi_rel):
                continue
            if block_of(read(vi_rel), lid):
                missing.append(f"unit {u['id']} chưa khai {os.path.basename(vi_rel)} (có khối '{lid}')")
    if missing:
        for m in missing:
            r.fail(m + " — khối đó sẽ lặng lẽ hiện tiếng Việt ở bản EN")
    else:
        r.ok(f"{len(shared)} file dùng chung đều được từng buổi khai đủ")

    # 4 · Va tên với prop `t` của <Html>. Cảnh báo chứ không chặn.
    for rel in ["src/lib", "src/content"]:
        for dirpath, _, names in os.walk(os.path.join(ROOT, rel)):
            for name in names:
                if name.endswith((".ts", ".tsx")):
                    p = os.path.relpath(os.path.join(dirpath, name), ROOT)
                    if re.search(r"export\s+(?:function|const)\s+t\b", read(p)):
                        r.warn(f"{p}: export tên `t` — va với prop t của <Html>, đổi tên đi")
    return r


# ───────────────────────────── kiểm theo cặp file ──────────────────────────
def check_pair(r, pair, cfg):
    vi_rel, en_rel, kind = pair["vi"], pair["en"], pair["kind"]
    tag = f"{os.path.basename(vi_rel)} ↔ {os.path.basename(en_rel)}"

    if not exists(vi_rel):
        r.fail(f"{tag}: thiếu bản VI {vi_rel}")
        return
    if not exists(en_rel):
        r.fail(f"{tag}: CHƯA CÓ bản EN — unit chưa xong")
        return

    vi_src, en_src = strip_imports(read(vi_rel)), strip_imports(read(en_rel))
    keep_exports = pair.get("only_exports")
    if keep_exports:
        vi_src, en_src = only_exports(vi_src, keep_exports), only_exports(en_src, keep_exports)
        tag = f"{tag}[{len(keep_exports)} export]"
    scope = pair.get("scope_key")
    if scope:
        bv, be = block_of(vi_src, scope), block_of(en_src, scope)
        if bv is None or be is None:
            r.fail(f"{tag}: không thấy khối '{scope}' ở {'bản VI' if bv is None else 'bản EN'}")
            return
        vi_src, en_src = bv, be
        tag = f"{tag}[{scope}]"
    vi_code, vi_str = scan(vi_src)
    en_code, en_str = scan(en_src)

    keep_vi = set(pair.get("keep_vi_keys", []))
    keep_vals = set(pair.get("keep_vi_values", []))
    en_lines = en_src.splitlines()

    def kept(ln, value):
        """Chuỗi này có nằm dưới một khóa được phép giữ tiếng Việt không?

        So theo CẶP khóa–giá trị chứ không theo đầu dòng: data trong repo viết nhiều khóa chung
        một dòng (`{ no: 'PART I', title: '…', en: 'Nhập môn & Tác tử' }`), neo đầu dòng thì
        đúng những chỗ cần miễn trừ lại trượt hết.

        Và chỉ miễn trừ ĐÚNG khóa đó — khai `keep_vi_keys` không được tắt kiểm cho cả file.
        """
        if ln <= 0 or ln > len(en_lines):
            return False
        line = en_lines[ln - 1]
        # Chuỗi tiếng Việt đứng ở vị trí KHÓA (`'Bài tập': 'Homework'`) là khóa tra cứu ánh xạ
        # TỪ bản Việt, không phải chữ hiển thị — nó BẮT BUỘC phải là tiếng Việt. Đây là mẫu
        # chung cho mọi bảng tra VI→EN, nên xử ở đây thay vì miễn trừ từng chỗ.
        if re.search(r"(['\"])%s\1\s*:" % re.escape(value), line):
            return True
        # Cột song ngữ cố ý nằm trong MẢNG THEO VỊ TRÍ (FIELDS: [en, vi, mô tả]) nên không có
        # khóa để bám. Khai thẳng giá trị được phép giữ tiếng Việt.
        if value.strip() in keep_vals:
            return True
        if not keep_vi:
            return False
        return any(re.search(r"['\"]?%s['\"]?\s*:\s*(['\"])%s\1" % (re.escape(k), re.escape(value)), line)
                   for k in keep_vi)

    # Bản DẪN XUẤT (`{...VI, ...OVERRIDE[id]}`) cố ý KHÁC hình dạng bản gốc, nên so thứ tự
    # khóa là vô nghĩa. Cấu trúc đã do `tsc` canh (kiểu `Course` + phép trải). Thứ `tsc`
    # KHÔNG thấy — và là lý do nhánh này tồn tại — là ĐỘ PHỦ: `Record<string, …>` là kiểu mở,
    # nên quên một id thì `{...s, ...undefined}` trải ra rỗng, không lỗi, không cảnh báo, và
    # buổi đó lặng lẽ hiện tiếng Việt trong bản tiếng Anh.
    if kind == "ts-derived":
        ids = re.findall(r"\bid:\s*'([\w-]+)'", vi_src)
        missing = [i for i in ids if not re.search(r"(?m)^\s*'?%s'?\s*:" % re.escape(i), en_src)]
        if missing:
            r.fail(f"{tag}: bản EN thiếu {len(missing)} id — {', '.join(missing[:8])} "
                   f"(sẽ lặng lẽ hiện tiếng Việt)")
        else:
            r.ok(f"{tag}: dẫn xuất phủ đủ {len(ids)} id")
        left = [(ln, e) for ln, _q, e in en_str if has_vn(e) and not kept(ln, e)]
        if left:
            r.fail(f"{tag}: {len(left)} chuỗi còn tiếng Việt — dòng "
                   + ", ".join(str(l) for l, _ in left[:6]) + f"  ‹{cut(left[0][1])}›")
        else:
            r.ok(f"{tag}: bản EN không sót tiếng Việt ngoài khóa được phép")
        return

    # A · Thứ tự khóa giống hệt. Đây là VIÊN ĐÁ KHÓA: nó làm cho phép ghép-theo-vị-trí ở các
    #     kiểm B–F đứng vững, và làm hai file diff cạnh nhau đọc được.
    vk, ek = key_names(vi_code), key_names(en_code)
    if vk != ek:
        i = next((i for i in range(min(len(vk), len(ek))) if vk[i] != ek[i]), min(len(vk), len(ek)))
        r.fail(f"{tag}: dãy khóa lệch tại vị trí {i} — VI '{vk[i] if i < len(vk) else '∅'}' vs "
               f"EN '{ek[i] if i < len(ek) else '∅'}' ({len(vk)} vs {len(ek)} khóa)")
        return  # ghép theo vị trí không còn đáng tin — dừng, sửa cái này trước
    r.ok(f"{tag}: {len(vk)} khóa khớp thứ tự")

    if len(vi_str) != len(en_str):
        r.fail(f"{tag}: số chuỗi lệch ({len(vi_str)} vs {len(en_str)}) — ghép theo vị trí không đáng tin")
        return

    untranslated, vn_left, tag_bad, anchor_bad, num_bad, code_bad = [], [], [], [], [], []
    # `eln` là số dòng BÊN BẢN EN. Dùng nhầm `ln` (dòng bên VI) để tra dòng của file EN
    # thì miễn trừ `keep_vi_keys` trượt chỗ ngay khi hai file lệch số dòng đầu file.
    for (ln, _q, v), (eln, _q2, e) in zip(vi_str, en_str):
        # B · Còn nguyên si bản Việt. Chuỗi ngắn giống nhau ('A*', 'PEAS', '1956') là BÌNH THƯỜNG.
        # Chỉ kết luận "chưa dịch" khi bản VI thật sự CÓ tiếng Việt. Chuỗi nguồn vốn đã là
        # tiếng Anh hoặc trung tính ('Systems that think like humans', 'THINKING HUMANLY')
        # thì giống hệt nhau là ĐÚNG — trước đây ngưỡng độ dài bắt oan đúng nhóm này.
        # `kept` cũng phải áp ở đây: cột song ngữ CỐ Ý giống hệt nhau ở hai bản, nên nó
        # rơi vào nhánh "chưa dịch" chứ không phải nhánh "còn tiếng Việt".
        if v == e and has_vn(v) and not is_notation(v) and not kept(eln, e):
            untranslated.append((ln, v))
        # C · Sót tiếng Việt trong bản EN.
        elif has_vn(e) and not kept(eln, e):
            vn_left.append((ln, e))
        # D · Cấu trúc thẻ HTML — dịch mà rơi mất <strong class='hl'> là mất luôn phần nhấn.
        # Code is rendered as text by <Code>, so comparisons such as "< g"
        # are not HTML tags. Its executable Python is checked separately below.
        code_sample = kind == "js-code" and _q == "`" and bool(re.search(r"(?m)^(?:def |function )", v))
        if not code_sample and tags(v) != tags(e):
            tag_bad.append((ln, cut(v)))
        # E · Anchor phải trỏ cùng chỗ, nếu không switchTo() giữ hash sẽ rơi vào hư không.
        if anchors(v) != anchors(e):
            anchor_bad.append((ln, cut(v)))
        # F · Số liệu và định danh code: đổi giọng được, đổi số thì không.
        if not digits_ok(v, e):
            num_bad.append((ln, f"VI {digits(v)} vs EN {digits(e)}"))
        # Chỉ so những mẩu code KHÔNG chứa tiếng Việt. `<span class="code-inline">` đôi khi bọc
        # văn xuôi chứ không bọc định danh (`[vị trí, tình trạng]` mô tả một cặp tri giác) —
        # thứ đó BẮT BUỘC phải dịch. Cái kiểm này sinh ra để giữ `max_depth`, `runTrace`,
        # KaTeX; đem nó chặn cả văn trong khối mono là chặn nhầm.
        # So THEO CẶP và bỏ qua cặp nào bên VI có tiếng Việt: `<span class="code-inline">` đôi
        # khi bọc văn xuôi (`NẾU… THÌ…`, `[vị trí, tình trạng]`) chứ không bọc định danh —
        # thứ đó phải dịch. Lọc rời từng bên thì độ dài lệch và báo oan.
        bv, be = code_bits(v), code_bits(e)
        if len(bv) != len(be) or any(x != y for x, y in zip(bv, be) if not has_vn(x)):
            code_bad.append((ln, cut(v)))

    for label, items, lvl in [
        ("chưa dịch (EN trùng si VI)", untranslated, "fail"),
        ("còn tiếng Việt trong bản EN", vn_left, "fail"),
        ("cấu trúc thẻ HTML lệch", tag_bad, "fail"),
        ("anchor #id lệch", anchor_bad, "fail"),
        ("SỐ LIỆU lệch", num_bad, "fail"),
        ("định danh code/KaTeX lệch", code_bad, "fail"),
    ]:
        if items:
            getattr(r, lvl)(f"{tag}: {len(items)} chỗ {label} — dòng "
                            + ", ".join(str(l) for l, _ in items[:6])
                            + (f"  ‹{items[0][1]}›" if items else ""))
    if not any([untranslated, vn_left, tag_bad, anchor_bad, num_bad, code_bad]):
        r.ok(f"{tag}: {len(vi_str)} chuỗi — đã dịch, thẻ/số/anchor/code khớp")

    # G · tup() phải cùng arity ở cả hai (tsc đã bắt cho .ts; đây là lưới cho .js).
    va = re.findall(r"tup\((.*?)\)", vi_code, re.S)
    ea = re.findall(r"tup\((.*?)\)", en_code, re.S)
    if len(va) == len(ea) and any(a.count(",") != b.count(",") for a, b in zip(va, ea)):
        r.fail(f"{tag}: có tup() lệch số phần tử")

    # H2 · Bộ đề .ts nguyên file: EN phải chấm Y HỆT VI.
    if kind == "ts-quiz":
        def facts(src):
            return (re.findall(r"topicId:\s*'([^']+)'", src),
                    re.findall(r"\ba:\s*(\d+)", src),
                    re.findall(r"tex:\s*'([^']*)'", src),
                    [len(scan(m)[1]) for m in re.findall(r"opts:\s*\[(.*?)\]", src, re.S)])
        tv, av, xv, ov = facts(vi_src)
        te, ae, xe, oe = facts(en_src)
        if tv != te:
            r.fail(f"{tag}: dãy topicId lệch — tiến độ sẽ tách đôi theo ngôn ngữ")
        elif av != ae:
            bad = [i for i, (a, b) in enumerate(zip(av, ae)) if a != b]
            r.fail(f"{tag}: ĐÁP ÁN ĐÚNG lệch ở câu {bad[:5]} — bản EN chấm khác bản VI")
        elif xv != xe:
            r.fail(f"{tag}: công thức KaTeX (tex:) lệch — công thức không được dịch")
        elif ov != oe:
            bad = [i for i, (a, b) in enumerate(zip(ov, oe)) if a != b]
            r.fail(f"{tag}: số phương án lệch ở câu {bad[:5]}")
        else:
            r.ok(f"{tag}: {len(tv)} câu — cùng topicId, cùng đáp án, cùng công thức, cùng số phương án")

    # H · Quiz: EN phải chấm y hệt VI, nếu không tiến độ tách đôi âm thầm.
    if kind == "js-quiz":
        nv, ne = vi_src.count("topicId:"), en_src.count("topicId:")
        av, ae = re.findall(r"\ba:\s*(\d+)", vi_src), re.findall(r"\ba:\s*(\d+)", en_src)
        tv, te = re.findall(r"topicId:\s*'([^']+)'", vi_src), re.findall(r"topicId:\s*'([^']+)'", en_src)
        if nv != ne:
            r.fail(f"{tag}: số câu lệch {nv} vs {ne}")
        elif av != ae:
            r.fail(f"{tag}: đáp án đúng lệch — quiz EN chấm khác quiz VI")
        elif tv != te:
            r.fail(f"{tag}: topicId lệch — tiến độ sẽ tách đôi theo ngôn ngữ")
        else:
            r.ok(f"{tag}: {nv} câu, cùng đáp án, cùng topicId")

    # I · Code mẫu học viên copy: comment được dịch, CODE thì không được trôi.
    if kind == "js-code":
        def strip_comments(block):
            block = re.sub(r'"""[\s\S]*?"""', "", block)
            block = re.sub(r"#.*", "", block)
            return [l.rstrip() for l in block.splitlines() if l.strip()]
        # Executable Python must remain identical except comments/docstrings.
        # Pseudocode also contains "return", but its natural-language steps
        # must be translated; the normal number/markup checks still cover it.
        pv = [s for _, q, s in vi_str if q == "`" and re.search(r"(?m)^def \w+\(", s)]
        pe = [s for _, q, s in en_str if q == "`" and re.search(r"(?m)^def \w+\(", s)]
        drift = [i for i, (a, b) in enumerate(zip(pv, pe)) if strip_comments(a) != strip_comments(b)]
        if len(pv) != len(pe):
            r.fail(f"{tag}: số khối code lệch ({len(pv)} vs {len(pe)})")
        elif drift:
            r.fail(f"{tag}: CODE trôi (không chỉ comment) ở {len(drift)} khối: #{drift[:4]}")
        else:
            r.ok(f"{tag}: {len(pv)} khối code — comment dịch, code y nguyên")


# ─────────────────────── tách chuỗi: chụp mốc & đối chiếu ──────────────────
def vn_strings_of(rel):
    """Mọi chuỗi tiếng Việt trong một file — CẢ string literal LẪN text node JSX."""
    code, strs = scan(read(rel))
    # Keep historical snapshots stable: their original accent detector also
    # included proper names. Extraction must still prove those names survived.
    out = [s for _l, _q, s in strs if raw_has_vn(s)]
    out += [t for t in jsx_texts(code) if raw_has_vn(t)]
    return [" ".join(unescape(s).split()) for s in out]


def prose(s):
    """Rút phần VĂN của một chuỗi, bỏ hết vỏ kỹ thuật.

    Việc tách chuỗi hợp lệ ĐƯỢC PHÉP đổi vỏ: `'Trả lời sai: ' + list + '.'` thành hàm
    `` (list) => `Trả lời sai: ${list}.` ``, hay `${nextSession.title}` thành `${title}` khi
    chuỗi chuyển vào hàm có tham số tên khác. So thô thì cả hai đều báo "làm rơi" — mà một
    công cụ kêu oan là một công cụ bị phớt lờ, tức là mất luôn cái lưới quan trọng nhất.

    Nên ta so PHẦN CHỮ: bỏ mọi ${…}, hạ chữ thường, gom mọi thứ không phải chữ/số thành một
    dấu cách. Cái audit này canh "có câu tiếng Việt nào biến mất không", không phải "cú pháp
    có đổi không".
    """
    s = re.sub(r"\$\{[^}]*\}", " ", s)
    s = re.sub(r"[^0-9A-Za-z" + VN + VN.upper() + r"]+", " ", s)
    return " ".join(s.lower().split())


def snapshot(unit):
    """Chụp mốc chuỗi tiếng Việt TRƯỚC khi tách.

    GỘP chứ không đè: file nào đã có mốc thì giữ nguyên mốc cũ. Nếu đè, chạy lại snapshot sau
    khi đã tách một file sẽ ghi đè mốc bằng chính trạng thái ĐÃ tách — mốc thành vô nghĩa mà
    vẫn báo xanh. Nhờ gộp, thêm file vào `extract_from` giữa chừng vẫn an toàn.
    """
    files = unit.get("extract_from", [])
    path = os.path.join(BASELINE, unit["id"] + ".json")
    data = {}
    if os.path.isfile(path):
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
    added = [rel for rel in files if exists(rel) and rel not in data]
    for rel in added:
        data[rel] = vn_strings_of(rel)
    if not added:
        print(f"{DIM}(mốc {unit['id']} đã có đủ {len(data)} file — không đụng vào){OFF}")
    os.makedirs(BASELINE, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    total = sum(len(v) for v in data.values())
    print(f"{GREEN}✓{OFF} chụp mốc {unit['id']}: {total} chuỗi tiếng Việt từ {len(data)} file")
    print(f"  → {os.path.relpath(path, ROOT)}")
    print(f"{DIM}  Chạy TRƯỚC khi tách. Sau mỗi mục tách xong thì --extraction-audit.{OFF}")
    return 0


def extraction_audit(r, unit):
    """Rủi ro lớn nhất của cả dự án không phải dịch, mà là moi ruột JSX rồi LÀM RƠI một câu."""
    path = os.path.join(BASELINE, unit["id"] + ".json")
    if not os.path.isfile(path):
        r.warn(f"chưa có mốc — chạy `check_i18n.py {unit['id']} --snapshot` TRƯỚC khi tách chuỗi")
        return
    with open(path, encoding="utf-8") as f:
        base = json.load(f)
    before = set()
    for v in base.values():
        before |= set(v)
    after = set()
    for rel in unit.get("extract_from", []) + unit.get("extract_into", []):
        if exists(rel):
            after |= set(vn_strings_of(rel))
    # Một "đụn cỏ" gồm toàn bộ văn hiện có. Chuỗi mốc còn sống nếu phần chữ của nó vẫn nằm
    # đâu đó trong đụn — kể cả khi đã bị cắt nhỏ hay gộp lại thành hàm.
    hay = " ⋄ ".join(sorted(prose(s) for s in after))
    gone = [s for s in before if prose(s) and prose(s) not in hay]

    # Phân biệt BIẾN MẤT với ĐƯỢC SỬA. Sau khi tách xong, nội dung vẫn có thể được sửa có chủ
    # đích (đính chính một con số chẳng hạn) — báo chuyện đó là "làm rơi" thì công cụ kêu oan,
    # mà công cụ kêu oan là công cụ bị phớt lờ. Chuỗi nào còn một bản gần giống trong hiện tại
    # thì đó là bản SỬA; chỉ chuỗi không còn dấu vết nào mới là mất thật.
    after_words = [set(prose(s).split()) for s in after if prose(s)]
    lost, edited = [], []
    for s in gone:
        w = set(prose(s).split())
        if not w:
            continue
        near = max((len(w & a) / len(w) for a in after_words), default=0)
        (edited if near >= 0.6 else lost).append(s)

    if lost:
        r.fail(f"TÁCH LÀM RƠI {len(lost)} chuỗi tiếng Việt — ví dụ: ‹{cut(sorted(lost, key=len)[-1], 70)}›")
        for s in sorted(lost, key=len, reverse=True)[1:5]:
            r.fail(f"  cũng rơi: ‹{cut(s, 70)}›")
    else:
        r.ok(f"tách không rơi chữ nào ({len(before)} chuỗi mốc đều còn)")
    if edited:
        r.warn(f"{len(edited)} chuỗi đã được SỬA so với mốc (còn bản gần giống — không phải mất): "
               f"‹{cut(edited[0], 60)}›")


def check_unit(unit, cfg):
    r = Report(f"{unit['id']} · {unit['title']}")
    for pair in unit.get("pairs", []):
        check_pair(r, pair, cfg)

    exempt = set(cfg.get("vi_free_exempt", []))
    dirty = []
    for rel in unit.get("vi_free", []):
        if rel in exempt or not exists(rel):
            continue
        code, strs = scan(read(rel))
        hits = [(l, s) for l, _q, s in strs if has_vn(s)]
        # Text node JSX nằm NGOÀI string literal — phải bắt riêng, nếu không là xanh giả.
        hits += [(0, t) for t in jsx_texts(code) if has_vn(t)]
        if hits:
            dirty.append((rel, len(hits), hits[0]))
    if dirty:
        for rel, n, (ln, s) in dirty[:6]:
            r.fail(f"{rel}: còn {n} chuỗi tiếng Việt (dòng {ln}: ‹{cut(s)}›) — chưa tách xong")
    elif unit.get("vi_free"):
        r.ok(f"{len(unit['vi_free'])} file đã sạch chuỗi tiếng Việt")

    if "extraction" in unit.get("gates", []):
        extraction_audit(r, unit)

    eng = unit.get("engine")
    if eng and exists(eng["file"]):
        # Import bị BIẾN CỤC BỘ CÙNG TÊN che mất. File engine là .js nên `checkJs: false` —
        # tsc không kiểm, `npm run build` xanh, và lỗi chỉ nổ lúc chạy. Đã dính thật: engine
        # dùng `const N = m.length` làm số đỉnh, trùng đúng tên biến import lời kể.
        esrc = read(eng["file"])
        m = re.search(r"import\s*\{[^}]*\bas\s+(\w+)|import\s*\{\s*(\w+)\s*\}", esrc)
        if m:
            binding = m.group(1) or m.group(2)
            if re.search(r"\b(?:const|let|var)\s+%s\b" % re.escape(binding), esrc):
                r.fail(f"{eng['file']}: biến cục bộ `{binding}` che mất import cùng tên — "
                       f"tsc KHÔNG bắt được (checkJs: false), chỉ nổ lúc chạy")
            else:
                r.ok(f"{eng['file']}: import `{binding}` không bị biến cục bộ che")
        # Mọi khóa engine gọi phải có trong bundle lời kể, và ngược lại không được thừa.
        called = set(re.findall(r"\b\w+\.(n\d+)\b", esrc))
        vi_rel = eng["narrate"].replace(".ts", ".vi.ts")
        if called and exists(vi_rel):
            declared = set(re.findall(r"(?m)^\s*(n\d+)\s*:", read(vi_rel)))
            miss = sorted(called - declared, key=lambda x: int(x[1:]))
            extra = sorted(declared - called, key=lambda x: int(x[1:]))
            if miss:
                r.fail(f"engine gọi khóa lời kể không có trong bundle: {', '.join(miss[:6])}")
            elif extra:
                r.warn(f"bundle lời kể có khóa không ai gọi: {', '.join(extra[:6])}")
            else:
                r.ok(f"{len(called)} khóa lời kể: engine gọi và bundle khai khớp nhau")
        if re.search(r"txt:\s*[`'\"]", esrc):
            r.fail(f"{eng['file']}: còn ráp câu hiển thị (txt: literal) — phải lấy từ bundle lời kể (ADR-0012)")
        else:
            r.ok(f"{eng['file']}: không còn chuỗi hiển thị ráp trong engine")

    return r


def main():
    args = sys.argv[1:]
    as_json = "--json" in args
    do_snap = "--snapshot" in args
    ids = [a for a in args if not a.startswith("-")]
    cfg = load_accept()
    units = {u["id"]: u for u in cfg["units"]}

    if do_snap:
        if not ids:
            print("--snapshot cần tên unit, ví dụ: check_i18n.py b1 --snapshot")
            return 2
        for i in ids:
            snapshot(units[i])
        return 0

    unknown = [i for i in ids if i not in units]
    if unknown:
        print(f"không có unit: {', '.join(unknown)}  (có: {', '.join(units)})")
        return 2

    reports = [check_global(cfg)]
    for i in (ids or list(units)):
        reports.append(check_unit(units[i], cfg))

    if as_json:
        print(json.dumps({
            "units": [{"id": r.id, "failed": r.failed,
                       "counts": {k: sum(1 for kk, _ in r.rows if kk == k) for k in ("ok", "warn", "fail")},
                       "rows": [{"kind": k, "msg": m} for k, m in r.rows]} for r in reports],
            "failed": any(r.failed for r in reports),
        }, ensure_ascii=False, indent=2))
        return 1 if any(r.failed for r in reports) else 0

    for rep in reports:
        rep.render()
    bad = [r.id for r in reports if r.failed]
    print()
    print(f"{RED}✗ còn lỗi: {', '.join(bad)}{OFF}" if bad else f"{GREEN}✓ qua hết phần kiểm song ngữ.{OFF}")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
