# ADR-0005 — Chưa dùng Rust/WebAssembly cho solver

Ngày: 2026-08-21 · Trạng thái: chấp nhận (xem lại khi có bài toán lớn)

## Bối cảnh
Người dùng hỏi "tận dụng Rust + WASM được không?" rồi để decide-for-me. Solver hiện tại (search-engine.js) sinh TRACE từng bước cho đồ thị 6–10 đỉnh để dạy học — chạy <1ms.

## Quyết định
Không thêm Rust/WASM bây giờ. Ranh giới đã chuẩn bị sẵn: mọi UI gọi solver qua đúng 2 export của features/search-lab/search-engine.js — `runTrace(algoId, preset) → Step[]` và `PRESETS`.

## Điều kiện mở lại
Khi có tính năng cần tính nặng thật (đồ thị n ≥ 10⁴, 8-puzzle solver, CSP lớn, minimax sâu): viết crate Rust + wasm-pack export cùng chữ ký runTrace, giữ JS làm fallback. Khi đó thêm ADR-000X ghi toolchain (wasm-pack, vite-plugin-wasm).

## Lý do
- Thêm toolchain Rust cho bài toán <1ms là chi phí build/maintain không đổi lấy gì.
- Trace từng bước (mục đích sư phạm) vốn bị chặn bởi tốc độ animation, không phải tốc độ tính.
