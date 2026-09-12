import { useState } from "react";
import "./ForgotPassword.css";

function ForgotPassword() {

    // ==========================================
    // STATE
    // ==========================================

    const [email, setEmail] = useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = (event) => {

        event.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");


        const emailValue =
            email.trim();


        // ======================================
        // KIỂM TRA EMAIL
        // ======================================

        if (!emailValue) {

            setErrorMessage(
                "Please enter your email address."
            );

            return;

        }


        // ======================================
        // DEMO
        // Sau này gọi FastAPI ở đây
        // ======================================

        setLoading(true);


        console.log(
            "===== FORGOT PASSWORD ====="
        );

        console.log(
            "Email:",
            emailValue
        );


        /*
            SAU NÀY GỌI FASTAPI:

            fetch(
                "http://127.0.0.1:8000/api/auth/forgot-password",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: emailValue
                    })

                }
            )

            .then(response =>
                response.json()
            )

            .then(data => {

                setSuccessMessage(
                    "Reset instructions have been sent to your email."
                );

            })

            .catch(error => {

                setErrorMessage(
                    "Unable to send reset instructions."
                );

            })

            .finally(() => {

                setLoading(false);

            });
        */


        // ======================================
        // DEMO UI
        // ======================================

        setTimeout(() => {

            setSuccessMessage(
                "Reset instructions have been sent to your email."
            );

            setLoading(false);

        }, 500);

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
            SAU NÀY CÓ ROUTER:

            navigate("/login");
        */

    };


    // ==========================================
    // JSX
    // ==========================================

    return (

        <div className="forgot-container">


            {/* =====================================
                LEFT PANEL
            ====================================== */}

            <div className="left-panel">


                <div className="icon-box">

                    <i className="bx bx-lock-open-alt"></i>

                </div>


                <h1>
                    Forgot Password?
                </h1>


                <p>

                    Don't worry. Enter your registered
                    email address and we'll send you
                    password reset instructions.

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

                        Enter your email to receive
                        reset instructions.

                    </p>


                    {/* SUCCESS MESSAGE */}

                    {
                        successMessage && (

                            <div className="alert-success">

                                {successMessage}

                            </div>

                        )
                    }


                    {/* ERROR MESSAGE */}

                    {
                        errorMessage && (

                            <div className="alert-error">

                                {errorMessage}

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
                                autoComplete="email"
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


                        {/* BUTTON */}

                        <button
                            type="submit"
                            className="btn-reset"
                            disabled={loading}
                        >

                            {
                                loading
                                    ? "Sending..."
                                    : "Send Reset Link"
                            }

                        </button>


                    </form>


                    {/* BACK LOGIN */}

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


export default ForgotPassword;