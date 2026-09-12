import { useState } from "react";
import "./PaymentResult.css";


function PaymentResult() {

    // =====================================================
    // STATE
    // =====================================================

    // success = thanh toán thành công
    // error   = thanh toán thất bại

    const [paymentState, setPaymentState] =
        useState("success");


    // =====================================================
    // SHOW SUCCESS
    // =====================================================

    function showSuccess() {

        setPaymentState("success");

    }


    // =====================================================
    // SHOW ERROR
    // =====================================================

    function showError() {

        setPaymentState("error");

    }


    // =====================================================
    // HOME
    // =====================================================

    function goHome() {

        /*
            Sau này khi có React Router:

            navigate("/");
        */


        console.log(
            "Về trang chủ"
        );

    }


    // =====================================================
    // RETRY
    // =====================================================

    function handleRetry() {

        /*
            Sau này quay lại:

            PaymentConfirm.jsx
        */


        console.log(
            "Quay lại bước xác nhận thanh toán"
        );


        // Nếu muốn test bằng history:
        // history.back();

    }


    // =====================================================
    // NEW TRANSACTION
    // =====================================================

    function handleNewTransaction() {

        /*
            Sau này có thể chuyển về:

            Tuition.jsx
        */


        console.log(
            "Thực hiện giao dịch khác"
        );

    }


    // =====================================================
    // SUPPORT
    // =====================================================

    function handleSupport() {

        alert(
            "Vui lòng liên hệ bộ phận hỗ trợ để được trợ giúp."
        );

    }


    // =====================================================
    // DOWNLOAD RECEIPT
    // =====================================================

    function handleDownloadReceipt() {

        /*
            DEMO:

            Mở hộp thoại in của trình duyệt.

            Người dùng có thể chọn
            Save as PDF để lưu biên lai.

            Sau này backend có thể có:

            GET /payments/{id}/receipt
        */


        window.print();

    }



    return (

        <div>


            {/* =====================================================
                        THANH TOÁN THÀNH CÔNG
            ===================================================== */}

            {
                paymentState === "success" && (

                    <main
                        className="result-card"
                        id="state-success"
                    >


                        {/* =================================================
                                     HEADER SUCCESS
                        ================================================== */}

                        <section className="result-header">


                            <span
                                className="
                                    material-symbols-outlined
                                    success-icon
                                "
                            >

                                check_circle

                            </span>


                            <h1>

                                Thanh toán học phí thành công!

                            </h1>


                            <p>

                                Giao dịch của bạn đã được ghi nhận
                                vào hệ thống.

                            </p>


                        </section>



                        {/* =================================================
                                     CHI TIẾT BIÊN LAI
                        ================================================== */}

                        <section className="receipt">


                            <h2>

                                CHI TIẾT BIÊN LAI

                            </h2>



                            {/* =============================================
                                     THÔNG TIN GIAO DỊCH
                            ============================================== */}


                            {/* MÃ GIAO DỊCH */}

                            <div className="receipt-row">


                                <span>

                                    Mã giao dịch

                                </span>


                                <strong id="transactionId">

                                    TXN-9824-H7M2

                                </strong>


                            </div>



                            {/* THỜI GIAN */}

                            <div className="receipt-row">


                                <span>

                                    Thời gian

                                </span>


                                <strong id="transactionTime">

                                    14:32, 24/10/2026

                                </strong>


                            </div>



                            {/* =============================================
                                     THÔNG TIN SINH VIÊN
                            ============================================== */}


                            {/* TÊN SINH VIÊN */}

                            <div className="receipt-row">


                                <span>

                                    Sinh viên

                                </span>


                                <strong id="studentName">

                                    Nguyễn Văn A

                                </strong>


                            </div>



                            {/* MÃ SINH VIÊN */}

                            <div className="receipt-row">


                                <span>

                                    Mã sinh viên

                                </span>


                                <strong id="studentId">

                                    522H0113

                                </strong>


                            </div>



                            {/* =============================================
                                     THÔNG TIN THANH TOÁN
                            ============================================== */}


                            {/* NỘI DUNG */}

                            <div className="receipt-row">


                                <span>

                                    Nội dung thanh toán

                                </span>


                                <strong id="paymentContent">

                                    Thanh toán học phí HK1 2024 - 2025

                                </strong>


                            </div>



                            {/* SỐ TIỀN */}

                            <div className="receipt-row">


                                <span>

                                    Số tiền

                                </span>


                                <strong
                                    className="payment-amount"
                                    id="paymentAmount"
                                >

                                    10.000.000 VND

                                </strong>


                            </div>



                            {/* TÀI KHOẢN TRÍCH NỢ */}

                            <div
                                className="
                                    receipt-row
                                    last-row
                                "
                            >


                                <span>

                                    Tài khoản trích nợ

                                </span>


                                <strong id="paymentAccount">

                                    1029 384 756

                                </strong>


                            </div>


                        </section>



                        {/* =================================================
                                     ACTION SUCCESS
                        ================================================== */}

                        <section className="success-actions">


                            {/* TẢI BIÊN LAI */}

                            <button
                                className="receipt-btn"
                                id="downloadReceiptBtn"
                                type="button"
                                onClick={
                                    handleDownloadReceipt
                                }
                            >


                                <span className="material-symbols-outlined">

                                    download

                                </span>


                                Lưu biên lai


                            </button>



                            {/* VỀ TRANG CHỦ */}

                            <button
                                className="primary-btn"
                                id="homeBtn"
                                type="button"
                                onClick={goHome}
                            >

                                Về trang chủ

                            </button>


                        </section>



                        {/* =================================================
                                 THỰC HIỆN GIAO DỊCH KHÁC
                        ================================================== */}

                        <div className="other-action">


                            <button
                                id="newTransactionBtn"
                                type="button"
                                onClick={
                                    handleNewTransaction
                                }
                            >

                                Thực hiện giao dịch khác

                            </button>


                        </div>


                    </main>

                )
            }



            {/* =====================================================
                        THANH TOÁN THẤT BẠI
            ===================================================== */}

            {
                paymentState === "error" && (

                    <main
                        className="
                            result-card
                            error-card
                        "
                        id="state-error"
                    >


                        {/* =================================================
                                     HEADER ERROR
                        ================================================== */}

                        <section
                            className="
                                result-header
                                error-header
                            "
                        >


                            <span
                                className="
                                    material-symbols-outlined
                                    error-icon
                                "
                            >

                                cancel

                            </span>


                            <h1>

                                Thanh toán thất bại!

                            </h1>


                        </section>



                        {/* =================================================
                                     ERROR CONTENT
                        ================================================== */}

                        <section className="error-content">


                            {/* NGUYÊN NHÂN */}

                            <div className="error-message">


                                <span className="material-symbols-outlined">

                                    info

                                </span>



                                <div>


                                    <strong>

                                        Nguyên nhân từ chối

                                    </strong>


                                    <p id="errorReason">

                                        Tài khoản của quý khách
                                        không đủ số dư để thực hiện
                                        giao dịch này.

                                        Vui lòng kiểm tra lại tài khoản
                                        hoặc nạp thêm tiền.

                                    </p>


                                </div>


                            </div>



                            {/* =================================================
                                 THÔNG TIN GIAO DỊCH LỖI
                            ================================================== */}

                            <div className="error-details">


                                {/* MÃ GIAO DỊCH */}

                                <div className="receipt-row">


                                    <span>

                                        Mã giao dịch

                                    </span>


                                    <strong id="failedTransactionId">

                                        TXN-9824-F4IL

                                    </strong>


                                </div>



                                {/* THỜI GIAN */}

                                <div
                                    className="
                                        receipt-row
                                        last-row
                                    "
                                >


                                    <span>

                                        Thời gian

                                    </span>


                                    <strong id="failedTransactionTime">

                                        14:35, 24/10/2026

                                    </strong>


                                </div>


                            </div>


                        </section>



                        {/* =================================================
                                     ERROR ACTION
                        ================================================== */}

                        <section className="error-actions">


                            {/* THỬ LẠI */}

                            <button
                                className="
                                    primary-btn
                                    full-btn
                                "
                                id="retryBtn"
                                type="button"
                                onClick={
                                    handleRetry
                                }
                            >


                                <span className="material-symbols-outlined">

                                    refresh

                                </span>


                                Thử lại ngay


                            </button>



                            <div className="error-secondary-actions">


                                {/* HOME */}

                                <button
                                    className="secondary-btn"
                                    id="errorHomeBtn"
                                    type="button"
                                    onClick={goHome}
                                >

                                    Về trang chủ

                                </button>


                            </div>


                        </section>


                    </main>

                )
            }


            {/*
            =====================================================
                     NÚT TEST SUCCESS / ERROR
            =====================================================

            Source JS cũ của bạn có:

            showSuccessBtn
            showErrorBtn

            nhưng HTML bạn gửi KHÔNG có 2 button này.

            Nếu muốn test 2 trạng thái thì tạm mở đoạn dưới:

            <div>

                <button
                    onClick={showSuccess}
                >
                    Test Success
                </button>

                <button
                    onClick={showError}
                >
                    Test Error
                </button>

            </div>

            */}


        </div>

    );

}


export default PaymentResult;