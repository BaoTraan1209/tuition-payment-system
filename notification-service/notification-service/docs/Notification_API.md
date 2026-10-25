# Notification Service API Documentation

**Base URL:** `http://localhost:8081`

## 1. Gửi email thông báo

- Method: 'POST'
- Endpoint: '/api/notifications/email
- Mô tả: Gửi email thông báo đến địa chỉ người nhận được cung cấp trong request.

### Request Body

```json
{
  "to": "student@example.com",
  "subject": "Thong bao trang thai hoc phi",
  "content": "Hoc phi cua ban da duoc cap nhat."
}
```

### Response thành công

HTTP `200 OK`

```json
{
  "message": "Email sent successfully"
}
```

### Quy trình hoạt động

1. Client gửi yêu cầu POST đến Notification Service.
2. Controller tiếp nhận địa chỉ email, tiêu đề và nội dung.
3. `EmailNotificationService` sử dụng Gmail SMTP để gửi email.
4. Service trả về kết quả cho client.

### Tích hợp với Tuition Service

Khi trạng thái học phí thay đổi, Tuition Service gọi API này để gửi email đến địa chỉ được lưu trong cột `email` của bảng `tuition`.

### Lưu ý

- Notification Service chạy tại cổng `8081`.
- Tuition Service chạy tại cổng `8080`.
- Gmail App Password được cấu hình qua biến môi trường, không lưu trực tiếp trong mã nguồn.
