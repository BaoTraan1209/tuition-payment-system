import { useEffect } from "react";


function TuitionDetail({ onNavigate }) {


    useEffect(() => {


        // =====================================================
        // ELEMENT
        // =====================================================

        const backBtn =
            document.getElementById("backBtn");

        const backTopBtn =
            document.getElementById("backTopBtn");

        const continueBtn =
            document.getElementById("continueBtn");

        const totalAmountElement =
            document.getElementById("totalAmount");

        const homeBtn =
            document.getElementById("homeBtn");


        // =====================================================
        // DỮ LIỆU HỌC PHÍ DEMO
        // Sau này thay bằng dữ liệu từ Tuition Service
        // =====================================================

        const tuitionItems = [

            {
                id: 1,

                name: "Học phí tín chỉ HK1 2024-2025",

                description:
                    "Bao gồm 18 tín chỉ đăng ký đợt 1.",

                deadline: "15/10/2024",

                amount: 8500000
            },


            {
                id: 2,

                name: "Phí cơ sở vật chất",

                description:
                    "Phí duy trì và sử dụng thư viện, phòng máy tính.",

                deadline: "15/10/2024",

                amount: 1000000
            },


            {
                id: 3,

                name: "Bảo hiểm y tế",

                description:
                    "Bảo hiểm y tế bắt buộc 12 tháng.",

                deadline: "30/09/2024",

                amount: 500000
            }

        ];


        // =====================================================
        // FORMAT MONEY
        // =====================================================

        function formatMoney(amount) {

            return new Intl.NumberFormat(
                "vi-VN"
            ).format(amount);

        }


        // =====================================================
        // TÍNH TỔNG HỌC PHÍ
        // =====================================================

        function calculateTotal() {

            let total = 0;


            tuitionItems.forEach(item => {

                total += item.amount;

            });


            return total;

        }


        // =====================================================
        // HIỂN THỊ TỔNG
        // =====================================================

        function updateTotal() {

            const total =
                calculateTotal();


            if (totalAmountElement) {

                totalAmountElement.textContent =
                    `${formatMoney(total)} VND`;

            }

        }


        // =====================================================
        // QUAY LẠI
        // =====================================================

        function goBack() {
            if (typeof onNavigate === "function") {
                onNavigate("student-info");
            } else {
                window.history.back();
            }
        }


        if (backBtn) {

            backBtn.addEventListener(
                "click",
                goBack
            );

        }


        if (backTopBtn) {

            backTopBtn.addEventListener(
                "click",
                goBack
            );

        }


        // =====================================================
        // TIẾP TỤC
        // =====================================================

        function handleContinue() {

            const total =
                calculateTotal();


            console.log(
                "Danh sách học phí:",
                tuitionItems
            );


            console.log(
                "Tổng học phí:",
                total
            );


            /*
            =================================================
            SAU NÀY KHI CÓ TRANG BƯỚC 3
            =================================================

            window.location.href =
                "3.html";

            */


            // Tạm thời lưu khoản học phí đầu tiên để bước xác nhận sử dụng.
            // Cần thay ID demo này bằng tuition_id thật từ API khi response backend được xác nhận.
            sessionStorage.setItem("selected_tuition_id", String(tuitionItems[0]?.id ?? ""));
            sessionStorage.setItem("selected_tuition_amount", String(total));
            sessionStorage.setItem("selected_tuition_name", String(tuitionItems[0]?.name ?? "Học phí"));

            if (typeof onNavigate === "function") {
                onNavigate("payment-confirm");
            } else {
                console.warn("Thiếu onNavigate prop để chuyển trang.");
            }

        }


        if (continueBtn) {

            continueBtn.addEventListener(
                "click",
                handleContinue
            );

        }


        // =====================================================
        // VỀ TRANG CHỦ
        // =====================================================

        function handleHome() {

            /*
            window.location.href =
                "../dashboard.html";
            */


            console.log(
                "Quay về trang chủ"
            );

        }


        if (homeBtn) {

            homeBtn.addEventListener(
                "click",
                handleHome
            );

        }


        // =====================================================
        // INITIAL
        // =====================================================

        updateTotal();


        // =====================================================
        // CLEANUP REACT
        // =====================================================

        return () => {

            if (backBtn) {

                backBtn.removeEventListener(
                    "click",
                    goBack
                );

            }


            if (backTopBtn) {

                backTopBtn.removeEventListener(
                    "click",
                    goBack
                );

            }


            if (continueBtn) {

                continueBtn.removeEventListener(
                    "click",
                    handleContinue
                );

            }


            if (homeBtn) {

                homeBtn.removeEventListener(
                    "click",
                    handleHome
                );

            }

        };


    }, [onNavigate]);



    return (

        <div
            className="
                bg-background
                text-on-background
                font-body-md
                min-h-screen
                flex
                flex-col
                md:flex-row
            "
        >


            {/* =====================================================
                                 HEADER
            ===================================================== */}

            <header
                className="
                    bg-surface
                    border-b
                    border-outline-variant
                    shadow-sm
                    fixed
                    top-0
                    w-full
                    z-50
                    flex
                    justify-between
                    items-center
                    h-header-height
                    px-container-padding
                "
            >


                <div className="flex items-center gap-4">


                    <button
                        id="backTopBtn"
                        className="
                            text-on-surface
                            hover:bg-surface-container-highest
                            p-2
                            rounded-full
                            transition-colors
                            active:scale-95
                        "
                        type="button"
                    >

                        <span className="material-symbols-outlined">

                            arrow_back

                        </span>

                    </button>



                    <h1
                        className="
                            font-headline-md
                            text-headline-md
                            text-primary
                            font-bold
                        "
                    >

                        Thanh toán học phí

                    </h1>


                </div>


            </header>



            {/* =====================================================
                                 MAIN
            ===================================================== */}

            <main
                className="
                    flex-1
                    w-full
                    max-w-[800px]
                    mx-auto
                    mt-header-height
                    pt-8
                    pb-32
                    px-4
                    md:px-container-padding
                    flex
                    flex-col
                    gap-section-gap
                "
            >



                {/* =================================================
                                     STEPPER
                ================================================== */}

                <section className="w-full">


                    <div className="flex items-start justify-between relative">


                        {/* STEP 1 */}

                        <div className="flex flex-col items-center gap-2 z-10">


                            <div
                                className="
                                    w-8
                                    h-8
                                    rounded-full
                                    border-2
                                    step-completed
                                    flex
                                    items-center
                                    justify-center
                                    bg-background
                                "
                            >

                                <span
                                    className="
                                        material-symbols-outlined
                                        step-icon
                                    "
                                >

                                    check

                                </span>


                            </div>


                            <span className="text-xs text-secondary">

                                1. Thông tin sinh viên

                            </span>


                        </div>



                        {/* ĐƯỜNG 1 → 2 */}

                        <div
                            className="
                                step-line-completed
                                absolute
                                h-[2px]
                                left-[16.67%]
                                right-[50%]
                                top-4
                            "
                        ></div>



                        {/* STEP 2 */}

                        <div className="flex flex-col items-center gap-2 z-10">


                            <div
                                className="
                                    w-8
                                    h-8
                                    rounded-full
                                    bg-primary
                                    text-white
                                    flex
                                    items-center
                                    justify-center
                                "
                            >

                                2

                            </div>


                            <span
                                className="
                                    text-xs
                                    text-primary
                                    font-bold
                                "
                            >

                                2. Chi tiết học phí

                            </span>


                        </div>



                        {/* ĐƯỜNG 2 → 3 */}

                        <div
                            className="
                                step-line-inactive
                                absolute
                                h-[2px]
                                left-[50%]
                                right-[16.67%]
                                top-4
                            "
                        ></div>



                        {/* STEP 3 */}

                        <div className="flex flex-col items-center gap-2 z-10">


                            <div
                                className="
                                    w-8
                                    h-8
                                    rounded-full
                                    border-2
                                    step-inactive
                                    flex
                                    items-center
                                    justify-center
                                    bg-background
                                "
                            >

                                3

                            </div>


                            <span className="text-xs text-on-surface-variant">

                                3. Xác nhận thanh toán

                            </span>


                        </div>


                    </div>


                </section>



                {/* =================================================
                                     PAGE HEADER
                ================================================== */}

                <header>


                    <h1
                        className="
                            font-headline-lg
                            text-on-surface
                        "
                    >

                        Khoản cần thanh toán

                    </h1>


                </header>



                {/* =================================================
                                    TUITION LIST
                ================================================== */}

                <section
                    className="flex flex-col gap-4"
                    id="tuitionList"
                >



                    {/* =================================================
                                         ITEM 1
                    ================================================== */}

                    <label
                        className="
                            relative
                            cursor-pointer
                            group
                            block
                        "
                    >


                        <div
                            className="
                                tuition-item
                                bg-surface
                                rounded-[14px]
                                border
                                border-outline-variant
                                p-4
                                md:p-gutter
                                shadow-[0_2px_8px_rgba(0,0,0,0.05)]
                                transition-all
                                duration-200
                                group-hover:border-secondary-container
                                flex
                                flex-col
                                md:flex-row
                                gap-4
                                items-start
                                md:items-center
                            "
                        >


                            {/* CONTENT */}

                            <div
                                className="
                                    flex-1
                                    min-w-0
                                    flex
                                    flex-col
                                "
                            >


                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        mb-1
                                    "
                                >


                                    <span
                                        className="
                                            material-symbols-outlined
                                            text-secondary
                                            item-icon
                                        "
                                    >

                                        school

                                    </span>


                                    <h3
                                        className="
                                            font-headline-sm
                                            text-headline-sm
                                            text-on-surface
                                            truncate
                                        "
                                    >

                                        Học phí tín chỉ HK1 2024-2025

                                    </h3>


                                </div>


                                <p
                                    className="
                                        font-body-sm
                                        text-body-sm
                                        text-on-surface-variant
                                    "
                                >

                                    Bao gồm 18 tín chỉ đăng ký đợt 1.

                                </p>


                                <span
                                    className="
                                        inline-block
                                        mt-2
                                        font-label-sm
                                        text-label-sm
                                        text-tertiary
                                        bg-tertiary-fixed-dim
                                        bg-opacity-20
                                        px-2
                                        py-1
                                        rounded
                                        w-fit
                                    "
                                >

                                    Hạn nộp: 15/10/2024

                                </span>


                            </div>



                            {/* MONEY */}

                            <div
                                className="
                                    text-right
                                    w-full
                                    md:w-auto
                                    mt-2
                                    md:mt-0
                                    flex
                                    flex-row
                                    md:flex-col
                                    justify-between
                                    md:justify-center
                                    items-center
                                    md:items-end
                                "
                            >


                                <span
                                    className="
                                        font-label-md
                                        text-label-md
                                        text-on-surface-variant
                                        md:hidden
                                    "
                                >

                                    Số tiền:

                                </span>


                                <span
                                    className="
                                        font-headline-md
                                        text-headline-md
                                        text-primary
                                        font-bold
                                    "
                                >

                                    8,500,000 VND

                                </span>


                            </div>


                        </div>


                    </label>



                    {/* =================================================
                                         ITEM 2
                    ================================================== */}

                    <label
                        className="
                            relative
                            cursor-pointer
                            group
                            block
                        "
                    >


                        <div
                            className="
                                tuition-item
                                bg-surface
                                rounded-[14px]
                                border
                                border-outline-variant
                                p-4
                                md:p-gutter
                                shadow-[0_2px_8px_rgba(0,0,0,0.05)]
                                transition-all
                                duration-200
                                group-hover:border-secondary-container
                                flex
                                flex-col
                                md:flex-row
                                gap-4
                                items-start
                                md:items-center
                            "
                        >


                            <div
                                className="
                                    flex-1
                                    min-w-0
                                    flex
                                    flex-col
                                "
                            >


                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        mb-1
                                    "
                                >


                                    <span
                                        className="
                                            material-symbols-outlined
                                            text-secondary
                                            item-icon
                                        "
                                    >

                                        domain

                                    </span>


                                    <h3
                                        className="
                                            font-headline-sm
                                            text-headline-sm
                                            text-on-surface
                                            truncate
                                        "
                                    >

                                        Phí cơ sở vật chất

                                    </h3>


                                </div>


                                <p
                                    className="
                                        font-body-sm
                                        text-body-sm
                                        text-on-surface-variant
                                    "
                                >

                                    Phí duy trì và sử dụng thư viện, phòng máy tính.

                                </p>


                                <span
                                    className="
                                        inline-block
                                        mt-2
                                        font-label-sm
                                        text-label-sm
                                        text-tertiary
                                        bg-tertiary-fixed-dim
                                        bg-opacity-20
                                        px-2
                                        py-1
                                        rounded
                                        w-fit
                                    "
                                >

                                    Hạn nộp: 15/10/2024

                                </span>


                            </div>



                            <div
                                className="
                                    text-right
                                    w-full
                                    md:w-auto
                                    mt-2
                                    md:mt-0
                                    flex
                                    flex-row
                                    md:flex-col
                                    justify-between
                                    md:justify-center
                                    items-center
                                    md:items-end
                                "
                            >


                                <span
                                    className="
                                        font-label-md
                                        text-label-md
                                        text-on-surface-variant
                                        md:hidden
                                    "
                                >

                                    Số tiền:

                                </span>


                                <span
                                    className="
                                        font-headline-md
                                        text-headline-md
                                        text-primary
                                        font-bold
                                    "
                                >

                                    1,000,000 VND

                                </span>


                            </div>


                        </div>


                    </label>



                    {/* =================================================
                                         ITEM 3
                    ================================================== */}

                    <label
                        className="
                            relative
                            cursor-pointer
                            group
                            block
                        "
                    >


                        <div
                            className="
                                tuition-item
                                bg-surface
                                rounded-[14px]
                                border
                                border-outline-variant
                                p-4
                                md:p-gutter
                                shadow-[0_2px_8px_rgba(0,0,0,0.05)]
                                transition-all
                                duration-200
                                group-hover:border-secondary-container
                                flex
                                flex-col
                                md:flex-row
                                gap-4
                                items-start
                                md:items-center
                            "
                        >


                            <div
                                className="
                                    flex-1
                                    min-w-0
                                    flex
                                    flex-col
                                "
                            >


                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        mb-1
                                    "
                                >


                                    <span
                                        className="
                                            material-symbols-outlined
                                            text-secondary
                                            item-icon
                                        "
                                    >

                                        health_and_safety

                                    </span>


                                    <h3
                                        className="
                                            font-headline-sm
                                            text-headline-sm
                                            text-on-surface
                                            truncate
                                        "
                                    >

                                        Bảo hiểm y tế

                                    </h3>


                                </div>


                                <p
                                    className="
                                        font-body-sm
                                        text-body-sm
                                        text-on-surface-variant
                                    "
                                >

                                    Bảo hiểm y tế bắt buộc 12 tháng.

                                </p>


                                <span
                                    className="
                                        inline-block
                                        mt-2
                                        font-label-sm
                                        text-label-sm
                                        text-tertiary
                                        bg-tertiary-fixed-dim
                                        bg-opacity-20
                                        px-2
                                        py-1
                                        rounded
                                        w-fit
                                    "
                                >

                                    Hạn nộp: 30/09/2024

                                </span>


                            </div>



                            <div
                                className="
                                    text-right
                                    w-full
                                    md:w-auto
                                    mt-2
                                    md:mt-0
                                    flex
                                    flex-row
                                    md:flex-col
                                    justify-between
                                    md:justify-center
                                    items-center
                                    md:items-end
                                "
                            >


                                <span
                                    className="
                                        font-label-md
                                        text-label-md
                                        text-on-surface-variant
                                        md:hidden
                                    "
                                >

                                    Số tiền:

                                </span>


                                <span
                                    className="
                                        font-headline-md
                                        text-headline-md
                                        text-primary
                                        font-bold
                                    "
                                >

                                    500,000 VND

                                </span>


                            </div>


                        </div>


                    </label>


                </section>



                {/* =================================================
                                  EMPTY STATE
                ================================================== */}

                <section
                    id="emptyState"
                    className="
                        hidden
                        flex-col
                        items-center
                        justify-center
                        py-16
                        bg-surface
                        rounded-[14px]
                        border
                        border-outline-variant
                        shadow-[0_2px_8px_rgba(0,0,0,0.05)]
                        text-center
                        px-4
                    "
                >


                    <span
                        className="
                            material-symbols-outlined
                            empty-icon
                            text-secondary
                            mb-4
                        "
                    >

                        task_alt

                    </span>


                    <h3
                        className="
                            font-headline-md
                            text-headline-md
                            text-on-surface
                            mb-2
                        "
                    >

                        Không có khoản nợ học phí

                    </h3>


                    <p
                        className="
                            font-body-md
                            text-body-md
                            text-on-surface-variant
                            max-w-md
                        "
                    >

                        Bạn đã hoàn tất mọi khoản thanh toán cho học kỳ này.
                        Cảm ơn bạn đã sử dụng EduPay.

                    </p>


                    <button
                        id="homeBtn"
                        className="
                            mt-6
                            h-[50px]
                            px-6
                            rounded-[10px]
                            border-2
                            border-primary
                            text-primary
                            font-label-md
                            text-label-md
                            hover:bg-surface-container-highest
                            transition-colors
                            font-bold
                        "
                        type="button"
                    >

                        Về trang chủ

                    </button>


                </section>


            </main>



            {/* =====================================================
                                 FOOTER
            ===================================================== */}

            <footer
                className="
                    fixed
                    bottom-0
                    left-0
                    w-full
                    bg-surface
                    border-t
                    border-outline-variant
                    footer-shadow
                    z-50
                "
            >


                <div
                    className="
                        max-w-[800px]
                        mx-auto
                        px-4
                        md:px-container-padding
                        py-4
                        md:py-6
                    "
                >


                    <div
                        className="
                            flex
                            flex-col
                            md:flex-row
                            justify-between
                            items-center
                            gap-4
                        "
                    >



                        {/* TOTAL */}

                        <div
                            className="
                                w-full
                                md:w-auto
                                flex
                                justify-between
                                md:justify-start
                                items-center
                                gap-4
                            "
                        >


                            <span
                                className="
                                    font-body-lg
                                    text-body-lg
                                    text-on-surface-variant
                                "
                            >

                                Tổng thanh toán:

                            </span>


                            <span
                                id="totalAmount"
                                className="
                                    total-amount
                                    text-primary
                                    font-bold
                                "
                            >

                                8,500,000 VND

                            </span>


                        </div>



                        {/* BUTTON */}

                        <div
                            className="
                                w-full
                                md:w-auto
                                flex
                                gap-4
                            "
                        >


                            <button
                                id="backBtn"
                                className="
                                    flex-1
                                    md:flex-none
                                    h-[50px]
                                    px-6
                                    rounded-[10px]
                                    border-2
                                    border-outline
                                    text-on-surface
                                    font-label-md
                                    text-label-md
                                    hover:bg-surface-container-highest
                                    transition-all
                                    duration-150
                                    font-bold
                                "
                                type="button"
                            >

                                Quay lại

                            </button>



                            <button
                                id="continueBtn"
                                className="
                                    flex-1
                                    md:flex-none
                                    h-[50px]
                                    px-8
                                    rounded-[10px]
                                    bg-primary
                                    text-on-primary
                                    font-label-md
                                    text-label-md
                                    continue-btn
                                    transition-all
                                    duration-150
                                    shadow-sm
                                    font-bold
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                "
                                type="button"
                            >

                                Tiếp tục


                                <span
                                    className="
                                        material-symbols-outlined
                                        continue-icon
                                    "
                                >

                                    arrow_forward

                                </span>


                            </button>


                        </div>


                    </div>


                </div>


            </footer>


        </div>

    );

}


export default TuitionDetail;