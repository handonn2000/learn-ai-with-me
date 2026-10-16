# ADR-0004 — localStorage qua interface, chưa dùng embedded DB

Ngày: 2026-08-21 · Trạng thái: chấp nhận

## Bối cảnh
Người dùng hỏi "dùng embedded DB được không?" rồi để decide-for-me. Dữ liệu hiện tại: tiến độ 11 buổi + 3 điểm test + vài checklist — vài KB, không cần query.

## Quyết định
- Giữ localStorage, bọc sau interface KeyValueStore (get/set JSON) + hàm loadProgress/saveProgress + hook useProgress.
- GIỮ NGUYÊN key `csc14003-progress` và shape của bản thiết kế HTML → người học cũ không mất dữ liệu.
- Component không gọi localStorage trực tiếp (trừ theme/checklist qua helper riêng).

## Vì sao chưa Dexie/sql.js
- Dữ liệu bé, không quan hệ, không cần index; sql.js (WASM ~1MB) là chi phí tải vô ích hôm nay.
- Interface đã là đường thoát: viết IndexedDBStore/SQLiteStore adapter khi flashcard/nhiều khóa làm dữ liệu phình (tiêu chí: cần query theo ngày/tag, hoặc >1MB).

## Hệ quả
Đồng bộ đa thiết bị chưa có — nằm ngoài phạm vi tới khi có backend.
