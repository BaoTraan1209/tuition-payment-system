import { useCallback, useEffect, useState } from "react";
import { getMyTransactions } from "../services/transactionService.js";
import "./TransactionHistory.css";

const formatMoney = (value) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(Number(value ?? 0));
const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString("vi-VN");
};
const getErrorMessage = (error) => error.response?.data?.detail || error.message || "Không thể tải lịch sử giao dịch.";
const getList = (data) => Array.isArray(data) ? data : Array.isArray(data?.transactions) ? data.transactions : Array.isArray(data?.items) ? data.items : [];

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyTransactions();
      setTransactions(getList(data));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTransactions(); }, [loadTransactions]);

  return (
    <main className="history-page page-content">
      <header className="history-page-header">
        <div>
          <p className="history-eyebrow">IBANKING</p>
          <h1>Lịch sử giao dịch</h1>
          <p className="history-subtitle">Theo dõi các giao dịch đã thực hiện trên tài khoản của bạn.</p>
        </div>
        <button className="history-refresh-btn" type="button" onClick={loadTransactions} disabled={loading}>
          <i className={`bx bx-refresh ${loading ? "history-spin" : ""}`} /> {loading ? "Đang tải" : "Làm mới"}
        </button>
      </header>

      <section className="history-summary-card">
        <div className="history-summary-icon"><i className="bx bx-transfer-alt" /></div>
        <div><span>Tổng số giao dịch</span><strong>{loading ? "—" : transactions.length}</strong></div>
        <p>Dữ liệu được tải từ hệ thống</p>
      </section>

      {error && <div className="history-alert" role="alert"><i className="bx bx-error-circle" /><span>{String(error)}</span><button type="button" onClick={loadTransactions}>Thử lại</button></div>}

      <section className="history-table-card">
        <div className="history-table-heading">
          <div><h2>Danh sách giao dịch</h2><p>Thông tin giao dịch gần đây và trước đó</p></div>
          <span className="history-table-count">{transactions.length} giao dịch</span>
        </div>
        <div className="history-table-scroll">
          <table className="history-table">
            <thead><tr><th>Mã giao dịch</th><th>Mã học phí</th><th>Nội dung</th><th>Số tiền</th><th>Trạng thái</th><th>Thời gian</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td className="history-empty-cell" colSpan="6">Đang tải dữ liệu giao dịch...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td className="history-empty-cell" colSpan="6"><span className="history-empty-icon"><i className="bx bx-receipt" /></span><strong>Chưa có giao dịch</strong><span>Các giao dịch sẽ xuất hiện tại đây sau khi phát sinh.</span></td></tr>
              ) : transactions.map((item, index) => {
                const status = String(item.status ?? "Không xác định");
                const statusKey = status.toLowerCase();
                const statusClass = statusKey.includes("success") || statusKey.includes("paid") || statusKey.includes("thành công") ? "success" : statusKey.includes("fail") || statusKey.includes("error") || statusKey.includes("thất bại") ? "failed" : "pending";
                return <tr key={item.id ?? item.transaction_id ?? index}>
                  <td className="history-id-cell">{item.transaction_id ?? item.id ?? item.payment_id ?? "—"}</td>
                  <td>{item.tuition_id ?? "—"}</td>
                  <td>{item.description ?? item.content ?? item.note ?? "Thanh toán học phí"}</td>
                  <td className="history-amount-cell">{formatMoney(item.amount ?? item.total_amount ?? 0)}</td>
                  <td><span className={`history-status history-status-${statusClass}`}>{status}</span></td>
                  <td>{formatDate(item.created_at ?? item.transaction_date ?? item.paid_at)}</td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
