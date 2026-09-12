import { useState } from "react";
import "./ResetPassword.css";


function ResetPassword() {

    // ==========================================
    // STATE
    // ==========================================

    const [email, setEmail] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    // ==========================================
    // VALIDATE EMAIL
    // ==========================================

    const isValidEmail = (email) => {

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailRegex.test(email);

    };


    // ==========================================
    // SHOW ERROR
    // ==========================================

    const showError = (message) => {

        setErrorMessage(message);

        setSuccessMessage("");

    };


    // ==========================================
    // SHOW SUCCESS
    // ==========================================

    const showSuccess = (message) => {

        setSuccessMessage(message);

        setErrorMessage("");

    };


    // ==========================================
    // HIDE MESSAGE
    // ==========================================

    const hideMessages = () => {

        setErrorMessage("");

        setSuccessMessage("");

    };


    // ==========================================
    // SUBMIT RESET PASSWORD
    // ==========================================

    const handleSubmit = (event) => {

        event.preventDefault();


        const emailValue =
            email.trim();


        // Reset message

        hideMessages();


        // ======================================
        // KIỂM TRA EMAIL
        // ======================================

        if (!isValidEmail(emailValue)) {

            showError(
                "Please enter a valid email address."
            );

            return;

        }


        // ======================================
        // KIỂM TRA PASSWORD
        // ======================================

        if (newPassword.length < 6) {

            showError(
                "Password must be at least 6 characters."
            );

            return;

        }


        // ======================================
        // CONFIRM PASSWORD
        // ======================================

        if (newPassword !== confirmPassword) {

            showError(
                "Confirm Password does not match New Password."
            );

            return;

        }


        // ======================================
        // DATA
        // ======================================

        const resetData = {

            email: emailValue,

            password: newPassword,

            password_confirmation:
                confirmPassword

        };


        console.log(
            "===== RESET PASSWORD ====="
        );

        console.log(resetData);


        // ======================================
        // LOADING
        // ======================================

        setLoading(true);


        // ======================================
        // DEMO
        // ======================================

        setTimeout(() => {

            showSuccess(
                "Password reset successfully."
            );

            setLoading(false);

        }, 800);


        /*
        =========================================
        SAU NÀY GỌI FASTAPI
        =========================================

        fetch(
            "http://127.0.0.1:8000/api/auth/reset-password",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(resetData)

            }
        )

        .then(async response => {

            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Unable to reset password."
                );

            }


            return data;

        })

        .then(data => {

            showSuccess(
                data.message ||
                "Password reset successfully."
            );


            // Sau này khi có Router:
            //
            // setTimeout(() => {
            //     navigate("/login");
            // }, 2000);

        })

        .catch(error => {

            showError(
                error.message
            );

        })

        .finally(() => {

            setLoading(false);

        });

        */

    };


    // ==========================================
    // BACK LOGIN
    // ==========================================

    const handleBackLogin = (event) => {

        event.preventDefault();


        console.log(
            "Back to Login"
        );


        /*
            SAU NÀY KHI CÓ ROUTER:

            navigate("/login");
        */

    };


    // ==========================================
    // JSX
    // ==========================================

    return (

        <div className="reset-container">


            {/* =====================================
                LEFT PANEL
            ====================================== */}

            <div className="left-panel">


                <div className="icon-box">

                    <i className="bx bxs-lock"></i>

                </div>


                <h1>
                    Create New Password
                </h1>


                <p>

                    Enter your new password and confirm it
                    to complete the password reset process.

                </p>


            </div>


            {/* =====================================
                RIGHT PANEL
            ====================================== */}

            <div className="right-panel">


                <div className="form-box">


                    <h2>
                        Reset Password
                    </h2>


                    <p className="subtitle">

                        Please enter your new password below.

                    </p>


                    {/* =================================
                        ERROR
                    ================================== */}

                    {
                        errorMessage && (

                            <div className="alert-error">

                                {errorMessage}

                            </div>

                        )
                    }


                    {/* =================================
                        SUCCESS
                    ================================== */}

                    {
                        successMessage && (

                            <div className="alert-success">

                                {successMessage}

                            </div>

                        )
                    }


                    {/* =================================
                        FORM
                    ================================== */}

                    <form onSubmit={handleSubmit}>


                        {/* EMAIL */}

                        <div className="input-box">


                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value
                                    )
                                }
                                required
                            />


                            <i className="bx bxs-envelope"></i>


                        </div>


                        {/* NEW PASSWORD */}

                        <div className="input-box">


                            <input
                                type="password"
                                name="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(event) =>
                                    setNewPassword(
                                        event.target.value
                                    )
                                }
                                required
                            />


                            <i className="bx bxs-lock-alt"></i>


                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div className="input-box">


                            <input
                                type="password"
                                name="password_confirmation"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value
                                    )
                                }
                                required
                            />


                            <i className="bx bxs-lock-alt"></i>


                        </div>


                        {/* RESET BUTTON */}

                        <button
                            type="submit"
                            className="btn-reset"
                            disabled={loading}
                        >

                            {
                                loading
                                    ? "Resetting..."
                                    : "Reset Password"
                            }

                        </button>


                    </form>


                    {/* =================================
                        BACK LOGIN
                    ================================== */}

                    <div className="back-login">


                        <a
                            href="#"
                            onClick={handleBackLogin}
                        >

                            <i className="bx bx-left-arrow-alt"></i>

                            Back to Login

                        </a>


                    </div>


                </div>


            </div>


        </div>

    );

}


export default ResetPassword;