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
import AppSidebar from "./components/AppSidebar";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const pages = {
  home: Homepage,
  transaction: Transaction,
  "transaction-history": TransactionHistory,
  tuition: Tuition,
  "student-info": StudentInfo,
  "tuition-detail": TuitionDetail,
  "payment-confirm": PaymentConfirm,
  "payment-result": PaymentResult,
};

export default function App() {
  const [token, setToken] = useState(() =>
    localStorage.getItem("access_token") || localStorage.getItem("token") || null
  );
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [selectedTuition, setSelectedTuition] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!token) {
      setUser(null);
      return undefined;
    }

    const controller = new AbortController();

    async function verifyLogin() {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
        const data = await response.json();
        setUser(data);
        setAuthError("");
      } catch (error) {
        if (error.name !== "AbortError") {
          setAuthError(error.message || "Không thể xác thực tài khoản.");
          localStorage.removeItem("access_token");
          localStorage.removeItem("token");
          setToken(null);
        }
      }
    }

    verifyLogin();
    return () => controller.abort();
  }, [token]);

  function handleLogin(accessToken) {
    setAuthError("");
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      setToken(accessToken);
    }
  }

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setPage("home");
  }

  if (!token) {
    return (
      <>
        {authError && <p role="alert" style={{ color: "red", textAlign: "center" }}>{authError}</p>}
        <Login onLogin={handleLogin} />
      </>
    );
  }

  if (!user) return <p style={{ padding: 24 }}>Đang xác thực tài khoản...</p>;

  const CurrentPage = pages[page] || Homepage;

  const navigateTo = (nextPage) => {
    if (typeof nextPage === "string" && pages[nextPage]) {
      setPage(nextPage);
    }
  };

  const pageProps = {
    user,
    token,
    selectedTuition,
    onSelectTuition: setSelectedTuition,
    paymentResult,
    onPaymentResult: setPaymentResult,
    onNavigate: navigateTo,
    onLogout: handleLogout,
  };

  // Homepage already contains the original sidebar and dashboard layout.
  // Other pages reuse the same sidebar so users can navigate without returning home.
  if (page === "home") {
    return <div className="app-shell"><Homepage {...pageProps} /></div>;
  }

  return (
    <div className="app app-shell">
      <AppSidebar user={user} page={page} onNavigate={navigateTo} onLogout={handleLogout} />
      <main className="main-content">
        <CurrentPage {...pageProps} />
      </main>
    </div>
  );
}
