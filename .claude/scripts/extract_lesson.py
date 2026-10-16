#!/usr/bin/env python3
"""Rút chữ tiếng Việt từ một trang bài học ra bundle `*.text.vi.ts`, thay bằng `T.<khóa>`.

LƯU Ý cho file scenes: các hàm vẽ dùng biến cục bộ `T` làm THỜI GIAN của vòng rAF, nên ở đó
phải import dưới bí danh (`import { T as TXT }`). Trang bài học thì không vướng.

    python3 .claude/scripts/extract_lesson.py b1 --dry     # xem trước, không sửa gì
    python3 .claude/scripts/extract_lesson.py b1

CÔNG CỤ CƠ HỌC, KHÔNG DỊCH GÌ. Tiêu chí đúng duy nhất: trang tiếng Việt render y hệt như trước.
Chạy `check_i18n.py <unit> --extraction-audit` ngay sau để chứng minh không rơi chữ nào.

Chuỗi có `${…}` thì BỎ QUA và báo ra — chúng phải thành hàm trong bundle, và hàm thì cần người
đặt tên tham số cho tử tế. Số này ít (b1 có 1).
"""
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _jsscan import scan_pos, has_vn  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ACCEPT = os.path.join(ROOT, ".claude", "i18n", "acceptance.json")
GREEN, RED, YELLOW, DIM, OFF = "\033[32m", "\033[31m", "\033[33m", "\033[2m", "\033[0m"


def sections(src):
    """(offset, tên mục) theo thứ tự — lấy từ `id="…"`, là cái neo mà cả nav lẫn deck đã dùng.

    Phải dò trên NGUỒN GỐC chứ không phải `code` đã bôi trắng: giá trị của `id="ch1"` là một
    chuỗi literal nên trong `code` nó đã thành khoảng trắng. Offset hai bên trùng nhau nên
    dùng nguồn gốc không lệch gì.
    """
    return [(m.start(), m.group(1)) for m in re.finditer(r'id="([\w-]+)"', src)]


def section_at(secs, pos):
    name = "hero"
    for off, s in secs:
        if off <= pos:
            name = s
        else:
            break
    return re.sub(r"\W", "_", name)


def extract(page_rel, dry=False, prefix=None):
    path = os.path.join(ROOT, page_rel)
    src = open(path, encoding="utf-8").read()
    code, strs = scan_pos(src)
    secs = sections(src)

    targets, skipped = [], []

    # 1 · chuỗi literal
    for a, b, q, content in strs:
        if not has_vn(content):
            continue
        if "${" in content:
            skipped.append((a, content))
            continue
        before = src[max(0, a - 2):a - 1]
        kind = "attr" if before == "=" else "expr"
        targets.append((a - 1, b + 1, content, kind))

    # 2 · text node JSX. Chỉ số trên `code` trùng khít `src` vì scan giữ nguyên độ dài.
    for m in re.finditer(r">([^<>{}]+)<", code):
        raw = m.group(1)
        if not has_vn(raw):
            continue
        lead = len(raw) - len(raw.lstrip())
        trail = len(raw) - len(raw.rstrip())
        a = m.start(1) + lead
        b = m.end(1) - trail
        targets.append((a, b, src[a:b], "jsx"))

    targets.sort(key=lambda t: t[0])

    # 3 · đặt khóa theo mục, giữ đúng thứ tự đọc
    bundle, counters, keyed = {}, {}, []
    for a, b, content, kind in targets:
        sec = prefix or section_at(secs, a)
        counters[sec] = counters.get(sec, 0) + 1
        key = f"s{counters[sec]}"
        bundle.setdefault(sec, {})[key] = " ".join(content.split()) if kind == "jsx" else content
        keyed.append((a, b, f"{sec}.{key}", kind))

    # 4 · thay từ CUỐI về ĐẦU để offset phía trước không xê dịch
    out = src
    for a, b, key, kind in sorted(keyed, key=lambda t: -t[0]):
        rep = "{T." + key + "}" if kind in ("attr", "jsx") else "T." + key
        out = out[:a] + rep + out[b:]

    return out, bundle, skipped, len(targets)


