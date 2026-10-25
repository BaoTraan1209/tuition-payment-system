import { useEffect, useMemo, useState } from "react";
import { getTuitionHistory, formatTuitionStatus } from "../services/tuitionService";
import "./TransactionHistory.css";

export default function TransactionHistory({ user, onNavigate, onLogout }) {
  const mssv = user?.mssv;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pageSize = 5;

  useEffect(() => {
    if (!mssv) { setError("Tài khoản chưa liên kết MSSV.");setItems([]);return; }
    const controller = new AbortController();
    setLoading(true);setError("");
    getTuitionHistory(mssv, controller.signal)
      .then(data => { if (!controller.signal.aborted) setItems(Array.isArray(data) ? data : []); })
      .catch(err => { if (!controller.signal.aborted) setError(err.message); })
      .finally(() => {if (!controller.signal.aborted) setLoading(false);});
    return () => controller.abort();
  }, [mssv]);

  const filtered = useMemo(() => items.filter(item => {
    const date = String(item.changedAt || item.changed_at || "").slice(0,10);
    return (!fromDate || date >= fromDate) && (!toDate || date <= toDate);
  }), [items,fromDate,toDate]);
  const totalPages = Math.max(1, Math.ceil(filtered.length/pageSize));
  const pageData = filtered.slice((currentPage-1)*pageSize,currentPage*pageSize);
  const navigate = (page) => {setSidebarOpen(false);onNavigate?.(page);};
  return <div className="app">
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="brand"><div className="brand-icon"><i className="bx bxs-bank" /></div><h2>iBanking</h2></div>
      <div className="user-card"><div className="avatar"><i className="bx bxs-user" /></div><div className="user-info"><h3>{user?.fullname || "Người dùng"}</h3><p>MSSV: {mssv || "Chưa liên kết"}</p></div></div>
      <nav className="menu">
        <a href="#" className="menu-item" onClick={e=>{e.preventDefault();navigate("home");}}>Trang chủ</a>
        <a href="#" className="menu-item" onClick={e=>{e.preventDefault();navigate("tuition");}}>Học phí</a>
        <a href="#" className="menu-item" onClick={e=>{e.preventDefault();navigate("transaction");}}>Giao dịch</a>
        <a href="#" className="menu-item active" onClick={e=>e.preventDefault()}>Lịch sử giao dịch</a>
      </nav><button className="logout-btn" type="button" onClick={onLogout}>Đăng xuất</button>
    </aside>
    {sidebarOpen && <div className="sidebar-overlay show" onClick={()=>setSidebarOpen(false)} />}
    <main className="main-content"><div className="page">
      <button className="mobile-menu-btn" type="button" onClick={()=>setSidebarOpen(true)}>☰ Menu</button>
      <header className="page-header"><h1>Lịch sử giao dịch học phí</h1><p>Lịch sử thay đổi trạng thái học phí từ Tuition Service</p></header>
      <section className="filter-card" style={{display:"flex",flexWrap:"wrap",gap:16,alignItems:"end"}}>
        <label>Từ ngày <input type="date" value={fromDate} onChange={e=>{setFromDate(e.target.value);setCurrentPage(1);}} /></label>
        <label>Đến ngày <input type="date" value={toDate} onChange={e=>{setToDate(e.target.value);setCurrentPage(1);}} /></label>
        <button type="button" onClick={()=>{setFromDate("");setToDate("");setCurrentPage(1);}}>Xóa lọc</button>
      </section>
      {loading && <p role="status">Đang tải lịch sử...</p>}
      {error && <p role="alert" style={{color:"#b42318"}}>{error}</p>}
      {!loading && !error && <section className="filter-card" style={{display:"block"}}>
        <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",textAlign:"left"}}>
          <thead><tr><th style={{padding:12}}>Mã lịch sử</th><th style={{padding:12}}>Ngày thay đổi</th><th style={{padding:12}}>MSSV</th><th style={{padding:12}}>Trạng thái cũ</th><th style={{padding:12}}>Trạng thái mới</th></tr></thead>
          <tbody>{pageData.map(item=><tr key={item.transactionId ?? item.transaction_id}><td style={{padding:12}}>{item.transactionId ?? item.transaction_id}</td><td style={{padding:12}}>{item.changedAt || item.changed_at ? new Date(item.changedAt || item.changed_at).toLocaleString("vi-VN") : "—"}</td><td style={{padding:12}}>{item.mssv}</td><td style={{padding:12}}>{formatTuitionStatus(item.oldStatus ?? item.old_status)}</td><td style={{padding:12}}>{formatTuitionStatus(item.newStatus ?? item.new_status)}</td></tr>)}</tbody>
        </table></div>
        {!filtered.length && <p style={{padding:16}}>Chưa có lịch sử giao dịch học phí phù hợp.</p>}
        <div style={{display:"flex",gap:16,alignItems:"center",justifyContent:"flex-end",padding:14}}><button type="button" disabled={currentPage===1} onClick={()=>setCurrentPage(p=>p-1)}>Trước</button><span>Trang {currentPage}/{totalPages}</span><button type="button" disabled={currentPage>=totalPages} onClick={()=>setCurrentPage(p=>p+1)}>Sau</button></div>
      </section>}
      <p style={{fontSize:12,color:"#796d6d"}}>Đây là lịch sử trạng thái học phí, không phải sao kê nạp/rút tiền ngân hàng.</p>
    </div></main>
  </div>;
}
