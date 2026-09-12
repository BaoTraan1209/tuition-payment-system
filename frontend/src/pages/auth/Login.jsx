import { useState } from "react";
import "./Login.css";

function Login() {

    // ==========================================
    // CHUYỂN LOGIN / REGISTER
    // ==========================================

    const [isRegister, setIsRegister] = useState(false);


    // ==========================================
    // LOGIN DATA
    // ==========================================

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
        remember: false
    });


    // ==========================================
    // REGISTER DATA
    // ==========================================

    const [registerData, setRegisterData] = useState({
        display_name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });


    // ==========================================
    // LOGIN INPUT
    // ==========================================

    const handleLoginChange = (event) => {

        const { name, value, type, checked } = event.target;

        setLoginData({
            ...loginData,

            [name]:
                type === "checkbox"
                    ? checked
                    : value
        });

    };


    // ==========================================
    // REGISTER INPUT
    // ==========================================

    const handleRegisterChange = (event) => {

        const { name, value } = event.target;

        setRegisterData({
            ...registerData,
            [name]: value
        });

    };


    // ==========================================
    // LOGIN
    // ==========================================

    const handleLogin = (event) => {

        event.preventDefault();


        const email =
            loginData.email.trim();

        const password =
            loginData.password;


        console.log("===== LOGIN =====");

        console.log("Email:", email);

        console.log("Password:", password);

        console.log(
            "Remember:",
            loginData.remember
        );


        /*
            SAU NÀY GỌI FASTAPI:

            fetch(
                "http://127.0.0.1:8000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );
        */

    };


    // ==========================================
    // REGISTER
    // ==========================================

    const handleRegister = (event) => {

        event.preventDefault();


        const username =
            registerData.display_name.trim();

        const email =
            registerData.email.trim();

        const phone =
            registerData.phone.trim();

        const password =
            registerData.password;

        const confirmPassword =
            registerData.confirmPassword;


        // ======================================
        // KIỂM TRA PASSWORD
        // ======================================

        if (password !== confirmPassword) {

            alert(
                "Password và Confirm Password không giống nhau!"
            );

            return;

        }


        // ======================================
        // KIỂM TRA PHONE
        // ======================================

        const phoneRegex =
            /^[0-9]{10,11}$/;


        if (!phoneRegex.test(phone)) {

            alert(
                "Số điện thoại phải gồm 10 hoặc 11 chữ số!"
            );

            return;

        }


        // ======================================
        // DATA GỬI BACKEND
        // ======================================

        const data = {

            display_name: username,

            email: email,

            phone: phone,

            password: password

        };


        console.log(
            "===== REGISTER ====="
        );

        console.log(data);


        /*
            SAU NÀY GỌI FASTAPI:

            fetch(
                "http://127.0.0.1:8000/api/auth/register",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body:
                        JSON.stringify(data)

                }
            )

            .then(response =>
                response.json()
            )

            .then(data => {

                console.log(data);

            })

            .catch(error => {

                console.error(error);

            });
        */

    };


    // ==========================================
    // JSX
    // ==========================================

    return (

        <div
            className={
                `container ${
                    isRegister
                        ? "active"
                        : ""
                }`
            }
        >


            {/* =====================================
                LOGIN
            ====================================== */}

            <div className="form-box login">

                <form onSubmit={handleLogin}>

                    <h1>
                        Login
                    </h1>


                    {/* EMAIL */}

                    <div className="input-box">

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            required
                        />

                        <i className="bx bxs-envelope"></i>

                    </div>


                    {/* PASSWORD */}

                    <div className="input-box">

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            required
                        />

                        <i className="bx bxs-lock-alt"></i>

                    </div>


                    {/* REMEMBER + FORGOT */}

                    <div className="form-row">

                        <label className="remember">

                            <input
                                type="checkbox"
                                name="remember"
                                checked={loginData.remember}
                                onChange={handleLoginChange}
                            />

                            Remember me

                        </label>


                        <a
                            href="#"
                            className="forgot-link"
                            onClick={(event) =>
                                event.preventDefault()
                            }
                        >

                            Forgot password?

                        </a>

                    </div>


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="btn"
                    >

                        Login

                    </button>

                </form>

            </div>


            {/* =====================================
                REGISTER
            ====================================== */}

            <div className="form-box register">

                <form onSubmit={handleRegister}>

                    <h1>
                        Registration
                    </h1>


                    {/* USERNAME */}

                    <div className="input-box">

                        <input
                            type="text"
                            name="display_name"
                            placeholder="Username"
                            value={
                                registerData.display_name
                            }
                            onChange={
                                handleRegisterChange
                            }
                            required
                        />

                        <i className="bx bxs-user"></i>

                    </div>


                    {/* EMAIL */}

                    <div className="input-box">

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={
                                registerData.email
                            }
                            onChange={
                                handleRegisterChange
                            }
                            required
                        />

                        <i className="bx bxs-envelope"></i>

                    </div>


                    {/* PHONE */}

                    <div className="input-box">

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={
                                registerData.phone
                            }
                            onChange={
                                handleRegisterChange
                            }
                            required
                        />

                        <i className="bx bxs-phone"></i>

                    </div>


                    {/* PASSWORD */}

                    <div className="input-box">

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={
                                registerData.password
                            }
                            onChange={
                                handleRegisterChange
                            }
                            required
                        />

                        <i className="bx bxs-lock-alt"></i>

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div className="input-box">

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={
                                registerData.confirmPassword
                            }
                            onChange={
                                handleRegisterChange
                            }
                            required
                        />

                        <i className="bx bxs-lock-alt"></i>

                    </div>


                    {/* REGISTER BUTTON */}

                    <button
                        type="submit"
                        className="btn"
                    >

                        Register

                    </button>

                </form>

            </div>


            {/* =====================================
                TOGGLE
            ====================================== */}

            <div className="toggle-box">


                {/* LEFT */}

                <div className="toggle-panel toggle-left">

                    <h1>
                        Hello, Welcome!
                    </h1>

                    <p>
                        Don't have an account?
                    </p>

                    <button
                        type="button"
                        className="btn register-btn"
                        onClick={() =>
                            setIsRegister(true)
                        }
                    >

                        Register

                    </button>

                </div>


                {/* RIGHT */}

                <div className="toggle-panel toggle-right">

                    <h1>
                        Welcome Back!
                    </h1>

                    <p>
                        Already have an account?
                    </p>

                    <button
                        type="button"
                        className="btn login-btn"
                        onClick={() =>
                            setIsRegister(false)
                        }
                    >

                        Login

                    </button>

                </div>

            </div>

        </div>

    );

}


export default Login;