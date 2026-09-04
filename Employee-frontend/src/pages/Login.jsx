
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const data = response.data;

      // Store JWT
      localStorage.setItem("token", data.token);

      // Store user information
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
        })
      );

      // Redirect based on role
      if (data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to login. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Helvetica,
            Arial,
            sans-serif;
        }

        /* =====================================================
           PAGE
        ===================================================== */

        .login-page {
          min-height: 100vh;
          width: 100%;
          position: relative;
          overflow: hidden;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 30px;

          background:
            linear-gradient(
              135deg,
              #07152f 0%,
              #0b1f42 45%,
              #111d48 100%
            );
        }

        /* =====================================================
           BACKGROUND LIGHTS
        ===================================================== */

        .background-light-one {
          position: absolute;
          width: 500px;
          height: 500px;

          top: -250px;
          left: -180px;

          border-radius: 50%;

          background: rgba(37, 99, 235, 0.25);

          filter: blur(50px);
        }

        .background-light-two {
          position: absolute;
          width: 450px;
          height: 450px;

          right: -200px;
          bottom: -200px;

          border-radius: 50%;

          background: rgba(124, 58, 237, 0.28);

          filter: blur(60px);
        }

        /* =====================================================
           OFFICE GRID
        ===================================================== */

        .office-grid {
          position: absolute;
          inset: 0;

          opacity: 0.12;

          background-image:
            linear-gradient(
              rgba(255,255,255,0.12) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.12) 1px,
              transparent 1px
            );

          background-size: 70px 70px;
        }

        /* =====================================================
           STICKER AREA
        ===================================================== */

        .sticker {
          position: absolute;

          display: flex;
          align-items: center;
          justify-content: center;

          text-align: center;

          padding: 20px;

          background: #ffffff;

          color: #172554;

          border: 3px solid #dbeafe;

          box-shadow:
            0 12px 30px rgba(0,0,0,0.25);

          font-weight: 900;

          z-index: 1;
        }

        .sticker::after {
          content: "";

          position: absolute;

          inset: 5px;

          border: 2px dashed #93c5fd;

          pointer-events: none;
        }

        /* =====================================================
           LEFT TOP STICKER
        ===================================================== */

        .sticker-team {
          width: 190px;
          height: 150px;

          left: 5%;
          top: 13%;

          transform: rotate(-8deg);

          border-radius: 10px;
        }

        .sticker-team span {
          font-size: 20px;
          line-height: 1.25;
        }

        .sticker-team strong {
          color: #2563eb;
        }

        /* =====================================================
           RIGHT TOP STICKER
        ===================================================== */

        .sticker-future {
          width: 175px;
          height: 155px;

          right: 5%;
          top: 14%;

          transform: rotate(7deg);

          border-radius: 12px;
        }

        .sticker-future span {
          font-size: 19px;
          line-height: 1.3;
        }

        .sticker-future strong {
          color: #2563eb;
        }

        /* =====================================================
           LEFT BOTTOM STICKER
        ===================================================== */

        .sticker-focus {
          width: 155px;
          height: 155px;

          left: 8%;
          bottom: 13%;

          transform: rotate(6deg);

          border-radius: 50%;
        }

        .sticker-focus span {
          font-size: 18px;
          line-height: 1.3;
        }

        .sticker-focus strong {
          display: block;
          color: #4f46e5;
          font-size: 22px;
        }

        /* =====================================================
           RIGHT BOTTOM STICKER
        ===================================================== */

        .sticker-grow {
          width: 175px;
          height: 145px;

          right: 7%;
          bottom: 14%;

          transform: rotate(-7deg);

          border-radius: 10px;
        }

        .sticker-grow span {
          font-size: 18px;
          line-height: 1.3;
        }

        .sticker-grow strong {
          color: #4f46e5;
        }

        /* =====================================================
           DASHED ARROWS
        ===================================================== */

        .arrow {
          position: absolute;

          width: 120px;
          height: 60px;

          border-top: 3px dashed rgba(255,255,255,0.55);

          border-radius: 50%;

          z-index: 1;
        }

        .arrow-one {
          left: 18%;
          top: 9%;

          transform: rotate(15deg);
        }

        .arrow-two {
          right: 18%;
          bottom: 9%;

          transform: rotate(-20deg);
        }

        /* =====================================================
           MAIN CARD
        ===================================================== */

        .login-card {
          position: relative;

          z-index: 10;

          width: 100%;
          max-width: 450px;

          padding: 42px;

          border-radius: 24px;

          background: rgba(255,255,255,0.97);

          border: 1px solid rgba(255,255,255,0.8);

          box-shadow:
            0 30px 80px rgba(0,0,0,0.35),
            0 10px 30px rgba(0,0,0,0.15);

          backdrop-filter: blur(20px);
        }

        /* =====================================================
           TOP GRADIENT
        ===================================================== */

        .login-card::before {
          content: "";

          position: absolute;

          top: 0;
          left: 0;
          right: 0;

          height: 5px;

          border-radius:
            24px 24px 0 0;

          background:
            linear-gradient(
              90deg,
              #2563eb,
              #4f46e5,
              #7c3aed
            );
        }

        /* =====================================================
           LOGO
        ===================================================== */

        .logo-container {
          display: flex;
          justify-content: center;

          margin-bottom: 22px;
        }

        .logo {
          width: 72px;
          height: 72px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 22px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5,
              #7c3aed
            );

          color: white;

          font-size: 25px;

          font-weight: 900;

          letter-spacing: -1px;

          box-shadow:
            0 12px 25px rgba(79,70,229,0.35);
        }

        /* =====================================================
           HEADER
        ===================================================== */

        .login-header {
          text-align: center;

          margin-bottom: 30px;
        }

        .login-header h1 {
          margin: 0;

          color: #172554;

          font-size: 28px;

          font-weight: 850;

          letter-spacing: -0.7px;
        }

        .login-subtitle {
          margin: 9px 0 0;

          color: #64748b;

          font-size: 15px;
        }

        /* =====================================================
           FORM
        ===================================================== */

        .form-group {
          margin-bottom: 18px;
        }

        .input-wrapper {
          position: relative;
        }

        .form-group input {
          width: 100%;

          height: 54px;

          padding:
            0 16px;

          border:
            1.5px solid #dbe3ef;

          border-radius: 12px;

          outline: none;

          background: #f8fafc;

          color: #172554;

          font-size: 15px;

          transition:
            0.2s ease;
        }

        .form-group input::placeholder {
          color: #94a3b8;
        }

        .form-group input:hover {
          background: #ffffff;

          border-color: #c7d2fe;
        }

        .form-group input:focus {
          background: #ffffff;

          border-color: #6366f1;

          box-shadow:
            0 0 0 4px
            rgba(99,102,241,0.10);
        }

        /* =====================================================
           PASSWORD
        ===================================================== */

        .password-input {
          padding-right: 75px !important;
        }

        .password-toggle {
          position: absolute;

          right: 10px;

          top: 50%;

          transform: translateY(-50%);

          border: none;

          background: transparent;

          color: #4f46e5;

          font-size: 13px;

          font-weight: 800;

          cursor: pointer;

          padding: 7px 9px;

          border-radius: 7px;
        }

        .password-toggle:hover {
          background: #eef2ff;
        }

        /* =====================================================
           ERROR
        ===================================================== */

        .error-message {
          display: flex;

          align-items: center;

          gap: 10px;

          margin:
            5px 0 18px;

          padding:
            13px 15px;

          border-radius: 11px;

          border:
            1px solid #fecaca;

          background: #fff1f2;

          color: #be123c;

          font-size: 14px;

          font-weight: 600;

          line-height: 1.4;
        }

        .error-icon {
          width: 23px;
          height: 23px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #ffe4e6;

          color: #e11d48;

          font-size: 13px;

          font-weight: 900;
        }

        /* =====================================================
           LOGIN BUTTON
        ===================================================== */

        .login-button {
          width: 100%;

          height: 54px;

          margin-top: 4px;

          border: none;

          border-radius: 12px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

          font-size: 15px;

          font-weight: 800;

          cursor: pointer;

          box-shadow:
            0 10px 25px
            rgba(79,70,229,0.28);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);

          box-shadow:
            0 15px 30px
            rgba(79,70,229,0.35);
        }

        .login-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-button:disabled {
          cursor: not-allowed;

          opacity: 0.7;

          box-shadow: none;
        }

        /* =====================================================
           BUTTON LOADING
        ===================================================== */

        .button-content {
          display: flex;

          align-items: center;

          justify-content: center;

          gap: 10px;
        }

        .spinner {
          width: 17px;
          height: 17px;

          border:
            2px solid
            rgba(255,255,255,0.4);

          border-top-color: white;

          border-radius: 50%;

          animation:
            loginSpin 0.7s linear infinite;
        }

        @keyframes loginSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =====================================================
           FOOTER
        ===================================================== */

        .login-footer {
          text-align: center;

          margin-top: 24px;

          padding-top: 19px;

          border-top:
            1px solid #eef2f7;

          color: #94a3b8;

          font-size: 12px;
        }

        .login-footer strong {
          color: #64748b;
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 900px) {

          .sticker-team,
          .sticker-future,
          .sticker-focus,
          .sticker-grow,
          .arrow {
            opacity: 0.35;
          }

        }

        @media (max-width: 600px) {

          .login-page {
            padding: 18px;
          }

          .login-card {
            padding: 32px 22px;

            border-radius: 20px;
          }

          .login-card::before {
            border-radius:
              20px 20px 0 0;
          }

          .login-header h1 {
            font-size: 24px;
          }

          .logo {
            width: 62px;
            height: 62px;

            border-radius: 18px;

            font-size: 22px;
          }

          .sticker-team {
            left: -55px;
            top: 7%;
          }

          .sticker-future {
            right: -65px;
            top: 8%;
          }

          .sticker-focus {
            left: -50px;
            bottom: 7%;
          }

          .sticker-grow {
            right: -60px;
            bottom: 7%;
          }

        }

      `}</style>

      <div className="login-page">

        {/* BACKGROUND */}
        <div className="office-grid" />

        <div className="background-light-one" />
        <div className="background-light-two" />

        {/* STICKERS */}

        <div className="sticker sticker-team">
          <span>
            TEAMWORK
            <br />
            MAKES
            <br />
            THE
            <br />
            <strong>DREAM</strong>
          </span>
        </div>

        <div className="sticker sticker-future">
          <span>
            STRONG
            <br />
            TEAM
            <br />
            <strong>BRIGHT</strong>
            <br />
            FUTURE
          </span>
        </div>

        <div className="sticker sticker-focus">
          <span>
            🎯
            <br />
            FOCUS
            <strong>
              PLAN
            </strong>
            ACHIEVE
          </span>
        </div>

        <div className="sticker sticker-grow">
          <span>
            GROW
            <br />
            <strong>
              TOGETHER
            </strong>
            <br />
            SUCCEED
            <br />
            TOGETHER
          </span>
        </div>

        {/* DECORATIVE ARROWS */}

        <div className="arrow arrow-one" />
        <div className="arrow arrow-two" />

        {/* LOGIN CARD */}

        <div className="login-card">

          {/* LOGO */}

          <div className="logo-container">
            <div className="logo">
              EM
            </div>
          </div>

          {/* HEADER */}

          <div className="login-header">

            <h1>
              Employee Management
            </h1>

            <p className="login-subtitle">
              Sign in to your account
            </p>

          </div>

          {/* FORM */}

          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div className="form-group">

              <div className="input-wrapper">

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Email"
                  autoComplete="email"
                  required
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="form-group">

              <div className="input-wrapper">

                <input
                  className="password-input"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div
                className="error-message"
                role="alert"
              >

                <span className="error-icon">
                  !
                </span>

                <span>
                  {error}
                </span>

              </div>
            )}

            {/* SIGN IN */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              <span className="button-content">

                {loading && (
                  <span className="spinner" />
                )}

                {loading
                  ? "Signing in..."
                  : "Sign In"}

              </span>

            </button>

          </form>

          {/* FOOTER */}

          <div className="login-footer">
            Secure access to your{" "}
            <strong>
              Employee Workspace
            </strong>
          </div>

        </div>

      </div>
    </>
  );
}

export default Login;

