import { useEffect } from "react";
import "./Tuition.css";


function Tuition() {


    useEffect(() => {


        // =============================================
        // LẤY CÁC ELEMENT
        // =============================================

        const feeCheckboxes =
            document.querySelectorAll(".fee-checkbox");

        const totalAmount =
            document.getElementById("totalAmount");

        const payBtn =
            document.getElementById("payBtn");

        const paymentModal =
            document.getElementById("paymentModal");

        const modalAmount =
            document.getElementById("modalAmount");

        const closeModal =
            document.getElementById("closeModal");

        const cancelPayment =
            document.getElementById("cancelPayment");

        const confirmPayment =
            document.getElementById("confirmPayment");

        const searchTuitionBtn =
            document.getElementById("searchTuitionBtn");

        const schoolYear =
            document.getElementById("schoolYear");

        const semester =
            document.getElementById("semester");


        // =============================================
        // FORMAT TIỀN
        // =============================================

        function formatMoney(amount) {

            return new Intl.NumberFormat(
                "vi-VN"
            ).format(amount);

        }


        // =============================================
        // TÍNH TỔNG HỌC PHÍ
        // =============================================

        function calculateTotal() {

            let total = 0;


            feeCheckboxes.forEach(
                (checkbox) => {

                    if (checkbox.checked) {

                        total += Number(
                            checkbox.dataset.amount
                        );

                    }

                }
            );


            totalAmount.textContent =
                formatMoney(total);


            if (total === 0) {

                payBtn.disabled = true;

            } else {

                payBtn.disabled = false;

            }


            return total;

        }


        // =============================================
        // CHECKBOX THAY ĐỔI
        // =============================================

        feeCheckboxes.forEach(
            (checkbox) => {

                checkbox.addEventListener(
                    "change",
                    calculateTotal
                );

            }
        );


        // =============================================
        // TRA CỨU HỌC PHÍ
        // =============================================

        const handleSearch = () => {

            const selectedYear =
                schoolYear.value;

            const selectedSemester =
                semester.options[
                    semester.selectedIndex
                ].text;


            console.log(
                "Năm học:",
                selectedYear
            );

            console.log(
                "Học kỳ:",
                selectedSemester
            );


            const originalContent =
                searchTuitionBtn.innerHTML;


            searchTuitionBtn.innerHTML =
                `
                <i class="bx bx-loader-alt bx-spin"></i>
                Đang tra cứu...
                `;


            searchTuitionBtn.disabled =
                true;


            setTimeout(
                () => {

                    searchTuitionBtn.innerHTML =
                        originalContent;

                    searchTuitionBtn.disabled =
                        false;

                    alert(
                        `Đã tra cứu học phí ${selectedSemester}, năm học ${selectedYear}`
                    );

                },
                700
            );

        };


        searchTuitionBtn.addEventListener(
            "click",
            handleSearch
        );


        // =============================================
        // MỞ MODAL THANH TOÁN
        // =============================================

        const handlePay = () => {

            const total =
                calculateTotal();


            if (total <= 0) {

                alert(
                    "Vui lòng chọn ít nhất một khoản học phí."
                );

                return;

            }


            modalAmount.textContent =
                `${formatMoney(total)} VND`;


            paymentModal.classList.add(
                "show"
            );

        };


        payBtn.addEventListener(
            "click",
            handlePay
        );


        // =============================================
        // ĐÓNG MODAL
        // =============================================

        function closePaymentModal() {

            paymentModal.classList.remove(
                "show"
            );

        }


        closeModal.addEventListener(
            "click",
            closePaymentModal
        );


        cancelPayment.addEventListener(
            "click",
            closePaymentModal
        );


        // Click bên ngoài modal

        const handleModalOutside = (event) => {

            if (
                event.target ===
                paymentModal
            ) {

                closePaymentModal();

            }

        };


        paymentModal.addEventListener(
            "click",
            handleModalOutside
        );


        // =============================================
        // XÁC NHẬN THANH TOÁN
        // =============================================

        const handleConfirmPayment = () => {

            const total =
                calculateTotal();


            confirmPayment.innerHTML =
                `
                <i class="bx bx-loader-alt bx-spin"></i>
                Đang xử lý...
                `;


            confirmPayment.disabled =
                true;


            setTimeout(
                () => {

                    alert(
                        `Thanh toán ${formatMoney(total)} VND thành công!`
                    );


                    feeCheckboxes.forEach(
                        (checkbox) => {

                            if (
                                checkbox.checked
                            ) {

                                const row =
                                    checkbox.closest(
                                        "tr"
                                    );


                                const status =
                                    row.querySelector(
                                        ".status"
                                    );


                                status.textContent =
                                    "Đã thanh toán";


                                status.classList.remove(
                                    "unpaid"
                                );


                                status.classList.add(
                                    "paid"
                                );


                                checkbox.checked =
                                    false;


                                checkbox.disabled =
                                    true;


                                checkbox
                                    .closest(
                                        ".custom-checkbox"
                                    )
                                    .classList
                                    .add(
                                        "disabled"
                                    );

                            }

                        }
                    );


                    calculateTotal();


                    confirmPayment.textContent =
                        "Xác nhận thanh toán";


                    confirmPayment.disabled =
                        false;


                    closePaymentModal();

                },
                1000
            );

        };


        confirmPayment.addEventListener(
            "click",
            handleConfirmPayment
        );


        // =============================================
        // MOBILE SIDEBAR
        // =============================================

        const sidebar =
            document.getElementById("sidebar");

        const sidebarOverlay =
            document.getElementById(
                "sidebarOverlay"
            );

        const mobileMenuBtn =
            document.getElementById(
                "mobileMenuBtn"
            );


        function openSidebar() {

            sidebar.classList.add(
                "open"
            );

            sidebarOverlay.classList.add(
                "show"
            );

        }


        function closeSidebar() {

            sidebar.classList.remove(
                "open"
            );

            sidebarOverlay.classList.remove(
                "show"
            );

        }


        mobileMenuBtn.addEventListener(
            "click",
            openSidebar
        );


        sidebarOverlay.addEventListener(
            "click",
            closeSidebar
        );


        // =============================================
        // KHỞI TẠO
        // =============================================

        calculateTotal();


        // =============================================
        // CLEANUP REACT
        // =============================================

        return () => {

            feeCheckboxes.forEach(
                (checkbox) => {

                    checkbox.removeEventListener(
                        "change",
                        calculateTotal
                    );

                }
            );


            searchTuitionBtn.removeEventListener(
                "click",
                handleSearch
            );


            payBtn.removeEventListener(
                "click",
                handlePay
            );


            closeModal.removeEventListener(
                "click",
                closePaymentModal
            );


            cancelPayment.removeEventListener(
                "click",
                closePaymentModal
            );


            paymentModal.removeEventListener(
                "click",
                handleModalOutside
            );


            confirmPayment.removeEventListener(
                "click",
                handleConfirmPayment
            );


            mobileMenuBtn.removeEventListener(
                "click",
                openSidebar
            );


            sidebarOverlay.removeEventListener(
                "click",
                closeSidebar
            );

        };


    }, []);


    return (

        <div className="app">


            {/* ======================================
                 SIDEBAR
            ======================================= */}

            <aside
                className="sidebar"
                id="sidebar"
            >


                {/* BRAND */}

                <div className="brand">


                    <div className="brand-logo">

                        <i className="bx bxs-bank"></i>

                    </div>


                    <div>

                        <h2>
                            TDTU
                        </h2>

                        <span>
                            iBanking
                        </span>

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
                        className="menu-item active"
                    >

                        <i className="bx bxs-graduation"></i>

                        <span>
                            Học phí
                        </span>

                    </a>


                    <a
                        href="#"
                        className="menu-item"
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
                    id="logoutBtn"
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
                className="sidebar-overlay"
                id="sidebarOverlay"
            ></div>



            {/* ======================================
                 MAIN CONTENT
            ======================================= */}

            <main className="main-content">


                {/* TOPBAR */}

                <header className="topbar">


                    <button
                        className="mobile-menu-btn"
                        id="mobileMenuBtn"
                        type="button"
                    >

                        <i className="bx bx-menu"></i>

                    </button>


                </header>



                {/* PAGE */}

                <div className="page-content">



                    {/* ==================================
                         BANNER
                    =================================== */}

                    <section className="tuition-banner">


                        <div className="banner-content">


                            <h1>
                                Thanh toán học phí
                            </h1>


                            <h3>
                                Nhanh chóng - An toàn - Tiện lợi
                            </h3>


                            <p>
                                Đồng hành cùng bạn trên hành trình tri thức tại TDTU
                            </p>


                        </div>



                        <div className="banner-image">


                            <div className="book book-one"></div>

                            <div className="book book-two"></div>


                            <div className="graduation-cap">

                                <i className="bx bxs-graduation"></i>

                            </div>



                            <div className="tuition-paper">


                                <strong>
                                    HỌC PHÍ
                                </strong>


                                <span></span>

                                <span></span>

                                <span></span>

                                <span></span>


                            </div>


                        </div>


                    </section>



                    {/* ==================================
                         TUITION FILTER
                    =================================== */}

                    <section className="filter-card">


                        <div className="section-title">


                            <div className="title-icon">

                                <i className="bx bxs-file-doc"></i>

                            </div>


                            <h2>
                                Thông tin học phí
                            </h2>


                        </div>



                        <div className="filter-grid">



                            {/* SCHOOL YEAR */}

                            <div className="form-group">


                                <label>
                                    Năm học
                                </label>


                                <select id="schoolYear">


                                    <option value="2024-2025">

                                        2024 - 2025

                                    </option>


                                    <option value="2025-2026">

                                        2025 - 2026

                                    </option>


                                    <option value="2026-2027">

                                        2026 - 2027

                                    </option>


                                </select>


                            </div>



                            {/* SEMESTER */}

                            <div className="form-group">


                                <label>
                                    Học kỳ
                                </label>


                                <select
                                    id="semester"
                                    defaultValue="2"
                                >


                                    <option value="1">

                                        Học kỳ 1

                                    </option>


                                    <option value="2">

                                        Học kỳ 2

                                    </option>


                                    <option value="3">

                                        Học kỳ hè

                                    </option>


                                </select>


                            </div>



                            {/* SEARCH BUTTON */}

                            <button
                                className="search-btn"
                                id="searchTuitionBtn"
                                type="button"
                            >


                                <i className="bx bx-search"></i>


                                <span>
                                    Tra cứu
                                </span>


                            </button>


                        </div>


                    </section>



                    {/* ==================================
                         TUITION LIST
                    =================================== */}

                    <section className="tuition-card">


                        <h2>
                            Danh sách khoản thu
                        </h2>



                        <div className="table-wrapper">


                            <table>


                                <thead>


                                    <tr>

                                        <th>
                                            STT
                                        </th>

                                        <th>
                                            Nội dung thu
                                        </th>

                                        <th>
                                            Số tiền (VND)
                                        </th>

                                        <th>
                                            Trạng thái
                                        </th>

                                    </tr>


                                </thead>



                                <tbody>



                                    {/* ROW 1 */}

                                    <tr>


                                        <td>
                                            1
                                        </td>


                                        <td className="fee-name">

                                            Học phí học kỳ 2
                                            (2024 - 2025)

                                        </td>


                                        <td>
                                            12,500,000
                                        </td>


                                        <td>

                                            <span className="status unpaid">

                                                Chưa thanh toán

                                            </span>

                                        </td>


                                    </tr>



                                    {/* ROW 2 */}

                                    <tr>


                                        <td>
                                            2
                                        </td>


                                        <td className="fee-name">

                                            Phí cơ sở vật chất

                                        </td>


                                        <td>
                                            1,000,000
                                        </td>


                                        <td>

                                            <span className="status unpaid">

                                                Chưa thanh toán

                                            </span>

                                        </td>


                                    </tr>



                                    {/* ROW 3 */}

                                    <tr>


                                        <td>
                                            3
                                        </td>


                                        <td className="fee-name">

                                            Bảo hiểm y tế (BHYT)

                                        </td>


                                        <td>
                                            680,400
                                        </td>


                                        <td>

                                            <span className="status paid">

                                                Đã thanh toán

                                            </span>

                                        </td>


                                    </tr>



                                    {/* ROW 4 */}

                                    <tr>


                                        <td>
                                            4
                                        </td>


                                        <td className="fee-name">

                                            Phí đoàn - hội

                                        </td>


                                        <td>
                                            200,000
                                        </td>


                                        <td>

                                            <span className="status paid">

                                                Đã thanh toán

                                            </span>

                                        </td>


                                    </tr>


                                </tbody>


                            </table>


                        </div>



                        {/* ==================================
                             PAYMENT SUMMARY
                        =================================== */}

                        <div className="payment-summary">



                            {/* TOTAL */}

                            <div className="total-card">


                                <div className="total-icon">

                                    <i className="bx bx-coin-stack"></i>

                                </div>



                                <div>


                                    <span>
                                        Tổng tiền cần thanh toán
                                    </span>


                                    <h2>


                                        <span id="totalAmount">

                                            13,500,000

                                        </span>


                                        <small>
                                            VND
                                        </small>


                                    </h2>


                                </div>


                            </div>



                            {/* PAY */}

                            <div className="payment-action">


                                <button
                                    className="pay-btn"
                                    id="payBtn"
                                    type="button"
                                >


                                    <span>
                                        Thanh toán ngay
                                    </span>


                                    <i className="bx bx-chevron-right"></i>


                                </button>


                            </div>


                        </div>


                    </section>


                </div>


            </main>



            {/* =============================================
                 PAYMENT MODAL
            ============================================== */}

            <div
                className="modal"
                id="paymentModal"
            >


                <div className="modal-content">


                    <button
                        className="close-modal"
                        id="closeModal"
                        type="button"
                    >


                        <i className="bx bx-x"></i>


                    </button>



                    <div className="modal-icon">


                        <i className="bx bx-wallet"></i>


                    </div>



                    <h2>

                        Xác nhận thanh toán

                    </h2>



                    <p>

                        Bạn đang thanh toán học phí với số tiền:

                    </p>



                    <strong
                        className="modal-amount"
                        id="modalAmount"
                    >

                        13,500,000 VND

                    </strong>



                    <div className="modal-buttons">


                        <button
                            className="cancel-btn"
                            id="cancelPayment"
                            type="button"
                        >

                            Hủy

                        </button>



                        <button
                            className="confirm-btn"
                            id="confirmPayment"
                            type="button"
                        >

                            Xác nhận thanh toán

                        </button>


                    </div>


                </div>


            </div>


        </div>

    );

}


export default Tuition;