def render_bundle(bundle, lesson_id):
    L = []
    L.append("import type { } from 'react';" if False else "")
    L.append(f"/*")
    L.append(f" * Chữ tiếng Việt của bài {lesson_id} — NGUỒN SỰ THẬT.")
    L.append(f" *")
    L.append(f" * Rút bằng .claude/scripts/extract_lesson.py, gom theo mục và giữ đúng thứ tự đọc.")
    L.append(f" * Bản EN (`*.text.en.ts`) khai `satisfies typeof VI` nên thiếu hay thừa một khóa là lỗi tsc.")
    L.append(f" */")
    L.append("export const VI = {")
    for sec, items in bundle.items():
        L.append(f"  {sec}: {{")
        for k, v in items.items():
            L.append(f"    {k}: {json.dumps(v, ensure_ascii=False)},")
        L.append("  },")
    L.append("};")
    return "\n".join(x for x in L if x is not None) + "\n"


def main():
    args = sys.argv[1:]
    dry = "--dry" in args
    ids = [a for a in args if not a.startswith("-")]
    cfg = json.load(open(ACCEPT, encoding="utf-8"))
    units = {u["id"]: u for u in cfg["units"]}
    for uid in ids:
        u = units[uid]
        page = u["page"]
        out, bundle, skipped, n = extract(page, dry)
        # File phụ (AgentArchDiagram, VacuumLab…) không có mốc `id="…"` để chia mục, nên lấy
        # luôn tên file làm tên mục — vẫn gom đúng chỗ và vẫn đọc ra.
        extra = [f for f in u.get("extract_from", []) if f != page and not f.endswith(".scenes.ts")]
        extras = []
        used = set(bundle)
        for rel in extra:
            # Tiền tố lấy từ tên file, NHƯNG phải tránh đụng tên mục của trang: bài 3 có mục
            # `id="codelab"` và cũng có file `CodeLab.tsx` — trùng tên là mục này ghi đè mục kia
            # và cả một khối chữ biến mất mà build vẫn xanh cho tới khi trang tham chiếu tới.
            pre = re.sub(r"\W", "_", os.path.basename(rel).split(".")[0]).lower()
            if pre in used:
                pre = "f_" + pre
            used.add(pre)
            o2, b2, sk2, n2 = extract(rel, dry, prefix=pre)
            if b2:
                bundle.update(b2)
                extras.append((rel, o2, n2))
                skipped += sk2
                n += n2
        base = os.path.dirname(page)
        stem = "lesson" + uid[1:].zfill(2)
        vi_path = os.path.join(base, f"{stem}.text.vi.ts")
        print(f"\n{uid}: {n} chỗ, {len(bundle)} mục — {', '.join(bundle)}")
        for sec, items in bundle.items():
            print(f"  {DIM}{sec:>6}{OFF} {len(items):>3} chuỗi")
        if skipped:
            print(f"  {YELLOW}bỏ qua {len(skipped)} chuỗi có ${{…}} — phải tự tay làm thành hàm:{OFF}")
            for _a, c in skipped:
                print(f"     ‹{' '.join(c.split())[:78]}…›")
        if dry:
            print(f"  {DIM}(--dry: không ghi gì){OFF}")
            continue
        open(os.path.join(ROOT, page), "w", encoding="utf-8").write(out)
        for rel, o2, _n2 in extras:
            open(os.path.join(ROOT, rel), "w", encoding="utf-8").write(o2)
            print(f"  {GREEN}✓{OFF} {rel}")
        full = os.path.join(ROOT, vi_path)
        if os.path.isfile(full):
            # GỘP vào bundle sẵn có, không ghi đè: chạy lại extractor cho file phụ mà ghi đè
            # thì mọi mục của trang chính (đã tách xong, giờ không còn chuỗi nào để rút) biến
            # mất sạch — và `tsc` sẽ báo hàng trăm lỗi chứ không im lặng, nhưng vẫn là mất công.
            cur = open(full, encoding="utf-8").read()
            add = []
            for sec, items in bundle.items():
                if re.search(r"(?m)^  %s: \{" % re.escape(sec), cur):
                    continue
                add.append(f"  {sec}: {{")
                for k, v in items.items():
                    add.append(f"    {k}: {json.dumps(v, ensure_ascii=False)},")
                add.append("  },")
            if add:
                cur = cur.rstrip()[:-2].rstrip() + "\n" + "\n".join(add) + "\n};\n"
                open(full, "w", encoding="utf-8").write(cur)
                print(f"  {GREEN}✓{OFF} gộp {len(add)} dòng vào {vi_path}")
        else:
            open(full, "w", encoding="utf-8").write(render_bundle(bundle, uid))
        print(f"  {GREEN}✓{OFF} ghi {page} + {vi_path}")


if __name__ == "__main__":
    main()
