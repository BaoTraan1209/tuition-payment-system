import { useState } from "react";
import "./TransactionHistory.css";


// =====================================================
// DATA DEMO
// Sau này thay bằng API FastAPI
// =====================================================

const transactions = [
    {
        date: "2026-09-05 14:32",
        type: "deposit",
        typeName: "Nạp tiền",
        amount: 2000000,
        status: "Thành công",
        code: "GD05092026001"
    },

    {
        date: "2026-09-04 10:15",
        type: "withdraw",
        typeName: "Rút tiền",
        amount: -500000,
        status: "Thành công",
        code: "GD04092026002"
    },

    {
        date: "2026-09-02 09:20",
        type: "tuition",
        typeName: "Thanh toán học phí",
        amount: -3500000,
        status: "Thành công",
        code: "GD02092026003"
    },

    {
        date: "2026-08-30 16:45",
        type: "deposit",
        typeName: "Nạp tiền",
        amount: 1000000,
        status: "Thành công",
        code: "GD30082026004"
    },

    {
        date: "2026-08-28 11:12",
        type: "withdraw",
        typeName: "Rút tiền",
        amount: -1200000,
        status: "Thành công",
        code: "GD28082026005"
    },

    {
        date: "2026-08-25 08:30",
        type: "tuition",
        typeName: "Thanh toán học phí",
        amount: -800000,
        status: "Thành công",
        code: "GD25082026006"
    },

    {
        date: "2026-08-20 13:25",
        type: "deposit",
        typeName: "Nạp tiền",
        amount: 5000000,
        status: "Thành công",
        code: "GD20082026007"
    },

    {
        date: "2026-08-18 17:40",
        type: "withdraw",
        typeName: "Rút tiền",
        amount: -300000,
        status: "Thành công",
        code: "GD18082026008"
    }
];


