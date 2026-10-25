import { useEffect, useState } from "react";
import { getMyTransactions } from "../services/transactionService.js";
import "./HomePage.css";

function Homepage({ user, onNavigate, onLogout }) {

    // CURRENT DATE
    const [currentDate, setCurrentDate] = useState("");
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [transactionsLoading, setTransactionsLoading] = useState(true);
    const [transactionsError, setTransactionsError] = useState("");

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



    // Load real transactions from backend; never substitute demo transactions.
    useEffect(() => {
        let active = true;
        (async () => {
            try {
                setTransactionsLoading(true);
                setTransactionsError("");
                const response = await getMyTransactions();
                const rows = Array.isArray(response)
                    ? response
                    : response?.transactions ?? response?.items ?? response?.data ?? [];
                if (active) setRecentTransactions(Array.isArray(rows) ? rows.slice(0, 5) : []);
            } catch (error) {
                if (active) {
                    setTransactionsError(
                        error?.response?.data?.detail ||
                        error?.message ||
                        "Không thể tải giao dịch từ backend."
                    );
                }
            } finally {
                if (active) setTransactionsLoading(false);
            }
        })();
        return () => { active = false; };
    }, []);

    const formatMoney = (value) => new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0
    }).format(Number(value ?? 0));

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

    const accountNumber = user?.account_number || user?.accountNumber || "";

    const handleCopyAccount = async () => {
        try {
            if (!accountNumber) return;
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
                            <p className="welcome-description">
                                Chào mừng bạn đến với iBanking TDTU. Bạn có thể tra cứu học phí,
                                theo dõi lịch sử giao dịch và quản lý thông tin tài khoản tại đây.
                            </p>
                        </div>
                    </section>

                    {/* QUICK ACTIONS */}
                    <section className="home-quick-actions">
                        <button type="button" className="home-action-card" onClick={() => handleMenuClick("tuition")}>
                            <span className="home-action-icon"><i className="bx bxs-graduation"></i></span>
                            <span className="home-action-copy">
                                <strong>Tra cứu học phí</strong>
                                <small>Xem các khoản thu và số tiền cần thanh toán</small>
                            </span>
                            <i className="bx bx-chevron-right home-action-arrow"></i>
                        </button>
                        <button type="button" className="home-action-card" onClick={() => handleMenuClick("transaction")}>
                            <span className="home-action-icon"><i className="bx bx-user-circle"></i></span>
                            <span className="home-action-copy">
                                <strong>Tài khoản</strong>
                                <small>Xem thông tin cá nhân và số dư khả dụng</small>
                            </span>
                            <i className="bx bx-chevron-right home-action-arrow"></i>
                        </button>
                        <button type="button" className="home-action-card" onClick={() => handleMenuClick("history")}>
                            <span className="home-action-icon"><i className="bx bx-history"></i></span>
                            <span className="home-action-copy">
                                <strong>Lịch sử giao dịch</strong>
                                <small>Tra cứu các giao dịch đã thực hiện</small>
                            </span>
                            <i className="bx bx-chevron-right home-action-arrow"></i>
                        </button>
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
                                        {transactionsLoading ? (
                                            <tr><td colSpan={4} style={{ textAlign: "center", padding: "30px" }}>Đang tải giao dịch...</td></tr>
                                        ) : transactionsError ? (
                                            <tr><td colSpan={4} role="alert" style={{ textAlign: "center", padding: "30px" }}>{String(transactionsError)}</td></tr>
                                        ) : recentTransactions.length === 0 ? (
                                            <tr><td colSpan={4} style={{ textAlign: "center", padding: "30px", color: "#888" }}>Backend chưa trả về dữ liệu giao dịch.</td></tr>
                                        ) : recentTransactions.map((item, index) => (
                                            <tr key={item.transaction_id ?? item.id ?? index}>
                                                <td>{item.description ?? item.tuition_name ?? item.transaction_id ?? item.id ?? "Giao dịch"}</td>
                                                <td>{item.created_at ? new Date(item.created_at).toLocaleDateString("vi-VN") : "—"}</td>
                                                <td>{item.status ?? "—"}</td>
                                                <td className="text-right">{formatMoney(item.amount ?? item.total_amount)}</td>
                                            </tr>
                                        ))}
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
