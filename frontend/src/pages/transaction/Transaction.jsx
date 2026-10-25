
import { useEffect, useState } from "react";
import api from "../services/api.js";
import "./Transaction.css";

export default function Transaction({ user, onNavigate, onLogout }) {
  const [account, setAccount] = useState(user ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadAccount() {
      try {
        setLoading(true);
        setError("");

        // Lấy thông tin người dùng hiện tại từ backend.
        const response = await api.get("/auth/me");

        if (active) {
          setAccount(response.data);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.detail ||
            "Không thể tải thông tin tài khoản từ backend."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAccount();

    return () => {
      active = false;
    };
  }, []);

  const money = (value) => {
    if (value === null || value === undefined || value === "") {
      return "Chưa có dữ liệu";
    }

    return `${Number(value).toLocaleString("vi-VN")} VND`;
  };

  const fullName =
    account?.fullname ??
    account?.full_name ??
    account?.name ??
    "Chưa có dữ liệu";

  const studentId =
    account?.mssv ??
    account?.student_id ??
    account?.payer_id ??
    "Chưa có dữ liệu";

  const email = account?.email ?? "Chưa có dữ liệu";
  const phone = account?.phone ?? "Chưa có dữ liệu";
  const balance = account?.balance ?? account?.available_balance;

  return (
    <main className="transaction-page">
      <header className="transaction-page__header">
        <p className="transaction-page__eyebrow">IBANKING</p>
        <h1>Thông tin tài khoản</h1>
        <p>Quản lý thông tin cá nhân và số dư tài khoản.</p>
      </header>

      {loading && (
        <div className="transaction-message">
          Đang tải thông tin tài khoản...
        </div>
      )}

      {!loading && error && (
        <div className="transaction-message transaction-message--error">
          {error}
          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="transaction-account-grid">
          <section className="transaction-card transaction-bank-card">
            <div className="transaction-bank-card__top">
              <span className="transaction-bank-card__logo">TDTU</span>
              <span>iBanking</span>
            </div>

            <p className="transaction-bank-card__label">
              CHỦ TÀI KHOẢN
            </p>
            <h2>{fullName}</h2>

            <p className="transaction-bank-card__label">
              MÃ SINH VIÊN / MÃ NGƯỜI DÙNG
            </p>
            <p>{studentId}</p>
          </section>

          <section className="transaction-card transaction-balance-card">
            <div className="transaction-balance-card__heading">
              <div>
                <p className="transaction-section-label">
                  SỐ DƯ KHẢ DỤNG
                </p>
                <h2>
                  {showBalance ? money(balance) : "••••••••"}
                </h2>
              </div>

              <button
                type="button"
                className="transaction-visibility-button"
                onClick={() => setShowBalance((current) => !current)}
                aria-label={showBalance ? "Ẩn số dư" : "Hiện số dư"}
              >
                {showBalance ? "Ẩn số dư" : "Hiện số dư"}
              </button>
            </div>

            <div className="transaction-profile-grid">
              <div className="transaction-profile-item">
                <span>Họ và tên</span>
                <strong>{fullName}</strong>
              </div>

              <div className="transaction-profile-item">
                <span>Mã sinh viên</span>
                <strong>{studentId}</strong>
              </div>

              <div className="transaction-profile-item">
                <span>Số điện thoại</span>
                <strong>{phone}</strong>
              </div>

              <div className="transaction-profile-item">
                <span>Email</span>
                <strong>{email}</strong>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
