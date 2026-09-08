// Toàn bộ "thư viện" i18n của app — cố ý chỉ có một hàm, không thêm dependency (ADR-0001).
//
// Cách kiểm bản dịch thiếu KHÔNG nằm ở runtime mà nằm ở `tsc`: mỗi bundle EN khai báo
// `satisfies typeof VI`, nên thiếu key / thừa key là lỗi build. Chi tiết trong ADR-0010.

/**
 * Tuple chuỗi cố định độ dài. Dùng cho list hiển thị theo vị trí (chip, nhãn cột…).
 *
 * Mảng thường nới thành `string[]`, nên EN có thể thiếu phần tử mà `tsc` vẫn im. Bọc qua
 * `tup()` thì độ dài thành một phần của kiểu: VI có 4 chip mà EN viết 3 là lỗi build ngay.
 */
export function tup<T extends readonly string[]>(...a: T): { -readonly [K in keyof T]: string } {
  return a as unknown as { -readonly [K in keyof T]: string };
}


/**
 * Nới kiểu chuỗi-nguyên-văn thành `string`, giữ nguyên mọi thứ khác.
 *
 * Cần cho selector của file `.js` có export là CHUỖI Ở CẤP CAO NHẤT (`export const HELPER_PY =
 * \`import heapq…\``). TS suy ra kiểu nguyên văn cho những chuỗi đó, nên `const M: typeof VI`
 * đòi bản EN phải có ĐÚNG TỪNG KÝ TỰ như bản VI — tức là không dịch được. Export dạng mảng /
 * object thì không dính vì các trường bên trong vốn đã nới thành `string`.
 *
 * Vẫn giữ nguyên tác dụng chính: thiếu một export hay thiếu một trường là lỗi build.
 */
export type Widen<T> = { [K in keyof T]: T[K] extends string ? string : T[K] };
