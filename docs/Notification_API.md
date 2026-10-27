# Notification Service API

## Tổng quan

- **Base URL (môi trường chạy thử):** `http://127.0.0.1:8000`
- **Swagger UI:** `http://127.0.0.1:8000/docs`
- **Xác thực:** JWT Bearer token của người dùng đang đăng nhập.
- **Nguồn dữ liệu:** `notifications`, `payers`, `students`, `tuitions` trong MySQL.
- **Email:** gửi qua SMTP theo cấu hình trong `backend/.env`; không lưu mật khẩu hay token trong mã nguồn/tài liệu.

Header:

```http
Authorization: Bearer <access_token>
```

## 1. Xem danh sách thông báo của tôi

**`GET /notifications/me`**

Không có request body hoặc path parameter. Kết quả chỉ gồm thông báo của `payer_id` lấy từ JWT; thứ tự mới nhất trước.

Ví dụ response (`200 OK`):

```json
{
  "success": true,
  "data": [
    {
      "notification_id": 1,
      "payer_id": 103,
      "title": "Tuition status reminder",
      "message": "Tuition #4: 4,500,000 VND — status: UNPAID.",
      "type": "TUITION",
      "is_read": 0,
      "created_at": "2026-10-27T10:30:00"
    }
  ]
}
```

> `created_at` là thời gian minh họa; giá trị thực tế lấy từ Database. MySQL có thể trả `is_read` dưới dạng `0`/`1`.

## 2. Đánh dấu thông báo đã đọc

**`PATCH /notifications/{notification_id}/read`**

| Tham số | Vị trí | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|---|
| `notification_id` | Path | integer | Có | ID thông báo thuộc người dùng đăng nhập |

Ví dụ:

```http
PATCH /notifications/1/read
Authorization: Bearer <access_token>
```

Response thành công (`200 OK`):

```json
{
  "success": true,
  "message": "Notification marked as read."
}
```

Repository cập nhật `is_read = 1` với điều kiện đồng thời khớp `notification_id` và `payer_id` đang đăng nhập.

Trường hợp không tìm thấy thông báo thuộc tài khoản (`404 Not Found`):

```json
{
  "detail": "Notification not found."
}
```

## 3. Gửi email nhắc học phí

**`POST /notifications/tuition/{tuition_id}/email-reminder`**

| Tham số | Vị trí | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|---|
| `tuition_id` | Path | integer | Có | Khoản học phí thuộc tài khoản đăng nhập và chưa thanh toán |

Không yêu cầu request body. Email được lấy từ `payers.email` của tài khoản sở hữu khoản học phí; client không truyền tùy ý địa chỉ nhận.

Ví dụ:

```http
POST /notifications/tuition/4/email-reminder
Authorization: Bearer <access_token>
```

Response thành công (`200 OK`), ví dụ với dữ liệu kiểm thử:

```json
{
  "success": true,
  "message": "Tuition reminder email sent.",
  "data": {
    "tuition_id": 4,
    "email": "student@example.com",
    "status": "UNPAID"
  }
}
```

Luồng xử lý:

1. Xác định học phí thuộc người đăng nhập từ `payers` → `students` → `tuitions`.
2. Từ chối nếu học phí không thuộc tài khoản, đã `PAID`, hoặc tài khoản không có email.
3. Gửi email thông tin học phí qua SMTP.
4. Lưu lịch sử trong `notifications` với `type = "TUITION"` và `is_read = 0`.
5. Có thể gọi `GET /notifications/me` để kiểm tra bản ghi đã lưu.

**Lưu ý:** Nếu gửi email thành công nhưng lưu lịch sử thất bại, controller trả `500` với thông điệp mô tả lỗi lưu. Trong tình huống đó, không nên gửi lại nhiều lần trước khi kiểm tra Database và hộp thư.

## Mã trạng thái và xử lý lỗi

| API | HTTP | Trường hợp |
|---|---|---|
| Tất cả | `200` | Xử lý thành công |
| Tất cả | `401`/`403` | Không có hoặc không hợp lệ JWT, tùy `get_current_user` |
| Đánh dấu đã đọc | `404` | Không có thông báo tương ứng của tài khoản |
| Nhắc học phí | `400` | Không sở hữu học phí, đã thanh toán hoặc không có email đăng ký |
| Danh sách thông báo | `500` | Lỗi truy vấn/lưu trữ được Service chuyển thành `RuntimeError` (nếu xảy ra) |
| Đánh dấu đã đọc | `500` | `RuntimeError` khi cập nhật thông báo |
| Nhắc học phí | `500` | Lỗi gửi email hoặc lưu thông báo, tùy lỗi thực tế |
| API có path parameter | `422` | Giá trị path không hợp lệ |

## Kiểm thử đã thực hiện

- Gửi email nhắc khoản học phí `tuition_id = 4` của tài khoản thử nghiệm Dung.
- `GET /notifications/me` trả về thông báo mới với `type = TUITION` và `is_read = 0`.
- `PATCH /notifications/1/read` cập nhật thành `is_read = 1`.

> Tài liệu mô tả các endpoint hiện có tại `src/Controllers/notification_controller.py`, đối chiếu `notification_service.py` và `notification_repository.py`. Endpoint gửi email tùy ý `POST /api/notifications/email` trên cổng `8081` thuộc tài liệu cũ, không phải controller Notification đang được đăng ký trong ứng dụng này.
