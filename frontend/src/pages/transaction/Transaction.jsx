import { useState } from "react";
import "./Transaction.css";


function Transaction() {

    // =====================================================
    // BIẾN
    // =====================================================

    const [currentBalance, setCurrentBalance] =
        useState(120500000);

    const [currentTab, setCurrentTab] =
        useState("deposit");

    const [balanceHidden, setBalanceHidden] =
        useState(false);

    const [pendingWithdraw, setPendingWithdraw] =
        useState(null);

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [amount, setAmount] =
        useState("");

    const [content, setContent] =
        useState("");

    const [bank, setBank] =
        useState("");

    const [withdrawBank, setWithdrawBank] =
        useState("");

    const [withdrawAccount, setWithdrawAccount] =
        useState("");

    const [withdrawOwner] =
        useState("NGUYỄN VĂN A");

    const [otpOpen, setOtpOpen] =
        useState(false);

    const [otpInput, setOtpInput] =
        useState("");

    const [toastMessage, setToastMessage] =
        useState("");

    const [toastShow, setToastShow] =
        useState(false);


    // =====================================================
    // FORMAT TIỀN
    // =====================================================

    function formatMoney(amount) {

        return new Intl.NumberFormat(
            "vi-VN"
        ).format(amount);

    }


    // =====================================================
    // UPDATE SỐ DƯ
    // =====================================================

    function updateBalance() {

        if (balanceHidden) {

            return "•••••••••";

        } else {

            return formatMoney(
                currentBalance
            );

        }

    }


    // =====================================================
    // ẨN / HIỆN SỐ DƯ
    // =====================================================

    function handleHideBalance() {

        setBalanceHidden(
            !balanceHidden
        );

    }


    // =====================================================
    // SIDEBAR MOBILE
    // =====================================================

    function openSidebar() {

        setSidebarOpen(true);

    }


    function closeSidebar() {

        setSidebarOpen(false);

    }


    // =====================================================
    // CHUYỂN TAB NẠP / RÚT
    // =====================================================

    function handleTab(tab) {

        setCurrentTab(tab);

        resetForm();

    }


    // =====================================================
    // SUBMIT NẠP / RÚT
    // =====================================================

    function handleSubmit() {

        const amountNumber =
            Number(amount);


        // =================================================
        // KIỂM TRA SỐ TIỀN
        // =================================================

        if (
            !amountNumber ||
            amountNumber <= 0
        ) {

            showToast(
                "Vui lòng nhập số tiền hợp lệ."
            );

            return;

        }


        if (amountNumber < 10000) {

            showToast(
                "Số tiền tối thiểu là 10.000 VND."
            );

            return;

        }


        // =================================================
        // NẠP TIỀN
        // =================================================

        if (
            currentTab ===
            "deposit"
        ) {

            if (!bank) {

                showToast(
                    "Vui lòng chọn ngân hàng nguồn."
                );

                return;

            }


            if (
                amountNumber >
                100000000
            ) {

                showToast(
                    "Số tiền nạp tối đa là 100.000.000 VND."
                );

                return;

            }


            // Cộng tiền

            setCurrentBalance(
                currentBalance +
                amountNumber
            );


            showToast(
                `Nạp ${formatMoney(
                    amountNumber
                )} VND thành công.`
            );


            resetForm();

            return;

        }


        // =================================================
        // RÚT TIỀN
        // =================================================

        if (
            currentTab ===
            "withdraw"
        ) {

            // Chọn ngân hàng

            if (!withdrawBank) {

                showToast(
                    "Vui lòng chọn ngân hàng nhận tiền."
                );

                return;

            }


            // Số tài khoản

            const accountNumber =
                withdrawAccount.trim();


            if (
                !/^[0-9]{8,16}$/.test(
                    accountNumber
                )
            ) {

                showToast(
                    "Số tài khoản phải gồm 8 đến 16 chữ số."
                );

                return;

            }


            // Kiểm tra số dư

            if (
                amountNumber >
                currentBalance
            ) {

                showToast(
                    "Số dư tài khoản không đủ."
                );

                return;

            }


            // Lưu giao dịch rút tạm thời

            setPendingWithdraw({

                amount:
                    amountNumber,

                bank:
                    withdrawBank,

                account:
                    accountNumber,

                owner:
                    withdrawOwner,

                content:
                    content.trim()

            });


            // Mở OTP

            openOtpModal();

        }

    }


    // =====================================================
    // MỞ OTP
    // =====================================================

    function openOtpModal() {

        setOtpInput("");

        setOtpOpen(true);

    }


    // =====================================================
    // ĐÓNG OTP
    // =====================================================

    function closeOtpModal() {

        setOtpOpen(false);

        setOtpInput("");

    }


    // =====================================================
    // OTP CHỈ NHẬP SỐ
    // =====================================================

    function handleOtpInput(event) {

        const value =
            event.target.value
                .replace(
                    /\D/g,
                    ""
                );

        setOtpInput(value);

    }


    // =====================================================
    // XÁC NHẬN OTP
    // =====================================================

    function confirmOtp() {

        const otp =
            otpInput.trim();


        if (
            otp.length !== 6
        ) {

            showToast(
                "Vui lòng nhập đủ 6 số OTP."
            );

            return;

        }


        // OTP test

        if (
            otp !== "123456"
        ) {

            showToast(
                "Mã OTP không chính xác."
            );

            return;

        }


        if (
            !pendingWithdraw
        ) {

            closeOtpModal();

            return;

        }


        // Check số dư lần cuối

        if (
            pendingWithdraw.amount >
            currentBalance
        ) {

            showToast(
                "Số dư tài khoản không đủ."
            );

            setPendingWithdraw(
                null
            );

            closeOtpModal();

            return;

        }


        // Trừ tiền

        setCurrentBalance(
            currentBalance -
            pendingWithdraw.amount
        );


        showToast(
            `Rút ${formatMoney(
                pendingWithdraw.amount
            )} VND thành công.`
        );


        setPendingWithdraw(
            null
        );

        closeOtpModal();

        resetForm();

    }


    // =====================================================
    // ENTER ĐỂ XÁC NHẬN OTP
    // =====================================================

    function handleOtpKeyDown(
        event
    ) {

        if (
            event.key ===
            "Enter"
        ) {

            confirmOtp();

        }

    }


    // =====================================================
    // RESET FORM
    // =====================================================

    function resetForm() {

        setAmount("");

        setContent("");

        setBank("");

        setWithdrawBank("");

        setWithdrawAccount("");

    }


    // =====================================================
    // TOAST
    // =====================================================

    function showToast(message) {

        setToastMessage(
            message
        );

        setToastShow(true);


        setTimeout(() => {

            setToastShow(
                false
            );

        }, 3000);

    }


    // =====================================================
    // JSX
    // =====================================================

    return (

        <div className="app">


            {/* =================================================
                             SIDEBAR
            ================================================== */}

            <aside
                className={
                    `sidebar ${
                        sidebarOpen
                            ? "open"
                            : ""
                    }`
                }
                id="sidebar"
            >


                {/* BRAND */}

                <div className="brand">

                    <div className="brand-icon">

                        <i className="bx bxs-bank"></i>

                    </div>


                    <div>

                        <h2>
                            iBanking
                        </h2>

                    </div>

                </div>


                {/* USER */}

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


                {/* MENU */}

                <nav className="menu">

                    <a
                        href="#"
                        className="menu-item"
                    >

                        <i className="bx bx-home-alt-2"></i>

                        <span>
                            Trang chủ
                        </span>

                    </a>


                    <a
                        href="#"
                        className="menu-item"
                    >

                        <i className="bx bxs-graduation"></i>

                        <span>
                            Học phí
                        </span>

                    </a>


                    <a
                        href="#"
                        className="menu-item active"
                    >

                        <i className="bx bx-transfer-alt"></i>

                        <span>
                            Giao dịch
                        </span>

                    </a>


                    <a
                        href="#"
                        className="menu-item"
                    >

                        <i className="bx bx-history"></i>

                        <span>
                            Lịch sử giao dịch
                        </span>

                    </a>

                </nav>


                {/* LOGOUT */}

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


            {/* MOBILE OVERLAY */}

            <div
                className={
                    `sidebar-overlay ${
                        sidebarOpen
                            ? "show"
                            : ""
                    }`
                }
                id="overlay"
                onClick={
                    closeSidebar
                }
            ></div>



            {/* =================================================
                             MAIN CONTENT
            ================================================== */}

            <main className="main-content">


                {/* MOBILE TOPBAR */}

                <header className="mobile-topbar">

                    <button
                        id="menuBtn"
                        type="button"
                        onClick={
                            openSidebar
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



                {/* =================================================
                                  PAGE
                ================================================== */}

                <section className="page">


                    {/* ==========================================
                                 BALANCE
                    =========================================== */}

                    <section className="balance-card">


                        <div className="balance-left">


                            <div className="wallet-icon">

                                <i className="bx bx-wallet"></i>

                            </div>


                            <div className="balance-info">


                                {/* TITLE + EYE */}

                                <div className="balance-title-row">

                                    <span>
                                        SỐ DƯ HIỆN TẠI
                                    </span>


                                    <button
                                        id="hideBalance"
                                        className="eye-btn"
                                        type="button"
                                        onClick={
                                            handleHideBalance
                                        }
                                    >

                                        <i
                                            className={
                                                balanceHidden
                                                    ? "bx bx-hide"
                                                    : "bx bx-show"
                                            }
                                        ></i>

                                    </button>

                                </div>


                                {/* BALANCE */}

                                <h2 id="balance">

                                    {
                                        updateBalance()
                                    }

                                    <small>
                                        VND
                                    </small>

                                </h2>


                                {/* ACCOUNT */}

                                <p>

                                    Tài khoản:

                                    <strong>
                                        1029 384 756
                                    </strong>

                                </p>


                            </div>


                        </div>


                    </section>



                    {/* ==========================================
                                 ACTION
                    =========================================== */}

                    <section className="action-grid">


                        {/* NẠP TIỀN */}

                        <button
                            className={
                                `action-card ${
                                    currentTab ===
                                    "deposit"
                                        ? "active-action"
                                        : ""
                                }`
                            }
                            data-tab="deposit"
                            type="button"
                            onClick={() =>
                                handleTab(
                                    "deposit"
                                )
                            }
                        >


                            <div className="action-icon">

                                <i className="bx bx-down-arrow-alt"></i>

                            </div>


                            <div>

                                <strong>
                                    Nạp tiền
                                </strong>

                                <span>
                                    Nạp tiền vào tài khoản
                                </span>

                            </div>


                        </button>



                        {/* RÚT TIỀN */}

                        <button
                            className={
                                `action-card ${
                                    currentTab ===
                                    "withdraw"
                                        ? "active-action"
                                        : ""
                                }`
                            }
                            data-tab="withdraw"
                            type="button"
                            onClick={() =>
                                handleTab(
                                    "withdraw"
                                )
                            }
                        >


                            <div className="action-icon">

                                <i className="bx bx-up-arrow-alt"></i>

                            </div>


                            <div>

                                <strong>
                                    Rút tiền
                                </strong>

                                <span>
                                    Rút về ngân hàng liên kết
                                </span>

                            </div>


                        </button>


                    </section>



                    {/* ==========================================
                         TRANSACTION CONTENT
                    =========================================== */}

                    <section className="transaction-layout">



                        {/* ======================================
                                 LEFT FORM
                        ======================================= */}

                        <div className="transaction-form-card">


                            <h2 id="formTitle">

                                {
                                    currentTab ===
                                    "deposit"
                                        ? "Nạp tiền vào tài khoản"
                                        : "Rút tiền về ngân hàng"
                                }

                            </h2>



                            {/* SỐ TIỀN */}

                            <div className="form-group">

                                <label htmlFor="amount">
                                    Số tiền
                                </label>

                                <div className="money-input">

                                    <input
                                        id="amount"
                                        type="number"
                                        min="10000"
                                        step="1000"
                                        placeholder="Nhập số tiền"
                                        value={
                                            amount
                                        }
                                        onChange={
                                            event =>
                                                setAmount(
                                                    event.target.value
                                                )
                                        }
                                    />

                                    <span>
                                        VND
                                    </span>

                                </div>

                            </div>



                            {/* ==================================
                                 FORM NẠP TIỀN
                            =================================== */}

                            <div
                                id="depositFields"
                                className={
                                    currentTab ===
                                    "deposit"
                                        ? ""
                                        : "hidden"
                                }
                            >


                                <div className="form-group">

                                    <label htmlFor="bank">
                                        Nguồn tiền
                                    </label>


                                    <select
                                        id="bank"
                                        value={
                                            bank
                                        }
                                        onChange={
                                            event =>
                                                setBank(
                                                    event.target.value
                                                )
                                        }
                                    >

                                        <option value="">
                                            -- Chọn ngân hàng --
                                        </option>

                                        <option value="vietcombank">
                                            Vietcombank
                                        </option>

                                        <option value="bidv">
                                            BIDV
                                        </option>

                                        <option value="mbbank">
                                            MB Bank
                                        </option>

                                        <option value="vietinbank">
                                            VietinBank
                                        </option>

                                    </select>

                                </div>


                            </div>



                            {/* ==================================
                                 FORM RÚT TIỀN
                            =================================== */}

                            <div
                                id="withdrawFields"
                                className={
                                    currentTab ===
                                    "withdraw"
                                        ? ""
                                        : "hidden"
                                }
                            >


                                {/* BANK NHẬN */}

                                <div className="form-group">

                                    <label htmlFor="withdrawBank">
                                        Ngân hàng nhận tiền
                                    </label>


                                    <select
                                        id="withdrawBank"
                                        value={
                                            withdrawBank
                                        }
                                        onChange={
                                            event =>
                                                setWithdrawBank(
                                                    event.target.value
                                                )
                                        }
                                    >

                                        <option value="">
                                            -- Chọn ngân hàng nhận --
                                        </option>

                                        <option value="vietcombank">
                                            Vietcombank
                                        </option>

                                        <option value="bidv">
                                            BIDV
                                        </option>

                                        <option value="mbbank">
                                            MB Bank
                                        </option>

                                        <option value="vietinbank">
                                            VietinBank
                                        </option>

                                    </select>

                                </div>



                                {/* ACCOUNT */}

                                <div className="form-group">

                                    <label htmlFor="withdrawAccount">
                                        Số tài khoản nhận
                                    </label>

                                    <input
                                        id="withdrawAccount"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength="16"
                                        placeholder="Nhập số tài khoản"
                                        value={
                                            withdrawAccount
                                        }
                                        onChange={
                                            event =>
                                                setWithdrawAccount(
                                                    event.target.value
                                                )
                                        }
                                    />

                                </div>



                                {/* OWNER */}

                                <div className="form-group">

                                    <label htmlFor="withdrawOwner">
                                        Tên chủ tài khoản
                                    </label>

                                    <input
                                        id="withdrawOwner"
                                        type="text"
                                        value={
                                            withdrawOwner
                                        }
                                        readOnly
                                    />

                                </div>


                            </div>



                            {/* NỘI DUNG */}

                            <div className="form-group">


                                <label htmlFor="content">
                                    Nội dung
                                </label>


                                <input
                                    id="content"
                                    type="text"
                                    placeholder={
                                        currentTab ===
                                        "deposit"
                                            ? "Ví dụ: Nạp tiền đóng học phí"
                                            : "Ví dụ: Rút tiền về Vietcombank"
                                    }
                                    value={
                                        content
                                    }
                                    onChange={
                                        event =>
                                            setContent(
                                                event.target.value
                                            )
                                    }
                                />


                            </div>



                            {/* SUBMIT */}

                            <button
                                id="submitBtn"
                                className="submit-btn"
                                type="button"
                                onClick={
                                    handleSubmit
                                }
                            >

                                {
                                    currentTab ===
                                    "deposit"
                                        ? "Nạp tiền ngay"
                                        : "Rút tiền ngay"
                                }

                            </button>


                        </div>



                        {/* ======================================
                               RIGHT PANEL
                        ======================================= */}

                        <div className="right-panel">



                            {/* NOTICE */}

                            <div className="notice-card">


                                <div className="notice-title">

                                    <i className="bx bxs-error-circle"></i>

                                    <strong>
                                        Lưu ý
                                    </strong>

                                </div>


                                <ul id="noticeList">

                                    <li>
                                        Số tiền tối thiểu: 10.000 VND
                                    </li>

                                    <li>
                                        Số tiền tối đa: 100.000.000 VND
                                    </li>

                                    <li>
                                        Vui lòng kiểm tra kỹ thông tin trước khi xác nhận giao dịch
                                    </li>

                                </ul>


                            </div>



                            {/* BANK CARD */}

                            <div className="bank-card">


                                <div className="bank-header">

                                    <h3>
                                        Ngân hàng liên kết
                                    </h3>

                                </div>



                                <div className="bank-grid">


                                    {/* VIETCOMBANK */}

                                    <div className="bank-item">

                                        <img
                                            src="img/vietcombank.jpg"
                                            alt="Vietcombank"
                                            className="bank-logo"
                                        />

                                        <div>

                                            <strong>
                                                Vietcombank
                                            </strong>

                                        </div>

                                    </div>



                                    {/* BIDV */}

                                    <div className="bank-item">

                                        <img
                                            src="img/bidv.jpg"
                                            alt="BIDV"
                                            className="bank-logo"
                                        />

                                        <div>

                                            <strong>
                                                BIDV
                                            </strong>

                                        </div>

                                    </div>



                                    {/* VIETINBANK */}

                                    <div className="bank-item">

                                        <img
                                            src="img/vietinbank.png"
                                            alt="VietinBank"
                                            className="bank-logo"
                                        />

                                        <div>

                                            <strong>
                                                VietinBank
                                            </strong>

                                        </div>

                                    </div>



                                    {/* MB BANK */}

                                    <div className="bank-item">

                                        <img
                                            src="img/mbbank.jpg"
                                            alt="MB Bank"
                                            className="bank-logo"
                                        />

                                        <div>

                                            <strong>
                                                MB Bank
                                            </strong>

                                        </div>

                                    </div>


                                </div>


                            </div>


                        </div>


                    </section>


                </section>


            </main>



            {/* =================================================
                                 OTP MODAL
            ================================================== */}

            <div
                className={
                    `modal-overlay ${
                        otpOpen
                            ? ""
                            : "hidden"
                    }`
                }
                id="otpModal"
                onClick={
                    event => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {

                            closeOtpModal();

                        }

                    }
                }
            >


                <div className="otp-modal">


                    <button
                        className="modal-close"
                        id="closeOtp"
                        type="button"
                        onClick={
                            closeOtpModal
                        }
                    >

                        <i className="bx bx-x"></i>

                    </button>


                    <div className="otp-icon">

                        <i className="bx bx-shield-quarter"></i>

                    </div>


                    <h2>
                        Xác thực OTP
                    </h2>


                    <p>

                        Mã OTP đã được gửi đến số điện thoại của bạn.

                    </p>


                    <div className="otp-demo">

                        OTP test:

                        <strong>
                            123456
                        </strong>

                    </div>


                    <input
                        id="otpInput"
                        className="otp-input"
                        type="text"
                        maxLength="6"
                        inputMode="numeric"
                        placeholder="Nhập mã OTP"
                        value={
                            otpInput
                        }
                        onChange={
                            handleOtpInput
                        }
                        onKeyDown={
                            handleOtpKeyDown
                        }
                    />


                    <button
                        id="confirmOtp"
                        className="submit-btn"
                        type="button"
                        onClick={
                            confirmOtp
                        }
                    >

                        Xác nhận OTP

                    </button>


                </div>


            </div>



            {/* =================================================
                                 TOAST
            ================================================== */}

            <div
                className={
                    `toast ${
                        toastShow
                            ? "show"
                            : ""
                    }`
                }
                id="toast"
            >

                <i className="bx bx-check-circle"></i>

                <span id="toastText">

                    {
                        toastMessage
                    }

                </span>

            </div>


        </div>

    );

}


export default Transaction;