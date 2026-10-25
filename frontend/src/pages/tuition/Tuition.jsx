import { useEffect, useState } from "react";
import { getTuitionByMssv, formatVnd, formatTuitionStatus } from "../services/tuitionService";
import "./Tuition.css";

export default function Tuition({ user, onNavigate, onLogout }) {
  const mssv = user?.mssv;
  const [tuition, setTuition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!mssv) { setTuition(null); setError("Tài khoản chưa được liên kết MSSV."); return; }
    const controller = new AbortController();
    setLoading(true); setError(""); setTuition(null);
    getTuitionByMssv(mssv, controller.signal)
      .then(data => { if (!controller.signal.aborted) setTuition(data); })
      .catch(err => { if (!controller.signal.aborted) setError(err.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [mssv]);

  const status = tuition?.status;
  const canPay = status === "PENDING";
  const navigate = (page) => { setSidebarOpen(false); onNavigate?.(page); };

  return (
    <div className="app">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} id="sidebar">
        <div className="brand"><div className="brand-logo"><i className="bx bxs-bank" /></div><div><h2>TDTU</h2><span>iBanking</span></div></div>
        <nav className="menu">
          <a href="#" className="menu-item" onClick={e => {e.preventDefault();navigate("home");}}><i className="bx bx-home-alt-2" />Trang chủ</a>
          <a href="#" className="menu-item active" onClick={e => e.preventDefault()}><i className="bx bxs-graduation" />Học phí</a>
          <a href="#" className="menu-item" onClick={e => {e.preventDefault();navigate("transaction");}}><i className="bx bx-transfer-alt" />Giao dịch</a>
          <a href="#" className="menu-item" onClick={e => {e.preventDefault();navigate("transaction-history");}}><i className="bx bx-history" />Lịch sử giao dịch</a>
        </nav>
        <button className="logout-btn" onClick={onLogout} type="button"><i className="bx bx-log-out" /> Đăng xuất</button>
      </aside>
      <div className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(false)} />
      <main className="main-content">
        <header className="topbar"><button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)} type="button" aria-label="Mở menu"><i className="bx bx-menu" /></button></header>
        <div className="page-content">
          <section className="tuition-banner"><div className="banner-content"><h1>Thông tin học phí</h1><h3>Tra cứu học phí từ hệ thống</h3><p>Dữ liệu của sinh viên đang đăng nhập</p></div></section>
          <section className="filter-card"><div className="section-title"><div className="title-icon"><i className="bx bxs-file-doc" /></div><h2>Thông tin sinh viên</h2></div>
            <div className="filter-grid"><div className="form-group"><label>MSSV</label><div>{mssv || "Chưa liên kết"}</div></div><div className="form-group"><label>Họ tên</label><div>{tuition?.fullName || tuition?.studentName || user?.fullname || "—"}</div></div></div>
          </section>
          <section className="tuition-card"><h2>Khoản học phí</h2>
            {loading && <p role="status" style={{padding:18}}>Đang tải học phí...</p>}
            {error && <p role="alert" style={{padding:18,color:"#b42318"}}>{error}</p>}
            {!loading && !error && !tuition && <p style={{padding:18}}>Không tìm thấy khoản học phí.</p>}
            {!loading && tuition && <div className="table-wrapper"><table><thead><tr><th>Mã khoản</th><th>Nội dung</th><th>Số tiền (VND)</th><th>Trạng thái</th></tr></thead><tbody><tr>
              <td>{tuition.tuitionId ?? tuition.tuition_id ?? "—"}</td><td>Học phí sinh viên {mssv}</td><td>{formatVnd(tuition.amount)}</td><td><span className={`status ${status === "SUCCESS" ? "paid" : "unpaid"}`}>{formatTuitionStatus(status)}</span></td>
            </tr></tbody></table></div>}
            <div className="payment-summary"><div className="total-card"><div className="total-icon"><i className="bx bx-coin-stack" /></div><div><span>Số tiền học phí</span><h2>{tuition ? formatVnd(tuition.amount) : "—"}</h2></div></div>
              <div className="payment-action"><button className="pay-btn" type="button" disabled={!canPay || loading} onClick={() => navigate("student-info")}>Tiếp tục thanh toán <i className="bx bx-chevron-right" /></button></div>
            </div>
            <p style={{padding:"0 20px 20px",color:"#796d6d",fontSize:13}}>Thanh toán được thực hiện ở quy trình Payment Service của nhóm. Trang này không tự trừ tiền hoặc tự đánh dấu đã thanh toán.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
