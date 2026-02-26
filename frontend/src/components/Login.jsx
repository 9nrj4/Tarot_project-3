import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

function Login({ defaultTab = "login" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const navigate = useNavigate();

  // Состояния для формы входа
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Состояния для формы регистрации
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirm, setRegisterConfirm] = useState("");

  // Создаем звезды для фона
  useEffect(() => {
    const createStars = () => {
      const starsContainer = document.getElementById("stars");
      if (starsContainer) {
        starsContainer.innerHTML = ""; // Очищаем контейнер перед добавлением звезд

        for (let i = 0; i < 100; i++) {
          const star = document.createElement("div");
          star.className = "star";
          star.style.top = `${Math.random() * 100}%`;
          star.style.left = `${Math.random() * 100}%`;
          star.style.animationDelay = `${Math.random() * 5}s`;
          starsContainer.appendChild(star);
        }
      }
    };

    createStars();
  }, []);

  // Обработчики отправки форм
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log("Login attempt with:", { loginEmail, loginPassword });

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      if (!res.ok) {
        let message = "Ошибка входа. Пожалуйста, попробуйте снова.";
        try {
          const err = await res.json();
          if (err.message) message = err.message;
        } catch (_) {}
        throw new Error(message);
      }

      const user = await res.json();
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/profile");
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "Ошибка входа. Пожалуйста, попробуйте снова.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (registerPassword !== registerConfirm) {
      alert("Пароли не совпадают!");
      return;
    }

    if (registerPassword.length < 6) {
      alert("Пароль должен содержать минимум 6 символов!");
      return;
    }

    console.log("Register attempt with:", {
      registerName,
      registerEmail,
      registerPassword,
      registerConfirm,
    });

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      if (!res.ok) {
        let message = "Ошибка регистрации. Пожалуйста, попробуйте снова.";
        try {
          const err = await res.json();
          if (err.message) message = err.message;
        } catch (_) {}
        throw new Error(message);
      }

      alert("Регистрация успешна! Теперь вы можете войти.");
      setActiveTab("login");
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message || "Ошибка регистрации. Пожалуйста, попробуйте снова.");
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
          <div className="mystical-bg">
            <div className="stars" id="stars"></div>
          </div>

          <div className="auth-container">
            <div className="tarot-card tarot-card-1"></div>
            <div className="tarot-card tarot-card-2"></div>

            <div className="auth-image">
              <div className="crystal-ball"></div>
              <div className="image-content">
                <h2>Добро пожаловать в мир Таро</h2>
                <p>
                  Раскройте тайны карт и получите глубокие личные предсказания с
                  помощью нашей ИИ-платформы
                </p>
              </div>
            </div>

            <div className="auth-forms">
              <div className="tabs">
                <div
                  className={`tab ${activeTab === "login" ? "active" : ""}`}
                  onClick={() => setActiveTab("login")}
                >
                  Вход
                </div>
                <div
                  className={`tab ${activeTab === "register" ? "active" : ""}`}
                  onClick={() => setActiveTab("register")}
                >
                  Регистрация
                </div>
              </div>

              <div
                className={`form-container ${
                  activeTab === "login" ? "active" : ""
                }`}
              >
                <form onSubmit={handleLoginSubmit}>
                  <div className="form-group">
                    <label htmlFor="login-email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="login-email"
                      className="form-input"
                      placeholder="Введите ваш email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="login-password" className="form-label">
                      Пароль
                    </label>
                    <input
                      type="password"
                      id="login-password"
                      className="form-input"
                      placeholder="Введите ваш пароль"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <Link to="/forgot-password" className="forgot-password">
                      Забыли пароль?
                    </Link>
                  </div>

                  <button type="submit" className="submit-btn">
                    Войти
                  </button>
                </form>
              </div>

              <div
                className={`form-container ${
                  activeTab === "register" ? "active" : ""
                }`}
              >
                <form onSubmit={handleRegisterSubmit}>
                  <div className="form-group">
                    <label htmlFor="register-name" className="form-label">
                      Имя
                    </label>
                    <input
                      type="text"
                      id="register-name"
                      className="form-input"
                      placeholder="Введите ваше имя"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="register-email"
                      className="form-input"
                      placeholder="Введите ваш email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-password" className="form-label">
                      Пароль
                    </label>
                    <input
                      type="password"
                      id="register-password"
                      className="form-input"
                      placeholder="Создайте пароль"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-confirm" className="form-label">
                      Подтверждение пароля
                    </label>
                    <input
                      type="password"
                      id="register-confirm"
                      className="form-input"
                      placeholder="Подтвердите пароль"
                      value={registerConfirm}
                      onChange={(e) => setRegisterConfirm(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="submit-btn">
                    Создать аккаунт
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;
