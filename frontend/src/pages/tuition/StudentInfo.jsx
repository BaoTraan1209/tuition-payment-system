import { useRef, useState } from "react";


function StudentInfo({ onNavigate }) {

    // =====================================================
    // STATE
    // =====================================================

    const [studentId, setStudentId] =
        useState("522H0113");

    const [resultVisible, setResultVisible] =
        useState(true);

    const [notFoundVisible, setNotFoundVisible] =
        useState(false);

    const [continueVisible, setContinueVisible] =
        useState(true);

    const [notFoundStudentId, setNotFoundStudentId] =
        useState("");


    const studentIdInput =
        useRef(null);


    // =====================================================
    // DEMO STUDENT
    // =====================================================

    // Đây chỉ là dữ liệu test frontend.
    // Sau này thay bằng FastAPI.

    const validStudentId =
        "522H0113";


    // =====================================================
    // SEARCH STUDENT
    // =====================================================

    function handleSearchStudent(event) {

        event.preventDefault();


        const searchStudentId =
            studentId
                .trim()
                .toUpperCase();


        // Không nhập mã

        if (searchStudentId === "") {

            alert(
                "Vui lòng nhập mã sinh viên."
            );


            studentIdInput.current?.focus();


            return;

        }


        // =================================================
        // TÌM THẤY
        // =================================================

        if (
            searchStudentId ===
            validStudentId
        ) {

            setResultVisible(true);

            setNotFoundVisible(false);

            setContinueVisible(true);

        }


        // =================================================
        // KHÔNG TÌM THẤY
        // =================================================

        else {

            setResultVisible(false);

            setContinueVisible(false);

            setNotFoundVisible(true);

            setNotFoundStudentId(
                `"${searchStudentId}"`
            );

        }

    }


    // =====================================================
    // KIỂM TRA LẠI
    // =====================================================

    function handleRetry() {

        setNotFoundVisible(false);

        setResultVisible(false);

        setContinueVisible(false);


        setTimeout(() => {

            studentIdInput.current?.focus();

            studentIdInput.current?.select();

        }, 0);

    }


    // =====================================================
    // BACK
    // =====================================================

    function handleBack() {
        if (typeof onNavigate === "function") {
            onNavigate("home");
        } else {
            window.history.back();
        }
    }


    // =====================================================
    // CONTINUE
    // =====================================================

    function handleContinue() {

        // Lưu MSSV để các bước tiếp theo sử dụng.
        sessionStorage.setItem("student_mssv", studentId.trim().toUpperCase());
        if (typeof onNavigate === "function") {
            onNavigate("tuition-detail");
        } else {
            console.warn("Thiếu onNavigate prop để chuyển trang.");
        }

    }


    return (

        <div
            className="
                bg-background
                text-on-background
                min-h-screen
                font-body-md
                text-body-md
                antialiased
                selection:bg-primary-container
                selection:text-on-primary-container
            "
        >

            <div className="flex flex-col min-h-screen">


                {/* =================================================
                                     HEADER
                ================================================== */}

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
                            onClick={handleBack}
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



                {/* =================================================
                                     MAIN
                ================================================== */}

                <main
                    className="
                        flex-1
                        w-full
                        max-w-4xl
                        mx-auto
                        px-container-padding
                        py-section-gap
                        flex
                        flex-col
                        gap-section-gap
                    "
                >


                    {/* =================================================
                                        STEPPER
                    ================================================== */}

                    <section aria-label="Progress">


                        <div
                            className="
                                flex
                                flex-col
                                md:flex-row
                                items-start
                                md:items-center
                                justify-between
                                gap-4
                                relative
                            "
                        >


                            {/* LINE */}

                            <div
                                className="
                                    hidden
                                    md:block
                                    absolute
                                    top-1/2
                                    left-0
                                    w-full
                                    h-[2px]
                                    bg-surface-variant
                                    -z-10
                                    -translate-y-1/2
                                "
                            ></div>



                            {/* STEP 1 */}

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    bg-background
                                    pr-4
                                "
                            >

                                <div
                                    className="
                                        w-8
                                        h-8
                                        rounded-full
                                        bg-primary
                                        text-on-primary
                                        flex
                                        items-center
                                        justify-center
                                        font-label-md
                                        text-label-md
                                        font-bold
                                        shadow-card
                                    "
                                >

                                    1

                                </div>


                                <span
                                    className="
                                        font-label-md
                                        text-label-md
                                        text-primary
                                        font-bold
                                    "
                                >

                                    Thông tin sinh viên

                                </span>

                            </div>



                            {/* STEP 2 */}

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    bg-background
                                    px-4
                                    opacity-60
                                "
                            >

                                <div
                                    className="
                                        w-8
                                        h-8
                                        rounded-full
                                        bg-surface-variant
                                        text-on-surface-variant
                                        flex
                                        items-center
                                        justify-center
                                        font-label-md
                                        text-label-md
                                        font-bold
                                        border
                                        border-outline-variant
                                    "
                                >

                                    2

                                </div>


                                <span
                                    className="
                                        font-label-md
                                        text-label-md
                                        text-on-surface-variant
                                    "
                                >

                                    Chi tiết học phí

                                </span>

                            </div>



                            {/* STEP 3 */}

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    bg-background
                                    pl-4
                                    opacity-60
                                "
                            >

                                <div
                                    className="
                                        w-8
                                        h-8
                                        rounded-full
                                        bg-surface-variant
                                        text-on-surface-variant
                                        flex
                                        items-center
                                        justify-center
                                        font-label-md
                                        text-label-md
                                        font-bold
                                        border
                                        border-outline-variant
                                    "
                                >

                                    3

                                </div>


                                <span
                                    className="
                                        font-label-md
                                        text-label-md
                                        text-on-surface-variant
                                    "
                                >

                                    Xác nhận thanh toán

                                </span>

                            </div>


                        </div>

                    </section>



                    {/* =================================================
                               SEARCH + RESULT
                    ================================================== */}

                    <div className="flex flex-col gap-gutter">


                        {/* SEARCH */}

                        <section
                            className="
                                bg-surface-container-lowest
                                rounded-xl
                                border
                                border-outline-variant
                                shadow-card
                                p-container-padding
                                transition-all
                                focus-within:shadow-card-active
                                focus-within:border-secondary
                            "
                        >


                            <form
                                id="studentForm"
                                className="
                                    flex
                                    flex-col
                                    md:flex-row
                                    items-end
                                    gap-gutter
                                "
                                onSubmit={handleSearchStudent}
                            >


                                <div
                                    className="
                                        flex-1
                                        w-full
                                        flex
                                        flex-col
                                        gap-2
                                    "
                                >


                                    <label
                                        className="
                                            font-label-md
                                            text-label-md
                                            text-on-surface
                                        "
                                        htmlFor="studentId"
                                    >

                                        Mã sinh viên

                                    </label>



                                    <div className="relative w-full">


                                        <span
                                            className="
                                                material-symbols-outlined
                                                absolute
                                                left-3
                                                top-1/2
                                                -translate-y-1/2
                                                text-on-surface-variant
                                            "
                                        >

                                            badge

                                        </span>



                                        <input
                                            ref={studentIdInput}
                                            className="
                                                w-full
                                                h-[50px]
                                                pl-10
                                                pr-4
                                                rounded-lg
                                                border-outline-variant
                                                bg-surface
                                                text-on-surface
                                                font-body-md
                                                text-body-md
                                                focus:border-primary
                                                focus:ring-1
                                                focus:ring-primary
                                                transition-colors
                                                outline-none
                                            "
                                            id="studentId"
                                            name="studentId"
                                            type="text"
                                            value={studentId}
                                            onChange={
                                                event =>
                                                    setStudentId(
                                                        event.target.value
                                                    )
                                            }
                                        />


                                    </div>


                                </div>



                                <button
                                    className="
                                        w-full
                                        md:w-auto
                                        h-[50px]
                                        px-8
                                        bg-primary
                                        hover:bg-surface-tint
                                        text-on-primary
                                        font-body-md
                                        text-body-md
                                        font-bold
                                        rounded-lg
                                        shadow-sm
                                        hover:scale-[0.98]
                                        active:scale-95
                                        transition-all
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                    "
                                    type="submit"
                                >


                                    <span
                                        className="
                                            material-symbols-outlined
                                            filled-icon
                                        "
                                    >

                                        search

                                    </span>


                                    Tìm kiếm


                                </button>


                            </form>

                        </section>



                        {/* =================================================
                                     RESULT FOUND
                        ================================================== */}

                        {
                            resultVisible && (

                                <section
                                    id="resultSection"
                                    className="
                                        bg-surface-container-lowest
                                        rounded-xl
                                        border
                                        border-outline-variant
                                        shadow-card
                                        overflow-hidden
                                    "
                                >


                                    {/* RESULT HEADER */}

                                    <div
                                        className="
                                            border-b
                                            border-surface-variant
                                            bg-surface
                                            px-container-padding
                                            py-4
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >


                                        <div
                                            className="
                                                w-10
                                                h-10
                                                rounded-full
                                                bg-secondary-fixed
                                                text-on-secondary-fixed
                                                flex
                                                items-center
                                                justify-center
                                            "
                                        >

                                            <span
                                                className="
                                                    material-symbols-outlined
                                                    filled-icon
                                                "
                                            >

                                                person

                                            </span>

                                        </div>


                                        <div>

                                            <h2
                                                className="
                                                    font-headline-sm
                                                    text-headline-sm
                                                    text-on-surface
                                                "
                                            >

                                                Kết quả tìm kiếm

                                            </h2>


                                            <p
                                                className="
                                                    font-body-sm
                                                    text-body-sm
                                                    text-on-surface-variant
                                                "
                                            >

                                                Đã tìm thấy thông tin sinh viên

                                            </p>

                                        </div>


                                        <div className="ml-auto">


                                            <span
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-1
                                                    px-2.5
                                                    py-1
                                                    rounded-full
                                                    bg-tertiary-container
                                                    text-on-tertiary-container
                                                    font-label-sm
                                                    text-label-sm
                                                "
                                            >

                                                <span
                                                    className="
                                                        material-symbols-outlined
                                                        small-icon
                                                    "
                                                >

                                                    check_circle

                                                </span>

                                                Hợp lệ

                                            </span>


                                        </div>


                                    </div>



                                    {/* STUDENT DATA */}

                                    <div
                                        className="
                                            p-container-padding
                                            grid
                                            grid-cols-1
                                            md:grid-cols-2
                                            gap-y-6
                                            gap-x-8
                                        "
                                    >


                                        <div className="flex flex-col gap-1">

                                            <span
                                                className="
                                                    font-label-sm
                                                    text-label-sm
                                                    text-on-surface-variant
                                                    uppercase
                                                    tracking-wider
                                                "
                                            >

                                                Họ và tên

                                            </span>


                                            <span
                                                className="
                                                    font-body-lg
                                                    text-body-lg
                                                    text-on-surface
                                                    font-medium
                                                "
                                            >

                                                Nguyễn Văn An

                                            </span>

                                        </div>



                                        <div className="flex flex-col gap-1">

                                            <span
                                                className="
                                                    font-label-sm
                                                    text-label-sm
                                                    text-on-surface-variant
                                                    uppercase
                                                    tracking-wider
                                                "
                                            >

                                                Mã sinh viên

                                            </span>


                                            <span
                                                className="
                                                    font-body-lg
                                                    text-body-lg
                                                    text-on-surface
                                                    font-medium
                                                "
                                            >

                                                522H0113

                                            </span>

                                        </div>



                                        <div className="flex flex-col gap-1">

                                            <span
                                                className="
                                                    font-label-sm
                                                    text-label-sm
                                                    text-on-surface-variant
                                                    uppercase
                                                    tracking-wider
                                                "
                                            >

                                                Ngành

                                            </span>


                                            <span
                                                className="
                                                    font-body-md
                                                    text-body-md
                                                    text-on-surface
                                                "
                                            >

                                                Kỹ thuật phần mềm

                                            </span>

                                        </div>



                                        <div className="flex flex-col gap-1">

                                            <span
                                                className="
                                                    font-label-sm
                                                    text-label-sm
                                                    text-on-surface-variant
                                                    uppercase
                                                    tracking-wider
                                                "
                                            >

                                                Khoa

                                            </span>


                                            <span
                                                className="
                                                    font-body-md
                                                    text-body-md
                                                    text-on-surface
                                                "
                                            >

                                                Khoa Công nghệ thông tin

                                            </span>

                                        </div>



                                        <div className="flex flex-col gap-1">

                                            <span
                                                className="
                                                    font-label-sm
                                                    text-label-sm
                                                    text-on-surface-variant
                                                    uppercase
                                                    tracking-wider
                                                "
                                            >

                                                Lớp

                                            </span>


                                            <span
                                                className="
                                                    font-body-md
                                                    text-body-md
                                                    text-on-surface
                                                "
                                            >

                                                24H50201

                                            </span>

                                        </div>



                                        <div className="flex flex-col gap-1">

                                            <span
                                                className="
                                                    font-label-sm
                                                    text-label-sm
                                                    text-on-surface-variant
                                                    uppercase
                                                    tracking-wider
                                                "
                                            >

                                                Email liên hệ

                                            </span>


                                            <span
                                                className="
                                                    font-body-md
                                                    text-body-md
                                                    text-on-surface
                                                "
                                            >

                                                522h0113@student.utt.edu.vn

                                            </span>

                                        </div>


                                    </div>


                                </section>

                            )
                        }



                        {/* CONTINUE */}

                        {
                            continueVisible && (

                                <div
                                    id="continueArea"
                                    className="
                                        flex
                                        justify-end
                                        pt-4
                                    "
                                >


                                    <button
                                        id="continueBtn"
                                        className="
                                            w-full
                                            md:w-auto
                                            h-[50px]
                                            px-10
                                            bg-primary
                                            hover:bg-surface-tint
                                            text-on-primary
                                            font-body-md
                                            text-body-md
                                            font-bold
                                            rounded-lg
                                            shadow-card
                                            hover:shadow-card-active
                                            hover:scale-[0.98]
                                            active:scale-95
                                            transition-all
                                            flex
                                            items-center
                                            justify-center
                                            gap-2
                                            group
                                        "
                                        type="button"
                                        onClick={
                                            handleContinue
                                        }
                                    >

                                        Tiếp tục


                                        <span
                                            className="
                                                material-symbols-outlined
                                                group-hover:translate-x-1
                                                transition-transform
                                            "
                                        >

                                            arrow_forward

                                        </span>


                                    </button>


                                </div>

                            )
                        }



                        {/* =================================================
                                     NOT FOUND
                        ================================================== */}

                        {
                            notFoundVisible && (

                                <section
                                    id="notFoundSection"
                                    className="
                                        bg-error-container/20
                                        rounded-xl
                                        border
                                        border-error-container
                                        p-container-padding
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                        text-center
                                        py-12
                                        gap-4
                                    "
                                >


                                    <div
                                        className="
                                            w-16
                                            h-16
                                            rounded-full
                                            bg-error-container
                                            text-error
                                            flex
                                            items-center
                                            justify-center
                                            mb-2
                                        "
                                    >

                                        <span
                                            className="
                                                material-symbols-outlined
                                                big-icon
                                            "
                                        >

                                            person_off

                                        </span>

                                    </div>



                                    <h3
                                        className="
                                            font-headline-sm
                                            text-headline-sm
                                            text-on-surface
                                        "
                                    >

                                        Không tìm thấy sinh viên

                                    </h3>



                                    <p
                                        className="
                                            font-body-md
                                            text-body-md
                                            text-on-surface-variant
                                            max-w-md
                                        "
                                    >

                                        Hệ thống không thể tìm thấy dữ liệu cho mã sinh viên{" "}

                                        <strong
                                            id="notFoundStudentId"
                                            className="text-on-surface"
                                        >

                                            {notFoundStudentId}

                                        </strong>

                                        . Vui lòng kiểm tra lại mã và thử lại.

                                    </p>



                                    <button
                                        id="retryBtn"
                                        className="
                                            mt-4
                                            h-[40px]
                                            px-6
                                            bg-surface-container-highest
                                            text-on-surface
                                            font-label-md
                                            text-label-md
                                            font-bold
                                            rounded-lg
                                            hover:bg-outline-variant
                                            transition-colors
                                        "
                                        type="button"
                                        onClick={
                                            handleRetry
                                        }
                                    >

                                        Kiểm tra lại

                                    </button>


                                </section>

                            )
                        }


                    </div>


                </main>


            </div>


        </div>

    );

}


export default StudentInfo;