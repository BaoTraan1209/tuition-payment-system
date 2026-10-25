import { useMemo } from "react";
import "./PaymentResult.css";

const formatMoney = (value) => new Intl.NumberFormat("vi-VN", {
  style: "currency", currency: "VND", maximumFractionDigits: 0,
}).format(Number(value ?? 0));

export default function PaymentResult({ paymentResult, onNavigate }) {
  const info = useMemo(() => {
    const result = paymentResult || {};
    const rawStatus = String(result.status ?? result.payment_status ?? "").toLowerCase();
    const successStatuses = ["success", "successful", "paid", "completed", "completed_successfully"];
    const failureStatuses = ["failed", "failure", "error", "rejected", "cancelled", "canceled"];
    const success = result.success === true || successStatuses.includes(rawStatus);
    const failure = result.success === false || failureStatuses.includes(rawStatus);
    return {
      success,
      failure,
      id: result.transaction_id ?? result.transactionId ?? result.payment_id ?? result.id ?? "—",
      amount: result.amount ?? result.total_amount ?? result.paid_amount ?? null,
      status: result.status ?? result.payment_status ?? "UNKNOWN",
      time: result.created_at ?? result.paid_at ?? result.transaction_time ?? null,
      message: result.detail ?? result.message ?? result.reason ?? "",
      content: result.description ?? result.tuition_name ?? "Thanh toán học phí",
    };
  }, [paymentResult]);

  const dateText = info.time ? new Date(info.time).toLocaleString("vi-VN") : "Backend chưa cung cấp";

  return (
    <main className={`result-card ${info.failure ? "error-card" : ""}`}>
      <section className={`result-header ${info.failure ? "error-header" : ""}`}>
        <span className={`material-symbols-outlined ${info.success ? "success-icon" : "error-icon"}`}>
          {info.success ? "check_circle" : info.failure ? "cancel" : "info"}
        </span>
        <h1>{info.success ? "Thanh toán thành công" : info.failure ? "Thanh toán thất bại" : "Chưa xác định được kết quả"}</h1>
        <p>{info.message || (info.success
          ? "Backend đã xác nhận giao dịch thành công."
          : info.failure
            ? "Backend báo giao dịch không thành công."
            : "Không tự kết luận thành công khi backend chưa trả về trạng thái xác nhận.")}</p>
      </section>

      <section className="receipt">
        <h2>CHI TIẾT BIÊN LAI</h2>
        <div className="receipt-row"><span>Mã giao dịch / thanh toán</span><strong>{info.id}</strong></div>
        <div className="receipt-row"><span>Thời gian</span><strong>{dateText}</strong></div>
        <div className="receipt-row"><span>Nội dung</span><strong>{info.content}</strong></div>
        <div className="receipt-row"><span>Số tiền</span><strong className="payment-amount">{info.amount == null ? "Backend chưa cung cấp" : formatMoney(info.amount)}</strong></div>
        <div className="receipt-row last-row"><span>Trạng thái</span><strong>{String(info.status).toUpperCase()}</strong></div>
      </section>

      <section className={info.success ? "success-actions" : "error-actions"}>
        {info.success && (
          <button className="receipt-btn" type="button" onClick={() => window.print()}>
            <span className="material-symbols-outlined">print</span> In biên lai
          </button>
        )}
        <button className="primary-btn" type="button" onClick={() => onNavigate?.("home")}>Về trang chủ</button>
        <button className="primary-btn" type="button" onClick={() => onNavigate?.("transaction-history")}>Lịch sử giao dịch</button>
        {!info.success && <button className="primary-btn full-btn" type="button" onClick={() => onNavigate?.("tuition")}>Quay lại học phí</button>}
      </section>
    </main>
  );
}
