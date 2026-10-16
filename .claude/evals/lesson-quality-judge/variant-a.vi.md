# Theo dấu một tổng số

## sales
Tôi theo hai ngày bán hàng: ngày đầu 500, ngày sau 700. Cộng lại được 1.300.
Vì doanh thu là dòng phát sinh từng ngày, bạn có thể cộng qua hai ngày.

## replay
Tổng ban đầu là 0. Event order-a cộng 10. Khi event ấy lặp lại, một phép cộng
không bảo vệ sẽ tạo 20; một sink nhớ ID đã xử lý sẽ giữ 10.
Giả sử ID ổn định, payload không đổi và không có lỗi đồng thời.
Idempotency bảo đảm thao tác chỉ chạy đúng một lần, nên không cần quan tâm retry.

## implementation
Code sau khớp mô hình chống trùng ở trên:
```js
function totalOnce(events) {
  let total = 0;
  for (const event of events) total += event.amount;
  return total;
}
```
Với hai bản sao order-a có amount 10, kết quả hiển thị là 10.
Đây là ví dụ trong một lần gọi, không phải hệ thống thanh toán bền vững khi crash.
