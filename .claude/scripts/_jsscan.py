"""Quét mã JS/TS đủ dùng cho việc đối chiếu song ngữ — không phải parser thật.

Viết tay vì lý do đã ghi ở ADR-0001: repo giữ Vite trần, không thêm dependency, và một
tokenizer bám trạng thái ~60 dòng đủ chính xác hơn hẳn regex trần. Cái regex trần không làm
nổi là: `//` nằm TRONG chuỗi (URL), dấu nháy nằm trong comment, và chuỗi nhiều dòng.
"""
import re

# Ký tự riêng của tiếng Việt. Không dùng dải Unicode chung vì tiếng Anh cũng có ký tự có dấu.
VN = "àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ"
VN_RE = re.compile("[" + VN + VN.upper() + "]")


def scan(text):
    """→ (code_khong_comment, [(vi_tri_dong, kieu_nhay, noi_dung_chuoi)])

    Giữ nguyên độ dài khi xóa comment (thay bằng khoảng trắng) để số dòng không lệch.
    """
    out, strings = [], []
    i, n, line = 0, len(text), 1
    while i < n:
        c = text[i]
        nxt = text[i + 1] if i + 1 < n else ""
        if c == "/" and nxt == "/":
            while i < n and text[i] != "\n":
                out.append(" ")
                i += 1
            continue
        if c == "/" and nxt == "*":
            while i < n and not (text[i] == "*" and i + 1 < n and text[i + 1] == "/"):
                out.append("\n" if text[i] == "\n" else " ")
                if text[i] == "\n":
                    line += 1
                i += 1
            out.append("  ")
            i += 2
            continue
        if c in "'\"`":
            quote, start_line, buf = c, line, []
            i += 1
            out.append(" ")
            while i < n:
                d = text[i]
                if d == "\\":
                    buf.append(text[i:i + 2])
                    out.append("  ")
                    i += 2
                    continue
                if d == quote:
                    break
                if d == "\n":
                    line += 1
                    out.append("\n")
                else:
                    out.append(" ")
                buf.append(d)
                i += 1
            i += 1
            out.append(" ")
            strings.append((start_line, quote, "".join(buf)))
            continue
        if c == "\n":
            line += 1
        out.append(c)
        i += 1
    return "".join(out), strings


def keys_in_order(code):
    """Tên khóa của object literal, theo đúng thứ tự xuất hiện. Chạy trên code ĐÃ bỏ comment.

    KHÔNG neo vào đầu dòng: data trong repo này viết nhiều khóa chung một dòng
    (`{ id: 'x', col: 1, row: 0 }`), neo đầu dòng thì bỏ sót gần hết.

    Có bắt nhầm vài thứ không phải khóa (nhãn, `cond ? a : b`, chú kiểu TS). Không sao —
    hai file chạy qua CÙNG một bộ rút, nên cái nhầm giống nhau ở cả hai bên và phép SO SÁNH
    vẫn đúng. Thứ ta cần là hai dãy khớp nhau, không phải một dãy khóa hoàn hảo.
    """
    return re.findall(r"(?:'([A-Za-z0-9_$-]+)'|\"([A-Za-z0-9_$-]+)\"|([A-Za-z_$][\w$]*))\s*:", code)


def key_names(code):
    return ["".join(t) for t in keys_in_order(code)]


def has_vn(s):
    return bool(VN_RE.search(s))


def tags(s):
    return re.findall(r"<[^>]+>", s)


def anchors(s):
    return re.findall(r"href=['\"]#([\w-]+)", s)


# Viết số bằng chữ trong tiếng Anh. Dịch "số 0" thành "zero" là chọn cách diễn đạt, không
# phải sửa số liệu — quy về chữ số trước khi so thì kiểm mới phân biệt được hai việc đó.
_WORD_NUM = {"zero": "0", "one": "1", "two": "2", "three": "3", "four": "4", "five": "5",
             "six": "6", "seven": "7", "eight": "8", "nine": "9", "ten": "10",
             "eleven": "11", "twelve": "12"}

