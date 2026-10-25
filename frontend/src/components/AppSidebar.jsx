import { useState } from "react";

const MENU_ITEMS = [
  { key: "home", label: "Trang chủ", icon: "bx-home-alt-2", page: "home" },
  { key: "tuition", label: "Học phí", icon: "bxs-graduation", page: "tuition" },
  { key: "history", label: "Lịch sử giao dịch", icon: "bx-history", page: "transaction-history" },
  { key: "account", label: "Tài khoản", icon: "bx-user-circle", page: "transaction" },
];

function activeKeyForPage(page) {
  if (page === "home") return "home";
  if (page === "tuition" || page === "student-info" || page === "tuition-detail" || page === "payment-confirm" || page === "payment-result") return "tuition";
  if (page === "transaction-history") return "history";
  if (page === "transaction") return "account";
  return "home";
}

export default function AppSidebar({ user, page, onNavigate, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activeKey = activeKeyForPage(page);
  const fullName = user?.fullname ?? user?.full_name ?? user?.name ?? "Người dùng";
  const mssv = user?.mssv ?? user?.student_id ?? user?.student_code ?? "Chưa cập nhật";

  const navigate = (target) => {
    setSidebarOpen(false);
    onNavigate?.(target);
  };

  return (
    <>
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} id="sidebar">
        <div className="brand">
          <div className="brand-icon"><i className="bx bxs-bank" /></div>
          <div><h2>iBanking</h2></div>
        </div>

        <div className="user-card">
          <div className="avatar"><i className="bx bxs-user" /></div>
          <div className="user-info">
            <h3>{fullName}</h3>
            <p>MSSV: {mssv}</p>
          </div>
        </div>

        <nav className="menu" aria-label="Điều hướng chính">
          {MENU_ITEMS.map((item) => (
            <a
              key={item.key}
              href="#"
              className={`menu-item ${activeKey === item.key ? "active" : ""}`}
              aria-current={activeKey === item.key ? "page" : undefined}
              onClick={(event) => {
                event.preventDefault();
                navigate(item.page);
              }}
            >
              <i className={`bx ${item.icon}`} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <button className="logout-btn" type="button" onClick={onLogout}>
          <i className="bx bx-log-out" />
          <span>Đăng xuất</span>
        </button>
      </aside>

      <div
        className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      <header className="mobile-topbar">
        <button className="menu-toggle" type="button" onClick={() => setSidebarOpen((open) => !open)} aria-label="Mở menu">
          <i className="bx bx-menu" />
        </button>
        <strong>iBanking</strong>
        <span aria-hidden="true" />
      </header>
    </>
  );
}
