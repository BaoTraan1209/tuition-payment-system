import { useEffect, useState } from "react";

function PaymentConfirm() {

    // =====================================================
    // DATA
    // =====================================================

    const tuitionItems = [

        {
            name: "Học phí tín chỉ HK1 2024-2025",
            amount: 8500000
        },

        {
            name: "Phí cơ sở vật chất",
            amount: 1000000
        },

        {
            name: "Bảo hiểm y tế",
            amount: 500000
        }

    ];


    const [availableBalance] =
        useState(120500000);

    const [termsChecked, setTermsChecked] =
        useState(false);

    const [
        paymentConsentChecked,
        setPaymentConsentChecked
    ] = useState(false);

    const [termsModalOpen, setTermsModalOpen] =
        useState(false);

    const [sendingOtp, setSendingOtp] =
        useState(false);

    const [otpOpen, setOtpOpen] =
        useState(false);


    // Email sinh viên
    // Sau này lấy từ User Service / Auth Service

    const studentEmail =
        "522h0113@student.tdtu.edu.vn";


    // URL OTP Service

    const OTP_API =
        "http://127.0.0.1:8000";


    // =====================================================
    // FORMAT MONEY
    // =====================================================

    function formatMoney(amount) {

        return new Intl.NumberFormat(
            "vi-VN"
        ).format(amount);

    }


    // =====================================================
    // CALCULATE TOTAL
    // =====================================================

    function calculateTotal() {

        return tuitionItems.reduce(

            (total, item) =>
                total + item.amount,

            0
        );

    }


    const total =
        calculateTotal();


    // =====================================================
    // UPDATE CONFIRM STATE
    // =====================================================

    const hasEnoughBalance =
        availableBalance >= total;


    const confirmDisabled =
        !(
            hasEnoughBalance &&
            termsChecked &&
            paymentConsentChecked
        );


    // =====================================================
    // CLOSE TERMS WITH ESC
    // =====================================================

    useEffect(() => {

        function handleEscape(event) {

            if (
                event.key === "Escape"
            ) {

                setTermsModalOpen(false);

            }

        }


        document.addEventListener(
            "keydown",
            handleEscape
        );


        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, []);


    // =====================================================
    // BACK
    // =====================================================

    function goBack() {

        history.back();

    }


    // =====================================================
    // DEPOSIT
    // =====================================================

    function handleDeposit() {

        /*
        window.location.href =
            "../Transaction/1.html";
        */


        console.log(
            "Chuyển sang trang Nạp tiền"
        );

    }


    // =====================================================
    // SEND OTP REQUEST
    // =====================================================

    async function requestSendOtp() {

        const response =
            await fetch(
                `${OTP_API}/otp/send`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: studentEmail
                    })
                }
            );


        let data = {};


        try {

            data =
                await response.json();

        }

        catch {

            data = {};

        }


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Không thể gửi mã OTP."
            );

        }


        return data;

    }


    // =====================================================
    // CONFIRM PAYMENT
    // =====================================================

    async function handleConfirmPayment() {

        if (confirmDisabled) {

            return;

        }


        try {

            setSendingOtp(true);


            // =========================================
            // YÊU CẦU OTP SERVICE GỬI OTP
            // =========================================

            await requestSendOtp();


            // =========================================
            // MỞ OTP
            // =========================================

            setOtpOpen(true);

        }

        catch (error) {

            console.error(
                "Lỗi gửi OTP:",
                error
            );


            alert(
                error.message ||
                "Không thể gửi OTP."
            );

        }

        finally {

            setSendingOtp(false);

        }

    }


    return (

        <div>


            {/* =====================================================
                                 HEADER
            ===================================================== */}

            <header className="top-header">

                <div className="header-container">

                    <button
                        id="backTopBtn"
                        className="back-icon-btn"
                        type="button"
                        onClick={goBack}
                    >

                        <span className="material-symbols-outlined">

                            arrow_back

                        </span>

                    </button>


                    <h1>
                        Thanh toán học phí
                    </h1>

                </div>

            </header>



            {/* =====================================================
                                 MAIN
            ===================================================== */}

            <main className="main-container">


                {/* =================================================
                                STEPPER
                ================================================== */}

                <section className="stepper-section">

                    <div className="stepper-wrapper">


                        <div className="stepper-background-line"></div>


                        {/* STEP 1 */}

                        <div className="step-box">

                            <div className="step-circle completed-step">

                                <span className="material-symbols-outlined step-check">

                                    check

                                </span>

                            </div>


                            <span className="step-label completed-label">

                                1. Thông tin sinh viên

                            </span>

                        </div>



                        {/* STEP 2 */}

                        <div className="step-box">

                            <div className="step-circle completed-step">

                                <span className="material-symbols-outlined step-check">

                                    check

                                </span>

                            </div>


                            <span className="step-label completed-label">

                                2. Chi tiết học phí

                            </span>

                        </div>



                        {/* STEP 3 */}

                        <div className="step-box">

                            <div className="step-circle active-step">

                                3

                            </div>


                            <span className="step-label active-label">

                                3. Xác nhận thanh toán

                            </span>

                        </div>


                    </div>

                </section>



                {/* =================================================
                                 PAGE TITLE
                ================================================== */}

                <section className="page-title">

                    <h2>
                        Xác nhận thanh toán
                    </h2>

                    <p>
                        Vui lòng kiểm tra kỹ thông tin trước khi thực hiện giao dịch.
                    </p>

                </section>



                {/* =================================================
                                STUDENT INFORMATION
                ================================================== */}

                <section className="student-card">

                    <div className="student-card-header">


                        <div className="student-header-left">


                            <div className="student-main-icon">

                                <span className="material-symbols-outlined">

                                    school

                                </span>

                            </div>


                            <div>

                                <span className="student-card-label">

                                    THÔNG TIN SINH VIÊN

                                </span>

                                <h3>
                                    Nguyễn Văn A
                                </h3>

                            </div>


                        </div>



                        <div className="student-valid">

                            <span className="material-symbols-outlined">

                                verified

                            </span>

                            Hợp lệ

                        </div>


                    </div>



                    <div className="student-info-grid">


                        {/* MSSV */}

                        <div className="student-info-box">

                            <div className="info-box-icon">

                                <span className="material-symbols-outlined">

                                    badge

                                </span>

                            </div>


                            <div>

                                <span>
                                    Mã sinh viên
                                </span>

                                <strong>
                                    522H0113
                                </strong>

                            </div>

                        </div>



                        {/* HỌC KỲ */}

                        <div className="student-info-box">

                            <div className="info-box-icon">

                                <span className="material-symbols-outlined">

                                    calendar_month

                                </span>

                            </div>


                            <div>

                                <span>
                                    Học kỳ
                                </span>

                                <strong>
                                    HK1 2024 - 2025
                                </strong>

                            </div>

                        </div>



                        {/* KHOA */}

                        <div className="student-info-box">

                            <div className="info-box-icon">

                                <span className="material-symbols-outlined">

                                    domain

                                </span>

                            </div>


                            <div>

                                <span>
                                    Khoa
                                </span>

                                <strong>
                                    Công nghệ thông tin
                                </strong>

                            </div>

                        </div>



                        {/* EMAIL */}

                        <div className="student-info-box">

                            <div className="info-box-icon">

                                <span className="material-symbols-outlined">

                                    mail

                                </span>

                            </div>


                            <div>

                                <span>
                                    Email
                                </span>

                                <strong>

                                    {studentEmail}

                                </strong>

                            </div>

                        </div>


                    </div>

                </section>



                {/* =================================================
                                PAYMENT GRID
                ================================================== */}

                <section className="payment-grid">


                    {/* =================================================
                                 CHI TIẾT HỌC PHÍ
                    ================================================== */}

                    <div className="payment-card">


                        <div className="section-title">

                            <span className="material-symbols-outlined">

                                receipt_long

                            </span>

                            <h3>
                                Chi tiết thanh toán
                            </h3>

                        </div>



                        <div className="payment-item">

                            <div>

                                <strong>
                                    Học phí tín chỉ HK1 2024-2025
                                </strong>

                                <span>
                                    18 tín chỉ đăng ký
                                </span>

                            </div>


                            <strong className="item-price">

                                8.500.000 VND

                            </strong>

                        </div>



                        <div className="payment-item">

                            <div>

                                <strong>
                                    Phí cơ sở vật chất
                                </strong>

                                <span>
                                    Thư viện và phòng máy
                                </span>

                            </div>


                            <strong className="item-price">

                                1.000.000 VND

                            </strong>

                        </div>



                        <div className="payment-item">

                            <div>

                                <strong>
                                    Bảo hiểm y tế
                                </strong>

                                <span>
                                    Bảo hiểm bắt buộc 12 tháng
                                </span>

                            </div>


                            <strong className="item-price">

                                500.000 VND

                            </strong>

                        </div>



                        <div className="payment-total">

                            <span>
                                Tổng thanh toán
                            </span>

                            <strong id="totalPayment">

                                {formatMoney(total)} VND

                            </strong>

                        </div>


                    </div>



                    {/* =================================================
                                 ACCOUNT + TERMS
                    ================================================== */}

                    <div className="right-column">


                        {/* ACCOUNT */}

                        <div className="account-card">


                            <div className="section-title">

                                <span className="material-symbols-outlined">

                                    account_balance_wallet

                                </span>

                                <h3>
                                    Tài khoản thanh toán
                                </h3>

                            </div>



                            <div className="account-box">

                                <div className="account-icon">

                                    <span className="material-symbols-outlined">

                                        account_balance

                                    </span>

                                </div>


                                <div className="account-content">

                                    <span>
                                        Tài khoản sinh viên
                                    </span>

                                    <strong>
                                        1029 384 756
                                    </strong>

                                </div>

                            </div>



                            <div className="available-balance">

                                <span>
                                    Số dư khả dụng
                                </span>

                                <strong id="availableBalance">

                                    {formatMoney(
                                        availableBalance
                                    )} VND

                                </strong>

                            </div>


                        </div>



                        {/* BALANCE SUCCESS */}

                        {
                            hasEnoughBalance && (

                                <div
                                    className="balance-success"
                                    id="balanceSuccess"
                                >

                                    <span className="material-symbols-outlined">

                                        check_circle

                                    </span>


                                    <div>

                                        <strong>
                                            Đủ số dư
                                        </strong>

                                        <p>
                                            Tài khoản đủ điều kiện thực hiện thanh toán.
                                        </p>

                                    </div>

                                </div>

                            )
                        }



                        {/* BALANCE ERROR */}

                        {
                            !hasEnoughBalance && (

                                <div
                                    className="balance-alert"
                                    id="balanceAlert"
                                >

                                    <span className="material-symbols-outlined">

                                        error

                                    </span>


                                    <div>

                                        <strong>
                                            Số dư không đủ
                                        </strong>

                                        <p>
                                            Vui lòng nạp thêm tiền trước khi thực hiện thanh toán.
                                        </p>


                                        <button
                                            id="depositBtn"
                                            type="button"
                                            onClick={handleDeposit}
                                        >

                                            Nạp tiền

                                        </button>

                                    </div>

                                </div>

                            )
                        }



                        {/* =================================================
                                     THỎA THUẬN
                        ================================================== */}

                        <div className="terms-card">


                            <div className="section-title terms-title">

                                <span className="material-symbols-outlined">

                                    contract

                                </span>

                                <h3>
                                    Thỏa thuận thanh toán
                                </h3>

                            </div>



                            <label className="agreement-row">


                                <input
                                    id="termsCheckbox"
                                    type="checkbox"
                                    checked={termsChecked}
                                    onChange={
                                        event =>
                                            setTermsChecked(
                                                event.target.checked
                                            )
                                    }
                                />


                                <span>

                                    Tôi xác nhận các thông tin thanh toán bên trên là chính xác
                                    và đồng ý với{" "}


                                    <button
                                        id="openTermsBtn"
                                        className="terms-link"
                                        type="button"
                                        onClick={
                                            event => {

                                                event.preventDefault();

                                                event.stopPropagation();

                                                setTermsModalOpen(
                                                    true
                                                );

                                            }
                                        }
                                    >

                                        điều khoản thanh toán

                                    </button>


                                    {" "}của hệ thống.

                                </span>


                            </label>



                            <label className="agreement-row">


                                <input
                                    id="paymentConsentCheckbox"
                                    type="checkbox"
                                    checked={
                                        paymentConsentChecked
                                    }
                                    onChange={
                                        event =>
                                            setPaymentConsentChecked(
                                                event.target.checked
                                            )
                                    }
                                />


                                <span>

                                    Tôi đồng ý cho hệ thống trừ{" "}

                                    <strong>
                                        10.000.000 VND
                                    </strong>

                                    {" "}từ tài khoản sinh viên để thanh toán học phí.

                                </span>


                            </label>


                        </div>


                    </div>


                </section>


            </main>



            {/* =====================================================
                                  BOTTOM BAR
            ===================================================== */}

            <footer className="bottom-bar">


                <div className="bottom-container">


                    <div className="bottom-total">

                        <span>
                            Tổng thanh toán
                        </span>

                        <strong id="footerTotal">

                            {formatMoney(total)} VND

                        </strong>

                    </div>



                    <div className="bottom-actions">


                        <button
                            id="backBtn"
                            className="back-btn"
                            type="button"
                            onClick={goBack}
                        >

                            Quay lại

                        </button>



                        <button
                            id="confirmBtn"
                            className="confirm-btn"
                            type="button"
                            disabled={
                                confirmDisabled ||
                                sendingOtp
                            }
                            onClick={
                                handleConfirmPayment
                            }
                        >


                            <span className="material-symbols-outlined">

                                {
                                    sendingOtp
                                        ? "progress_activity"
                                        : "lock"
                                }

                            </span>


                            {
                                sendingOtp
                                    ? "Đang gửi OTP..."
                                    : "Xác nhận thanh toán"
                            }


                        </button>


                    </div>


                </div>


            </footer>



            {/* =====================================================
                                  TERMS MODAL
            ===================================================== */}

            {
                termsModalOpen && (

                    <div
                        id="termsModal"
                        className="modal-overlay"
                        onClick={
                            event => {

                                if (
                                    event.target ===
                                    event.currentTarget
                                ) {

                                    setTermsModalOpen(
                                        false
                                    );

                                }

                            }
                        }
                    >


                        <div className="terms-modal">


                            <button
                                id="closeTermsBtn"
                                className="modal-close"
                                type="button"
                                onClick={() =>
                                    setTermsModalOpen(false)
                                }
                            >

                                <span className="material-symbols-outlined">

                                    close

                                </span>

                            </button>



                            <div className="modal-icon">

                                <span className="material-symbols-outlined">

                                    description

                                </span>

                            </div>



                            <h2>
                                Điều khoản thanh toán
                            </h2>



                            <div className="terms-content">


                                <p>
                                    1. Người dùng chịu trách nhiệm kiểm tra chính xác thông tin sinh viên
                                    và các khoản học phí trước khi xác nhận.
                                </p>


                                <p>
                                    2. Sau khi giao dịch được xác nhận thành công, số tiền tương ứng sẽ
                                    được trừ từ tài khoản thanh toán.
                                </p>


                                <p>
                                    3. Giao dịch chỉ được hoàn tất sau khi xác thực OTP thành công.
                                </p>


                                <p>
                                    4. Trường hợp giao dịch thất bại, số dư tài khoản không được phép
                                    bị trừ.
                                </p>


                            </div>



                            <button
                                id="agreeTermsBtn"
                                className="agree-terms-btn"
                                type="button"
                                onClick={() => {

                                    setTermsChecked(true);

                                    setTermsModalOpen(false);

                                }}
                            >

                                Tôi đã hiểu

                            </button>


                        </div>


                    </div>

                )
            }



            {/* =====================================================
                                  OTP ROOT
            ===================================================== */}

            {
                otpOpen && (

                    <div id="otpRoot">

                        {
                            /*
                            SAU NÀY:

                            <OtpModal
                                email={studentEmail}
                                apiUrl={OTP_API}
                                onClose={() =>
                                    setOtpOpen(false)
                                }
                            />
                            */
                        }

                    </div>

                )
            }


        </div>

    );

}


export default PaymentConfirm;