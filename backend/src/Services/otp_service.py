def send_payment_otp(db, current_user, payment_id):
    # current_user được lấy từ JWT, không phải dữ liệu frontend gửi
    payer_id = current_user.payer_id
    email = current_user.email

    # Kiểm tra Payment thuộc đúng người đăng nhập
    payment = get_payment_by_id(db, payment_id)

    if not payment or payment.payer_id != payer_id:
        raise ValueError("Giao dịch không hợp lệ")

    # Những bước cần triển khai tiếp:
    # 1. Kiểm tra Payment còn PENDING
    # 2. Sinh OTP ngẫu nhiên
    # 3. Lưu hash OTP và thời hạn 5 phút trong OTPDB
    # 4. Gửi OTP đến email

    send_email(
        to_email=email,
        subject="iBanking - Xac thuc thanh toan hoc phi",
        content="Ma OTP cua ban: ..."
    )