# Tiếng Việt viết tháng bằng SỐ ("tháng 10 năm 1950"), tiếng Anh viết bằng TÊN ("October 1950").
# Cùng một dữ kiện, khác cách viết — nên tên tháng cũng bù được cho chữ số bị thiếu.
# Khớp CÓ PHÂN BIỆT HOA THƯỜNG: "May" là tháng Năm, còn "may" là động từ rất hay gặp; lẫn hai
# cái đó thì một số 5 bị đánh rơi vẫn lọt qua.
_MONTHS = {"January": "1", "February": "2", "March": "3", "April": "4", "May": "5", "June": "6",
           "July": "7", "August": "8", "September": "9", "October": "10", "November": "11",
           "December": "12"}


def _no_interp(s):
    """Thay ${…} bằng khoảng trắng. Không có bước này thì `${a} x ${b}` trông y hệt KaTeX $…$."""
    return re.sub(r"\$\{[^}]*\}", " ", s)


def digits(s):
    """Chữ số, đã bỏ dấu phân nhóm — nên 1.398.100 và 1,398,100 là một."""
    return sorted(re.findall(r"\d+", re.sub(r"(?<=\d)[.,](?=\d)", "", _no_interp(s))))


def digits_ok(vi, en):
    """Số liệu hai bản có khớp không, CÓ NƯƠNG cho việc viết số bằng chữ.

    Bất đối xứng có chủ đích. Bản EN được phép viết "zero" thay cho "0" (`Học AI từ số 0` →
    `Learn AI from zero`) — đó là cách diễn đạt. Nhưng chữ "one" trong "one section at a time"
    KHÔNG được đẻ ra một con số: quy hai chiều thì mọi câu tiếng Anh có "one/two" đều báo oan.

    Nên: chỉ những chữ số bản VI CÓ mà bản EN thiếu mới được bù bằng chữ; EN có chữ số lạ mà
    VI không có thì vẫn là FAIL.
    """
    dv, de = digits(vi), digits(en)
    if dv == de:
        return True
    from collections import Counter
    cv, ce = Counter(dv), Counter(de)
    if ce - cv:              # EN có số VI không có → số liệu đã đổi thật
        return False
    low = _no_interp(en).lower()
    for d, n in (cv - ce).items():
        word = next((w for w, v in _WORD_NUM.items() if v == d), None)
        got = len(re.findall(r"\b" + word + r"\b", low)) if word else 0
        month = next((w for w, v in _MONTHS.items() if v == d), None)
        if month:
            got += len(re.findall(r"\b" + month + r"\b", _no_interp(en)))  # phân biệt hoa thường
        if got < n:
            return False
    return True


def code_bits(s):
    """Định danh code + KaTeX — thứ tuyệt đối không được dịch."""
    s = _no_interp(s)
    bits = re.findall(r"class=['\"]code-inline['\"]>(.*?)<", s)
    bits += re.findall(r"\\[a-zA-Z]+", s)
    bits += re.findall(r"\$[^$]+\$", s)
    return sorted(bits)


def _drop_braces(s):
    """Bỏ mọi biểu thức {…} kể cả lồng nhau, giữ lại phần chữ thuần."""
    out, depth = [], 0
    for c in s:
        if c == "{":
            depth += 1
        elif c == "}":
            depth = max(0, depth - 1)
            out.append(" ")
        elif depth == 0:
            out.append(c)
    return "".join(out)


def jsx_texts(code):
    """Chữ nằm TRỰC TIẾP trong JSX (`<p>chữ ở đây</p>`), chạy trên code đã bỏ comment+chuỗi.

    Bắt buộc phải có: hơn một nửa tiếng Việt trong ba trang bài học là text node chứ không
    phải string literal. Chỉ soi string literal thì `vi_free` sẽ xanh trong khi trang vẫn còn
    nguyên tiếng Việt — xanh giả ở đúng chỗ nguy hiểm nhất.

    Và phải xử được text node TRỘN biểu thức với chữ (`<span>{minutes} PHÚT</span>`): bỏ qua
    cả node chỉ vì nó có dấu ngoặc nhọn là bỏ sót đúng nhóm chữ hay bị quên nhất — nhãn ngắn
    quanh một con số.
    """
    out = []
    for m in re.finditer(r">([^<>]+)<", code):
        for part in _drop_braces(m.group(1)).split():
            pass
        txt = " ".join(_drop_braces(m.group(1)).split())
        if txt:
            out.append(txt)
    return out


