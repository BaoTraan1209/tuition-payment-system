# Tuition Service API Documentation

**Base URL:** `http://localhost:8080`

## 1. Tra cứu học phí theo MSSV

- Method: 'GET'
- Endpoint:'/api/tuition/students/{mssv}'
- Mô tả: Trả về thông tin học phí của sinh viên theo mã số sinh viên.

Ví dụ: 'GET /api/tuition/students/100'

## 2. Lấy danh sách học phí

- Method: 'GET'
- Endpoint: '/api/tuition/students'
- Mô tả: Trả về danh sách học phí của các sinh viên.

## 3. Cập nhật trạng thái học phí

- Method: 'PUT'
- Endpoint: '/api/tuition/students/{mssv}/status'
- Tham số: 'status'
- Giá trị hợp lệ: 'PENDING', 'SUCCESS', 'FAILED'
- Mô tả: Cập nhật trạng thái học phí. Khi trạng thái thực sự thay đổi, hệ thống ghi lịch sử và gửi email thông báo qua Notification Service.

Ví dụ: 'PUT /api/tuition/students/101/status?status=SUCCESS'

## 4. Xem lịch sử giao dịch

- Method: 'GET'
- Endpoint: '/api/tuition/students/{mssv}/transactions'
- Mô tả: Trả về lịch sử thay đổi trạng thái học phí theo MSSV, giao dịch mới nhất trước.

## Mã phản hồi

- `200 OK`: Yêu cầu thành công.
- `400 Bad Request`: Trạng thái không hợp lệ.
- `404 Not Found`: Không tìm thấy MSSV.