function TransactionHistory() {

    // =====================================================
    // FILTER
    // =====================================================

    const [fromDate, setFromDate] = useState("");

    const [toDate, setToDate] = useState("");

    const [transactionType, setTransactionType] =
        useState("all");


    // =====================================================
    // DATA
    // =====================================================

    const [currentData, setCurrentData] =
        useState(transactions);


    // =====================================================
    // PAGE
    // =====================================================

    const [currentPage, setCurrentPage] =
        useState(1);

    const pageSize = 5;


    // =====================================================
    // SIDEBAR
    // =====================================================

    const [sidebarOpen, setSidebarOpen] =
        useState(false);


    // =====================================================
    // TOAST
    // =====================================================

    const [toastMessage, setToastMessage] =
        useState("");

    const [showToast, setShowToast] =
        useState(false);


    // =====================================================
    // FORMAT MONEY
    // =====================================================

    const formatMoney = (amount) => {

        return new Intl.NumberFormat(
            "vi-VN"
        ).format(
            Math.abs(amount)
        );

    };


    // =====================================================
    // TYPE ICON
    // =====================================================

    const getTypeIcon = (type) => {

        if (type === "deposit") {

            return (
                <div className="type-icon deposit">
                    <i className="bx bx-down-arrow-alt"></i>
                </div>
            );

        }


        if (type === "withdraw") {

            return (
                <div className="type-icon withdraw">
                    <i className="bx bx-up-arrow-alt"></i>
                </div>
            );

        }


        return (
            <div className="type-icon tuition">
                <i className="bx bx-credit-card"></i>
            </div>
        );

    };


    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch = () => {

        const filteredData =
            transactions.filter(
                (item) => {

                    let validType = true;

                    let validFrom = true;

                    let validTo = true;


                    if (
                        transactionType !== "all"
                    ) {

                        validType =
                            item.type === transactionType;

                    }


                    const itemDate =
                        item.date.substring(
                            0,
                            10
                        );


                    if (fromDate) {

                        validFrom =
                            itemDate >= fromDate;

                    }


                    if (toDate) {

                        validTo =
                            itemDate <= toDate;

                    }


                    return (
                        validType &&
                        validFrom &&
                        validTo
                    );

                }
            );


        setCurrentData(
            filteredData
        );


        setCurrentPage(1);


        setToastMessage(
            `Tìm thấy ${filteredData.length} giao dịch`
        );


        setShowToast(true);


        setTimeout(
            () => {

                setShowToast(false);

            },
            2500
        );

    };


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages =
        Math.ceil(
            currentData.length /
            pageSize
        );


    const start =
        (currentPage - 1) *
        pageSize;


    const end =
        start +
        pageSize;


    const pageData =
        currentData.slice(
            start,
            end
        );


    const handlePrevious = () => {

        if (currentPage > 1) {

            setCurrentPage(
                currentPage - 1
            );

        }

    };


    const handleNext = () => {

        if (
            currentPage <
            totalPages
        ) {

            setCurrentPage(
                currentPage + 1
            );

        }

    };


    // =====================================================
    // JSX
    // =====================================================

    return (

        <div className="app">


            {/* =========================================
                SIDEBAR
            ========================================== */}

            <aside
                className={
                    `sidebar ${
                        sidebarOpen
                            ? "open"
                            : ""
                    }`
                }
            >

                <div className="brand">

                    <div className="brand-icon">

                        <i className="bx bxs-bank"></i>

                    </div>

                    <h2>
                        iBanking
                    </h2>

                </div>


                <div className="user-card">

                    <div className="avatar">

                        <i className="bx bxs-user"></i>

                    </div>


                    <div className="user-info">

                        <h3>
                            Nguyễn Văn A
                        </h3>

                        <p>
                            MSSV: 522H0113
                        </p>

                    </div>

                </div>


                <nav className="menu">

                    <a
                        href="/"
                        className="menu-item"
                    >

                        <i className="bx bx-home-alt-2"></i>

                        <span>
                            Trang chủ
                        </span>

                    </a>


                    <a
                        href="/tuition"
                        className="menu-item"
                    >

                        <i className="bx bxs-graduation"></i>

                        <span>
                            Học phí
                        </span>

                    </a>


                    <a
                        href="/transaction"
                        className="menu-item"
                    >

                        <i className="bx bx-transfer-alt"></i>

                        <span>
                            Giao dịch
                        </span>

                    </a>


                    <a
                        href="/history"
                        className="menu-item active"
                    >

                        <i className="bx bx-history"></i>

                        <span>
                            Lịch sử giao dịch
                        </span>

                    </a>

                </nav>


                <button
                    className="logout-btn"
                    type="button"
                >

                    <i className="bx bx-log-out"></i>

                    <span>
                        Đăng xuất
                    </span>

                </button>

            </aside>


            {/* =========================================
                OVERLAY
            ========================================== */}

            <div
                className={
                    `sidebar-overlay ${
                        sidebarOpen
                            ? "show"
                            : ""
                    }`
                }
                onClick={() =>
                    setSidebarOpen(false)
                }
            ></div>


            {/* =========================================
                MAIN
            ========================================== */}

            <main className="main-content">


                {/* MOBILE TOPBAR */}

                <header className="mobile-topbar">

                    <button
                        type="button"
                        onClick={() =>
                            setSidebarOpen(true)
                        }
                    >

                        <i className="bx bx-menu"></i>

                    </button>


                    <strong>
                        iBanking
                    </strong>


                    <button type="button">

                        <i className="bx bx-bell"></i>

                    </button>

                </header>


                <section className="page">


                    {/* =================================
                        TITLE
                    ================================== */}

                    <div className="page-header">

                        <div>

                            <h1>
                                Lịch sử giao dịch
                            </h1>

                        </div>

                    </div>


                    {/* =================================
                        FILTER
                    ================================== */}

                    <section className="filter-card">


                        <div className="filter-group">

                            <label htmlFor="fromDate">

                                Từ ngày

                            </label>


                            <input
                                type="date"
                                id="fromDate"
                                value={fromDate}
                                onChange={
                                    (event) =>
                                        setFromDate(
                                            event.target.value
                                        )
                                }
                            />

                        </div>


                        <div className="filter-group">

                            <label htmlFor="toDate">

                                Đến ngày

                            </label>


                            <input
                                type="date"
                                id="toDate"
                                value={toDate}
                                onChange={
                                    (event) =>
                                        setToDate(
                                            event.target.value
                                        )
                                }
                            />

                        </div>


                        <div className="filter-group">

                            <label htmlFor="transactionType">

                                Loại giao dịch

                            </label>


                            <select
                                id="transactionType"
                                value={transactionType}
                                onChange={
                                    (event) =>
                                        setTransactionType(
                                            event.target.value
                                        )
                                }
                            >

                                <option value="all">
                                    Tất cả
                                </option>

                                <option value="deposit">
                                    Nạp tiền
                                </option>

                                <option value="withdraw">
                                    Rút tiền
                                </option>

                                <option value="tuition">
                                    Thanh toán học phí
                                </option>

                            </select>

                        </div>


                        <button
                            className="search-btn"
                            type="button"
                            onClick={handleSearch}
                        >

                            <i className="bx bx-search"></i>

                            <span>
                                Tìm kiếm
                            </span>

                        </button>

                    </section>


                    {/* =================================
                        TRANSACTION TABLE
                    ================================== */}

                    <section className="history-card">


                        <div className="history-header">

                            <h2>
                                Danh sách giao dịch
                            </h2>


                            <span>

                                Tổng số:
                                {" "}
                                {currentData.length}
                                {" "}
                                giao dịch

                            </span>

                        </div>


                        <div className="table-wrapper">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            STT
                                        </th>

                                        <th>
                                            Ngày giao dịch
                                        </th>

                                        <th>
                                            Loại giao dịch
                                        </th>

                                        <th>
                                            Số tiền
                                        </th>

                                        <th>
                                            Trạng thái
                                        </th>

                                        <th>
                                            Mã giao dịch
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>


                                    {
                                        pageData.length === 0
                                            ? (

                                                <tr>

                                                    <td
                                                        colSpan="6"
                                                        style={{
                                                            textAlign:
                                                                "center",

                                                            padding:
                                                                "35px",

                                                            color:
                                                                "#7e7070"
                                                        }}
                                                    >

                                                        Không tìm thấy giao dịch

                                                    </td>

                                                </tr>

                                            )
                                            : (

                                                pageData.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => {

                                                        const realIndex =
                                                            start +
                                                            index +
                                                            1;


                                                        const moneyClass =
                                                            item.amount > 0
                                                                ? "in"
                                                                : "out";


                                                        const moneySymbol =
                                                            item.amount > 0
                                                                ? "+"
                                                                : "-";


                                                        return (

                                                            <tr
                                                                key={
                                                                    item.code
                                                                }
                                                            >

                                                                <td>
                                                                    {realIndex}
                                                                </td>


                                                                <td>
                                                                    {item.date}
                                                                </td>


                                                                <td>

                                                                    <div className="transaction-type">

                                                                        {
                                                                            getTypeIcon(
                                                                                item.type
                                                                            )
                                                                        }

                                                                        <span>
                                                                            {
                                                                                item.typeName
                                                                            }
                                                                        </span>

                                                                    </div>

                                                                </td>


                                                                <td
                                                                    className={
                                                                        `money ${moneyClass}`
                                                                    }
                                                                >

                                                                    {
                                                                        moneySymbol
                                                                    }

                                                                    {" "}

                                                                    {
                                                                        formatMoney(
                                                                            item.amount
                                                                        )
                                                                    }

                                                                    {" "}

                                                                    VND

                                                                </td>


                                                                <td>

                                                                    <span className="status">

                                                                        <span className="status-dot"></span>

                                                                        {
                                                                            item.status
                                                                        }

                                                                    </span>

                                                                </td>


                                                                <td>
                                                                    {item.code}
                                                                </td>

                                                            </tr>

                                                        );

                                                    }
                                                )

                                            )
                                    }

                                </tbody>

                            </table>

                        </div>


                        {/* =================================
                            PAGINATION
                        ================================== */}

                        {
                            totalPages > 0 && (

                                <div className="pagination">


                                    <button
                                        type="button"
                                        onClick={handlePrevious}
                                        disabled={
                                            currentPage === 1
                                        }
                                    >

                                        <i className="bx bx-chevron-left"></i>

                                    </button>


                                    {
                                        Array.from(
                                            {
                                                length:
                                                    totalPages
                                            },
                                            (
                                                _,
                                                index
                                            ) => {

                                                const pageNumber =
                                                    index + 1;


                                                return (

                                                    <button
                                                        key={
                                                            pageNumber
                                                        }
                                                        type="button"
                                                        className={
                                                            currentPage ===
                                                            pageNumber
                                                                ? "active-page"
                                                                : ""
                                                        }
                                                        onClick={() =>
                                                            setCurrentPage(
                                                                pageNumber
                                                            )
                                                        }
                                                    >

                                                        {
                                                            pageNumber
                                                        }

                                                    </button>

                                                );

                                            }
                                        )
                                    }


                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={
                                            currentPage ===
                                            totalPages
                                        }
                                    >

                                        <i className="bx bx-chevron-right"></i>

                                    </button>

                                </div>

                            )
                        }

                    </section>

                </section>

            </main>


            {/* =========================================
                TOAST
            ========================================== */}

            <div
                className={
                    `toast ${
                        showToast
                            ? "show"
                            : ""
                    }`
                }
            >

                <i className="bx bx-check-circle"></i>

                <span>
                    {toastMessage}
                </span>

            </div>

        </div>

    );

}


export default TransactionHistory;