# Ký hiệu hình thức: logic, tập hợp, phép thế. Chuỗi kiểu này GIỐNG HỆT nhau ở hai bản là đúng
# — `∀x Student(x) ∧ StudyAt(x, hcmus)` không có gì để dịch. Nếu không loại ra thì kiểm "chưa
# dịch" kêu oan ở đúng những câu logic, và người ta sẽ học cách phớt lờ nó.
_NOTATION = set("∀∃∧∨¬⇒⇔⊨⊕∑∏Σ⊂⊆∈≠≤≥→←↔√∂∫")


def is_notation(s):
    t = s.strip()
    if any(c in _NOTATION for c in t):
        return True
    # KaTeX: `P(A\\mid B) = \\dfrac{…}`. Kiểm ts-quiz ĐÒI hai bản có tex y hệt nhau, nên báo
    # chính chuỗi đó là "chưa dịch" thì hai kiểm tự cãi nhau.
    if re.search(r"\\[a-zA-Z]{2,}", t):
        return True
    # {x/John, y/Mary} — phép thế; [3, 12] — danh sách lá
    return bool(re.fullmatch(r"[\[{][^A-Za-zÀ-ỹ]*[\w/,.\s|·−-]*[\]}]", t))


def scan_pos(text):
    """Như scan() nhưng trả kèm VỊ TRÍ ký tự của từng chuỗi: (start, end, quote, content).

    start/end là chỉ số của NỘI DUNG (không gồm dấu nháy). Vì scan() thay comment và chuỗi
    bằng khoảng trắng CÙNG ĐỘ DÀI, chỉ số trong `code` trùng khít chỉ số trong `text` — nhờ đó
    tìm text node JSX trên `code` rồi cắt thẳng trên `text` được, không lệch một ký tự nào.
    """
    out, strings = [], []
    i, n = 0, len(text)
    while i < n:
        c = text[i]
        nxt = text[i + 1] if i + 1 < n else ""
        if c == "/" and nxt == "/":
            while i < n and text[i] != "\n":
                out.append(" ")
                i += 1
            continue
        if c == "/" and nxt == "*":
            while i < n and not (text[i] == "*" and i + 1 < n and text[i + 1] == "/"):
                out.append("\n" if text[i] == "\n" else " ")
                i += 1
            out.append("  ")
            i += 2
            continue
        if c in "'\"`":
            quote, start = c, i + 1
            i += 1
            out.append(" ")
            while i < n:
                d = text[i]
                if d == "\\":
                    out.append("  ")
                    i += 2
                    continue
                if d == quote:
                    break
                out.append("\n" if d == "\n" else " ")
                i += 1
            strings.append((start, i, quote, text[start:i]))
            out.append(" ")
            i += 1
            continue
        out.append(c)
        i += 1
    return "".join(out), strings


_ESC = {"n": "\n", "t": "\t", "r": "\r", "0": "\0"}


def unescape(s):
    """Giải mã escape trong chuỗi nguồn: `\\n` (2 ký tự) thành xuống dòng thật.

    scan() giữ escape ở dạng thô, nên một khối mã giả nhiều dòng nằm trong bundle sẽ mang chữ
    `n` thừa ở mỗi chỗ xuống dòng. Đối chiếu tách chuỗi mà không giải mã thì khối đó trông như
    "đã biến mất" — kêu oan đúng vào loại chuỗi dài nhất, khó soi bằng mắt nhất.
    """
    out, i = [], 0
    while i < len(s):
        if s[i] == "\\" and i + 1 < len(s):
            out.append(_ESC.get(s[i + 1], s[i + 1]))
            i += 2
        else:
            out.append(s[i])
            i += 1
    return "".join(out)


def block_of(src, key):
    """Cắt lấy khối `<key>: [...]` hoặc `<key>: {...}`, khớp ngoặc.

    Dùng cho file dùng chung nhiều buổi (`session-quizzes`, `math-primers`): trong lúc dịch dần
    từng buổi, bản EN CỐ Ý chỉ có buổi đã xong. So cả file thì dãy khóa lệch là đương nhiên và
    kiểm mất tác dụng — nên khi khai `scope_key`, chỉ so đúng khối của buổi đó.
    """
    m = re.search(r"\b%s\s*:\s*([\[{])" % re.escape(key), src)
    if not m:
        return None
    open_c = m.group(1)
    close_c = "]" if open_c == "[" else "}"
    i = m.end() - 1
    depth = 0
    for j in range(i, len(src)):
        if src[j] == open_c:
            depth += 1
        elif src[j] == close_c:
            depth -= 1
            if depth == 0:
                return src[i:j + 1]
    return None
