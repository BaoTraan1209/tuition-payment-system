import { useState } from "react";
import "./Login.css";

const API_URL = "http://127.0.0.1:8000";

export default function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username.trim(),
                    password
                })
            });

            if (!response.ok) {
                throw new Error(
                    response.status === 401
                        ? "Sai tên đăng nhập hoặc mật khẩu"
                        : "Đăng nhập thất bại. Vui lòng thử lại."
                );
            }

            const { access_token } = await response.json();
            onLogin(access_token);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="login-page">
            <div className="login-card">

                <section className="login-brand">
                    <img
                        src="/Logo.png"
                        alt="iBanking"
                        className="login-logo"
                    />
                    <h1>Welcome to iBanking!</h1>
                </section>

                <section className="login-form">
                    <form onSubmit={handleSubmit}>
                        <h2>Login</h2>

                        <div className="login-input">
                            <input
                                type="text"
                                placeholder="Username"
                                aria-label="Username"
                                autoComplete="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="login-input">
                            <input
                                type="password"
                                placeholder="Password"
                                aria-label="Password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <p className="login-error" role="alert">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>
                    </form>
                </section>

            </div>
        </main>
    );
}
