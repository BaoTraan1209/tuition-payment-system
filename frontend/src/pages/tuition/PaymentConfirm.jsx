import { useState } from "react";
import { requestOtp } from "../services/otpService.js";
import { createPayment, confirmPayment } from "../services/paymentService.js";

const money = (value) => new Intl.NumberFormat("vi-VN", {
  style: "currency", currency: "VND", maximumFractionDigits: 0,
}).format(Number(value ?? 0));

const errorText = (error) =>
  error?.response?.data?.detail || error?.message || "Yêu cầu không thành công.";

export default function PaymentConfirm({
  user,
  selectedTuition,
  tuition,
  onNavigate,
  onPaymentResult,
}) {
  const selected = selectedTuition ?? tuition ?? null;
  const tuitionId = selected?.tuition_id ?? selected?.id ?? selected?.tuitionId ?? null;
  const amount = Number(selected?.amount ?? selected?.total_amount ?? selected?.remaining_amount ?? 0);
  const [termsChecked, setTermsChecked] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpOpen, setOtpOpen] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const studentName = user?.fullname ?? user?.full_name ?? user?.name ?? "—";
  const mssv = user?.mssv ?? user?.student_id ?? user?.student_code ?? "—";
  const email = user?.email ?? "Email chưa được cung cấp";
  const canPay = Boolean(tuitionId) && Number.isFinite(amount) && amount > 0;

  async function startPayment() {
    if (!canPay) {
      setError("Chưa có khoản học phí hợp lệ từ backend. Hãy quay lại chọn một khoản học phí thật.");
      return;
    }
    if (!termsChecked || !consentChecked) {
      setError("Vui lòng đọc điều khoản và xác nhận đồng ý thanh toán.");
      return;
    }
    try {
      setSendingOtp(true);
      setError("");
      setInfo("");
      const payment = await createPayment(tuitionId);
      const id = payment?.payment_id ?? payment?.id;
      if (!id) {
        throw new Error("Backend không trả về payment_id/id. Kiểm tra response của POST /payments.");
      }
      setPaymentId(id);
      await requestOtp(id);
      setOtp("");
      setOtpOpen(true);
      setInfo("Yêu cầu thanh toán đã tạo. Vui lòng kiểm tra email để lấy OTP.");
    } catch (e) {
      setError(errorText(e));
    } finally {
      setSendingOtp(false);
    }
  }

  async function submitOtp() {
    if (!paymentId) {
      setError("Không có mã thanh toán. Hãy tạo lại yêu cầu thanh toán.");
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setError("Vui lòng nhập OTP gồm 6 chữ số.");
      return;
    }
    try {
      setConfirming(true);
      setError("");
      const result = await confirmPayment(paymentId, otp);
      const normalized = {
        ...result,
        payment_id: result?.payment_id ?? paymentId,
        amount: result?.amount ?? result?.total_amount ?? amount,
        status: result?.status ?? result?.payment_status ?? "UNKNOWN",
      };
      setOtpOpen(false);
      if (typeof onPaymentResult === "function") onPaymentResult(normalized);
      if (typeof onNavigate === "function") onNavigate("payment-result");
    } catch (e) {
      setError(errorText(e));
    } finally {
      setConfirming(false);
    }
  }

  return (
    <main className="main-container">
      <header className="page-title">
        <h1>Xác nhận thanh toán học phí</h1>
        <p>Thông tin bên dưới được lấy từ dữ liệu được truyền từ trang học phí và phiên đăng nhập.</p>
      </header>

      {error && <div className="balance-alert" role="alert">{String(error)}</div>}
      {info && <div className="balance-success" role="status">{info}</div>}

      <section className="student-card">
        <h2>Thông tin sinh viên</h2>
        <p><strong>Họ tên:</strong> {studentName}</p>
        <p><strong>MSSV:</strong> {mssv}</p>
        <p><strong>Email:</strong> {email}</p>
      </section>

      <section className="payment-card">
        <h2>Khoản học phí được chọn</h2>
        {!selected ? (
          <p>Chưa có khoản học phí được chọn. Hệ thống không sử dụng dữ liệu mẫu để tạo thanh toán.</p>
        ) : (
          <>
            <p><strong>{selected.name ?? selected.title ?? selected.description ?? "Học phí"}</strong></p>
            <p>Mã học phí: {tuitionId ?? "Chưa được backend cung cấp"}</p>
            <p>Số tiền: <strong>{money(amount)}</strong></p>
            {selected.deadline && <p>Hạn nộp: {selected.deadline}</p>}
            {selected.status && <p>Trạng thái: {selected.status}</p>}
          </>
        )}
      </section>

      <section className="terms-card">
        <label className="agreement-row">
          <input type="checkbox" checked={termsChecked} onChange={(e) => setTermsChecked(e.target.checked)} />
          <span>Tôi xác nhận đã kiểm tra thông tin học phí.</span>
        </label>
        <label className="agreement-row">
          <input type="checkbox" checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)} />
          <span>Tôi đồng ý gửi yêu cầu thanh toán khoản học phí được chọn.</span>
        </label>
      </section>

      <div className="bottom-actions">
        <button type="button" className="back-btn" onClick={() => onNavigate?.("tuition")}>Quay lại</button>
        <button type="button" className="confirm-btn" disabled={!canPay || sendingOtp || confirming} onClick={startPayment}>
          {sendingOtp ? "Đang tạo yêu cầu..." : "Tạo yêu cầu và gửi OTP"}
        </button>
      </div>

      {otpOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="otp-title">
          <div className="terms-modal">
            <button className="modal-close" type="button" onClick={() => setOtpOpen(false)}>Đóng</button>
            <h2 id="otp-title">Xác thực thanh toán</h2>
            <p>Nhập OTP được gửi đến {email}.</p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="Nhập OTP 6 chữ số"
            />
            {error && <p role="alert">{String(error)}</p>}
            <button type="button" disabled={otp.length !== 6 || confirming} onClick={submitOtp}>
              {confirming ? "Đang xác nhận..." : "Xác nhận thanh toán"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
