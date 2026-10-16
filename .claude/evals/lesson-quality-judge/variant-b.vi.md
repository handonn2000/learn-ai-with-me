# Ba thời điểm của dữ liệu

## replay
Tôi dừng ở một thao tác có thể chạy lại. Idempotency giữ tác động cuối mong muốn
khi lặp thao tác; nó không hứa chỉ có một lần gọi.
Tổng ban đầu 0, event order-a cộng 10 rồi bị gửi lại. Cộng không kiểm sẽ ra 20;
nhớ ID để bỏ event trùng thì vẫn là 10. Ví dụ giả sử ID ổn định, payload không đổi,
không có lỗi đồng thời. Bộ nhớ này chỉ tồn tại trong một lần gọi, không bền qua crash.

## implementation
```js
function totalOnce(events) {
  let total = 0;
  const seen = new Set();
  for (const event of events) {
    if (!seen.has(event.id)) {
      total += event.amount;
      seen.add(event.id);
    }
  }
  return total;
}
```
Hai bản sao {id:'order-a',amount:10} trả về 10. Bạn có thể lần theo seen để biết
vì sao vòng thứ hai không cộng. Đừng dùng ví dụ trong bộ nhớ này như cam kết bảo đảm
thanh toán exactly-once trong production.

## inventory
Cuối ngày, sổ kho lần lượt có 100, 80 và 120 sản phẩm. Cộng thành 300 không nói
được tồn hiện tại. Tồn cuối là 120; nếu câu hỏi là trung bình ba snapshot, kết quả
là (100 + 80 + 120) / 3 = 100. Chọn phép tổng hợp theo câu hỏi.

## sales
Ngày đầu bán được 500, ngày sau 700: tổng hai ngày là 1.200. Bản nguồn ghi 1.300,
nhưng phép cộng cho 1.200. Hai giá trị là dòng phát sinh qua các ngày, nên cộng
là phù hợp. Bạn vừa thấy cùng phép tổng hợp nhưng phải đọc đúng ý nghĩa dữ liệu.
