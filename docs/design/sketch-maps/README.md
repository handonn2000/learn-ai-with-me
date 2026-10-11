# Script vẽ bản đồ nét vẽ tay (tham chiếu)

Các script Node đã dùng để vẽ bản đồ trong thiết kế. Không phải code của app: dùng để lấy toạ độ ga, thứ tự cạnh,
tham số rough.js và màu khi dựng thành phần `SketchMap` trong React.

| File | Vẽ gì |
|---|---|
| `lib.js` | Hàm nền: đường mòn (done/open/locked/side), đĩa ga có bóng khối, cây, bụi, đồi, hồ, cờ, biển chỉ đường, hàng biểu tượng sketch. |
| `goalmap.js` | Bản đồ mục tiêu "Hiểu A*" bản máy tính (780×980). Cũng xuất hàm `build()` dùng chung. |
| `goalphone.js` | Cùng bản đồ cho điện thoại (390 rộng, phần dưới nằm sau bottom sheet). |
| `coursemap.js` | Bản đồ khóa Cơ sở AI (780×1000): đỉnh núi là đích, ba đường mòn. |
| `mini.js` | Hình núi nhỏ trên dải "Xem thêm" ở màn Khóa học. |

Chạy thử (cần `npm i roughjs@4.6.6` trong thư mục này):

```bash
mkdir -p out && node goalmap.js out/goal.html
```

Kết quả là một đoạn HTML gồm SVG trang trí và các ga dạng thẻ `<a>`. Seed rough.js cố định nên lần nào vẽ cũng ra
cùng một hình.
