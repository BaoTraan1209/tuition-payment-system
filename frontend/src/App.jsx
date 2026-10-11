import { useState } from "react";

import Login from "./pages/auth/Login";

import Homepage from "./pages/homepage/Homepage";

import Transaction from "./pages/transaction/Transaction";
import TransactionHistory from "./pages/transaction/TransactionHistory";

import Tuition from "./pages/tuition/Tuition";
import StudentInfo from "./pages/tuition/StudentInfo";
import TuitionDetail from "./pages/tuition/TuitionDetail";
import PaymentConfirm from "./pages/tuition/PaymentConfirm";
import PaymentResult from "./pages/tuition/PaymentResult";

function App() {

    const [page, setPage] = useState("home");

    // Lưu JWT sau khi đăng nhập
    const [token, setToken] = useState(null);

    function renderPage() {

        switch (page) {

            case "home":
                return <Homepage />;

            case "transaction":
                return <Transaction />;

            case "transaction-history":
                return <TransactionHistory />;

            case "tuition":
                return <Tuition />;

            case "student-info":
                return <StudentInfo />;

            case "tuition-detail":
                return <TuitionDetail />;

            case "payment-confirm":
                return <PaymentConfirm />;

            case "payment-result":
                return <PaymentResult />;

            default:
                return <Homepage />;
        }
    }

    // Chưa đăng nhập thì hiển thị Login
    if (!token) {
        return <Login onLogin={setToken} />;
    }

    return (
        <div>

            {/* MENU TEST FRONTEND */}

            <div
                style={{
                    position: "fixed",
                    top: "10px",
                    right: "10px",
                    zIndex: 99999,
                    background: "white",
                    padding: "10px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px"
                }}
            >

                <button onClick={() => setPage("home")}>
                    Homepage
                </button>

                <button onClick={() => setPage("transaction")}>
                    Transaction
                </button>

                <button onClick={() => setPage("transaction-history")}>
                    Transaction History
                </button>

                <button onClick={() => setPage("tuition")}>
                    Tuition
                </button>

                <button onClick={() => setPage("student-info")}>
                    Student Info
                </button>

                <button onClick={() => setPage("tuition-detail")}>
                    Tuition Detail
                </button>

                <button onClick={() => setPage("payment-confirm")}>
                    Payment Confirm
                </button>

                <button onClick={() => setPage("payment-result")}>
                    Payment Result
                </button>

                {/* Nút đăng xuất */}
                <button onClick={() => {
                    setToken(null);
                    setPage("home");
                }}>
                    Đăng xuất
                </button>

            </div>

            {/* PAGE HIỆN TẠI */}

            {renderPage()}

        </div>
    );
}

export default App;
