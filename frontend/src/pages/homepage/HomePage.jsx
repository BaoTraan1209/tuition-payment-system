import { useEffect, useState } from "react";
import "./Homepage.css";

function Homepage({ user, onNavigate, onLogout }) {

    // CURRENT DATE
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        const today = new Date();

        setCurrentDate(
            today.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            })
        );
    }, []);

    // USER DATA FROM MYSQL
    const fullname = user?.fullname || "Chưa cập nhật";
    const phone = user?.phone || "Chưa cập nhật";
    const email = user?.email || "Chưa cập nhật";
    const mssv = user?.mssv || "Chưa liên kết";

    const balance = user?.balance != null
        ? Number(user.balance).toLocaleString("vi-VN")
        : "—";

    // SHOW / HIDE BALANCE
    const [balanceVisible, setBalanceVisible] = useState(true);

    // COPY ACCOUNT NUMBER
    const [copied, setCopied] = useState(false);

    // Số thẻ hiện chỉ dùng minh họa giao diện
    const accountNumber = "1029384756";

    const handleCopyAccount = async () => {
        try {
            await navigator.clipboard.writeText(accountNumber);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1500);

        } catch (error) {
            console.error("Không thể sao chép số tài khoản:", error);
        }
    };

    // MOBILE SIDEBAR
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const toggleSidebar = () => {
        setSidebarOpen(previous => !previous);
    };

    // ACTIVE SIDEBAR ITEM
    const [activeMenu, setActiveMenu] = useState("home");

    const handleMenuClick = (menuName) => {
        setActiveMenu(menuName);

        const routes = {
            home: "home",
            tuition: "tuition",
            transaction: "transaction",
            history: "transaction-history"
        };

        if (routes[menuName]) {
            onNavigate?.(routes[menuName]);
        }

        if (window.innerWidth <= 768) {
            closeSidebar();
        }
    };

    // RESIZE WINDOW
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="app">

            {/* SIDEBAR */}
            <aside
                className={`sidebar ${sidebarOpen ? "open" : ""}`}
                id="sidebar"
            >

                {/* BRAND */}
                <div className="brand">
                    <div className="brand-icon">
                        <i className="bx bxs-bank"></i>
                    </div>

                    <div>
                        <h2>iBanking</h2>
                    </div>
                </div>

                {/* USER */}
                <div className="user-card">
                    <div className="avatar">
                        <i className="bx bxs-user"></i>
                    </div>

                    <div className="user-info">
                        <h3>{fullname}</h3>
                        <p>MSSV: {mssv}</p>
                    </div>
                </div>

                {/* MENU */}
                <nav className="menu">

                    {/* TRANG CHỦ */}
                    <a
                        href="#"
                        className={`menu-item ${
                            activeMenu === "home" ? "active" : ""
                        }`}
                        onClick={(event) => {
                            event.preventDefault();
                            handleMenuClick("home");
                        }}
                    >
                        <i className="bx bx-home-alt-2"></i>
                        <span>Trang chủ</span>
                    </a>

                    {/* HỌC PHÍ */}
                    <a
                        href="#"
                        className={`menu-item ${
                            activeMenu === "tuition" ? "active" : ""
                        }`}
                        onClick={(event) => {
                            event.preventDefault();
                            handleMenuClick("tuition");
                        }}
                    >
                        <i className="bx bxs-graduation"></i>
                        <span>Học phí</span>
                    </a>

                    {/* GIAO DỊCH */}
                    <a
                        href="#"
                        className={`menu-item ${
                            activeMenu === "transaction" ? "active" : ""
                        }`}
                        onClick={(event) => {
                            event.preventDefault();
                            handleMenuClick("transaction");
                        }}
                    >
                        <i className="bx bx-transfer-alt"></i>
                        <span>Giao dịch</span>
                    </a>

                    {/* LỊCH SỬ */}
                    <a
                        href="#"
                        className={`menu-item ${
                            activeMenu === "history" ? "active" : ""
                        }`}
                        onClick={(event) => {
                            event.preventDefault();
                            handleMenuClick("history");
                        }}
                    >
                        <i className="bx bx-history"></i>
                        <span>Lịch sử giao dịch</span>
                    </a>

                </nav>

                {/* LOGOUT */}
                <button
                    className="logout-btn"
                    type="button"
                    onClick={onLogout}
                >
                    <i className="bx bx-log-out"></i>
                    <span>Đăng xuất</span>
                </button>

            </aside>

            {/* MOBILE OVERLAY */}
            <div
                className={`sidebar-overlay ${
                    sidebarOpen ? "show" : ""
                }`}
                onClick={closeSidebar}
            ></div>

            {/* MAIN */}
            <main className="main-content">

                {/* MOBILE TOPBAR */}
                <header className="mobile-topbar">
                    <button
                        className="menu-toggle"
                        type="button"
                        onClick={toggleSidebar}
                    >
                        <i className="bx bx-menu"></i>
                    </button>

                    <strong>iBanking</strong>

                    <button
                        className="notification-btn"
                        type="button"
                    >
                        <i className="bx bx-bell"></i>
                        <span className="notification-dot"></span>
                    </button>
                </header>

                <div className="dashboard">

                    {/* WELCOME */}
                    <section className="welcome-section">
                        <div>
                            <h1>Xin chào, {fullname}</h1>

                            <p className="welcome-text">
                                Hôm nay: {currentDate}
                            </p>
                        </div>
                    </section>

                    {/* ACCOUNT OVERVIEW */}
                    <section className="account-overview">

                        {/* BANK CARD */}
                        <div className="ibanking-card">

                            <div className="card-circle circle-one"></div>
                            <div className="card-circle circle-two"></div>

                            {/* TOP */}
                            <div className="bank-card-top">
                                <div className="bank-brand">

                                    <div className="Logo">
                                        <i className="bx bxs-bank"></i>
                                    </div>

                                    <div>
                                        <h3>iBanking</h3>
                                        <span>TDTU STUDENT CARD</span>
                                    </div>

                                </div>

                                <div className="card-network">
                                    <i className="bx bx-wifi"></i>
                                    <strong>DEBIT</strong>
                                </div>
                            </div>

                            {/* CHIP */}
                            <div className="bank-chip">
                                <div className="chip-line chip-line-1"></div>
                                <div className="chip-line chip-line-2"></div>
                                <div className="chip-line chip-line-3"></div>
                                <div className="chip-center"></div>
                            </div>

                            {/* CARD NUMBER - DEMO */}
                            <div className="bank-card-number">
                                <span>1029</span>
                                <span>3847</span>
                                <span>5612</span>
                                <span>7890</span>

                                <button
                                    className="copy-btn"
                                    type="button"
                                    title="Sao chép số thẻ minh họa"
                                    onClick={handleCopyAccount}
                                >
                                    <i className={
                                        copied
                                            ? "bx bx-check"
                                            : "bx bx-copy"
                                    }></i>
                                </button>
                            </div>

                            {/* BOTTOM */}
                            <div className="bank-card-bottom">

                                <div className="card-holder">
                                    <span className="card-label">
                                        CARD HOLDER
                                    </span>

                                    <strong>{fullname.toUpperCase()}</strong>
                                </div>

                                <div className="valid-thru">
                                    <span className="card-label">
                                        VALID THRU
                                    </span>

                                    <strong>19/10/2026</strong>
                                </div>

                                <div className="card-brand-mark">
                                    <div className="brand-circle"></div>
                                    <div className="brand-circle second"></div>
                                </div>

                            </div>
                        </div>

                        {/* ACCOUNT PANEL */}
                        <div className="account-panel">

                            {/* BALANCE */}
                            <div className="balance-area">
                                <div className="balance-label">
                                    <span>SỐ DƯ KHẢ DỤNG</span>

                                    <button
                                        className="eye-btn"
                                        type="button"
                                        title="Ẩn / hiện số dư"
                                        onClick={() => {
                                            setBalanceVisible(!balanceVisible);
                                        }}
                                    >
                                        <i className={
                                            balanceVisible
                                                ? "bx bx-hide"
                                                : "bx bx-show"
                                        }></i>
                                    </button>
                                </div>

                                <h2>
                                    {
                                        balanceVisible
                                            ? balance
                                            : "••••••••••"
                                    }

                                    <small>VND</small>
                                </h2>
                            </div>

                            <div className="account-divider"></div>

                            {/* ACCOUNT INFO */}
                            <div className="account-info-grid">

                                {/* NAME */}
                                <div className="account-info-card">
                                    <div className="info-icon">
                                        <i className="bx bx-user"></i>
                                    </div>

                                    <div>
                                        <span>Họ và tên</span>
                                        <strong>{fullname}</strong>
                                    </div>
                                </div>

                                {/* PHONE */}
                                <div className="account-info-card">
                                    <div className="info-icon">
                                        <i className="bx bx-mobile-alt"></i>
                                    </div>

                                    <div>
                                        <span>Số điện thoại</span>
                                        <strong>{phone}</strong>
                                    </div>
                                </div>

                                {/* EMAIL */}
                                <div className="account-info-card">
                                    <div className="info-icon">
                                        <i className="bx bx-envelope"></i>
                                    </div>

                                    <div>
                                        <span>Địa chỉ Email</span>
                                        <strong>{email}</strong>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>

                    {/* TRANSACTIONS */}
                    <section className="section">

                        <div className="section-header">
                            <div>
                                <p className="section-label">
                                    HOẠT ĐỘNG
                                </p>

                                <h2>Giao dịch gần đây</h2>
                            </div>

                            <a
                                href="#"
                                className="view-all"
                                onClick={(event) => {
                                    event.preventDefault();
                                    handleMenuClick("history");
                                }}
                            >
                                Xem tất cả
                                <i className="bx bx-right-arrow-alt"></i>
                            </a>
                        </div>

                        <div className="table-card">
                            <div className="table-responsive">
                                <table>

                                    <thead>
                                        <tr>
                                            <th>Giao dịch</th>
                                            <th>Ngày</th>
                                            <th>Trạng thái</th>
                                            <th className="text-right">
                                                Số tiền
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {/* Chưa kết nối TransactionDB */}
                                        <tr>
                                            <td
                                                colSpan={4}
                                                style={{
                                                    textAlign: "center",
                                                    padding: "30px",
                                                    color: "#888"
                                                }}
                                            >
                                                Chưa có dữ liệu giao dịch
                                            </td>
                                        </tr>
                                    </tbody>

                                </table>
                            </div>
                        </div>

                    </section>

                </div>
            </main>
        </div>
    );
}

export default Homepage;
