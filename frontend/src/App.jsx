import { useEffect, useState } from "react";

import Login from "./pages/auth/Login";
import Homepage from "./pages/homepage/HomePage";
import Transaction from "./pages/transaction/Transaction";
import TransactionHistory from "./pages/transaction/TransactionHistory";
import Tuition from "./pages/tuition/Tuition";
import StudentInfo from "./pages/tuition/StudentInfo";
import TuitionDetail from "./pages/tuition/TuitionDetail";
import PaymentConfirm from "./pages/tuition/PaymentConfirm";
import PaymentResult from "./pages/tuition/PaymentResult";

const API_URL = "http://127.0.0.1:8000";

const pages = {
    home: Homepage,
    transaction: Transaction,
    "transaction-history": TransactionHistory,
    tuition: Tuition,
    "student-info": StudentInfo,
    "tuition-detail": TuitionDetail,
    "payment-confirm": PaymentConfirm,
    "payment-result": PaymentResult
};

export default function App() {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [page, setPage] = useState("home");
    const [authError, setAuthError] = useState("");

    useEffect(() => {
        if (!token) {
            setUser(null);
            return;
        }

        const controller = new AbortController();

        async function verifyLogin() {
            try {
                const response = await fetch(`${API_URL}/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error("Phiên đăng nhập không hợp lệ");
                }

                const data = await response.json();

                setUser(data);
                setPage("home");

            } catch (error) {
                if (error.name !== "AbortError") {
                    setAuthError(error.message);
                    setToken(null);
                }
            }
        }

        verifyLogin();

        return () => controller.abort();
    }, [token]);

    function handleLogin(accessToken) {
        setAuthError("");
        setUser(null);
        setToken(accessToken);
    }

    function handleLogout() {
        setUser(null);
        setToken(null);
        setPage("home");
    }

    // Chưa đăng nhập
    if (!token) {
        return (
            <>
                {authError && (
                    <p
                        role="alert"
                        style={{ color: "red", textAlign: "center" }}
                    >
                        {authError}
                    </p>
                )}

                <Login onLogin={handleLogin} />
            </>
        );
    }

    // Đang xác thực JWT
    if (!user) {
        return <p>Đang xác thực tài khoản...</p>;
    }

    const CurrentPage = pages[page] || Homepage;

    return (
    <CurrentPage
        user={user}
        token={token}
        onNavigate={setPage}
        onLogout={handleLogout}
        />
    );
}
