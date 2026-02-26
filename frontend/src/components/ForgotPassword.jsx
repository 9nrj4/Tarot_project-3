import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        let message = "Ошибка. Пожалуйста, попробуйте снова.";
        try {
          const err = await res.json();
          if (err.message) message = err.message;
        } catch (_) {}
        throw new Error(message);
      }

      setStatus("Ссылка для восстановления отправлена (демо-режим).");
    } catch (error) {
      setStatus(error.message || "Ошибка. Пожалуйста, попробуйте снова.");
    }
  };

  return (
    <div>
      <header>
        <div className="container">
          <nav>
            <Link to="/" className="logo">
              <i className="fas fa-moon"></i> Mystic<span>Tarot</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="main">
        <section className="auth-section">
          <div className="auth-container">
            <div className="auth-forms">
              <h2 style={{ marginBottom: "1rem" }}>Восстановление пароля</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="forgot-email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="forgot-email"
                    className="form-input"
                    placeholder="Введите ваш email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">
                  Отправить ссылку
                </button>
              </form>
              {status && (
                <p style={{ marginTop: "1rem", color: "#fff" }}>{status}</p>
              )}
              <p style={{ marginTop: "1rem" }}>
                <Link to="/login">Вернуться к входу</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ForgotPassword;




