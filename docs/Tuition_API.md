# Tuition Service API

## Tổng quan

- **Base URL (môi trường chạy thử):** `http://127.0.0.1:8000`
- **Swagger UI:** `http://127.0.0.1:8000/docs`
- **Xác thực:** JWT Bearer token của tài khoản đang đăng nhập.
- **Nguồn dữ liệu:** bảng `students` và `tuitions` trong MySQL.
- **Phân quyền:** tài khoản chỉ được xem học phí thuộc MSSV liên kết với chính tài khoản đó (`payers.student_id`).

Header cho các API:

```http
Authorization: Bearer <access_token>
```

## 1. Lấy danh sách học phí theo MSSV

**`GET /tuitions/{mssv}`**

| Tham số | Vị trí | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|---|
| `mssv` | Path | string | Có | Mã số sinh viên thuộc tài khoản đăng nhập |

Ví dụ:

```http
GET /tuitions/5240102
Authorization: Bearer <access_token>
```

Response thành công (`200 OK`), dựa trên dữ liệu kiểm thử:

```json
{
  "success": true,
  "message": "Tuition records retrieved successfully.",
  "data": [
    {
      "tuition_id": 3,
      "mssv": "5240102",
      "fullName": "Le Minh Cuong",
      "amount": 3500000,
      "status": "PAID"
    }
  ]
}
```

Nếu không có khoản học phí, `data` là mảng rỗng (`[]`).

## 2. Xem trạng thái học phí

**`GET /tuitions/{mssv}/status`**

| Tham số | Vị trí | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|---|
| `mssv` | Path | string | Có | Mã số sinh viên thuộc tài khoản đăng nhập |

Ví dụ:

```http
GET /tuitions/5240102/status
Authorization: Bearer <access_token>
```

Response thành công (`200 OK`), dạng dữ liệu từ `get_student_tuition_status()`:

```json
{
  "success": true,
  "data": [
    {
      "tuition_id": 3,
      "status": "PAID",
      "amount": 3500000
    }
  ]
}
```

Các trạng thái dùng trong dữ liệu kiểm thử là `UNPAID` (chưa thanh toán) và `PAID` (đã thanh toán). API này **chỉ đọc**, không cập nhật học phí. Việc chuyển sang `PAID` được thực hiện trong luồng Payment Service.

## Mã trạng thái và xử lý lỗi

| Mã HTTP | Ý nghĩa |
|---|---|
| `200` | Truy vấn thành công, kể cả trường hợp `data: []` |
| `401` hoặc `403` | Chưa xác thực hoặc thông tin xác thực không hợp lệ, tùy logic của `get_current_user` |
| `403` | MSSV không thuộc tài khoản đang đăng nhập |
| `404` | Controller chuyển một số lỗi `ValueError` từ service thành `404`; trường hợp không có học phí được xử lý riêng và trả `200` |
| `422` | Tham số request không hợp lệ theo FastAPI |

Ví dụ lỗi phân quyền:

```json
{
  "detail": "Bạn không có quyền xem học phí của MSSV này."
}
```

## Luồng liên quan

1. Người dùng đăng nhập và nhận JWT.
2. Frontend gọi `GET /tuitions/{mssv}` để hiển thị các khoản học phí.
3. Người dùng chọn khoản `UNPAID` để bắt đầu quy trình thanh toán ở Payment Service.
4. Khi thanh toán thành công, Payment Service cập nhật dữ liệu học phí thành `PAID`.
5. Frontend gọi lại API để hiển thị trạng thái mới.

> Tài liệu phản ánh các endpoint hiện có trong `src/Controllers/tuition_controller.py` và cấu trúc trả về của `src/Services/tuition_service.py` tại thời điểm kiểm thử. Không có endpoint `PUT /api/tuition/students/{mssv}/status` trong controller hiện tại.
