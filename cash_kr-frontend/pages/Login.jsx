import { useState } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────

const MailIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const LockIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

// ─── Field Component ──────────────────────────────────────────────────────────

function Field({ label, forgotLink, icon, type = "text", placeholder, value, onChange, name, autoComplete }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && show ? "text" : type;

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</label>
        {forgotLink && (
          <a href={forgotLink} style={{ fontSize: 12, fontWeight: 600, color: "#0565E6", textDecoration: "none" }}
            onMouseEnter={e => e.target.style.textDecoration = "underline"}
            onMouseLeave={e => e.target.style.textDecoration = "none"}>
            Forgot password?
          </a>
        )}
      </div>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {icon && (
          <span style={{ position: "absolute", left: 13, color: "#9ca3af", display: "flex", pointerEvents: "none" }}>
            {icon}
          </span>
        )}
        <input
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          style={{
            width: "100%",
            padding: "11px 44px 11px 40px",
            border: "1.5px solid #e5e7eb",
            borderRadius: 12,
            fontSize: 14,
            fontFamily: "'DM Sans', sans-serif",
            color: "#111",
            outline: "none",
            background: "#fafbff",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={e => {
            e.target.style.borderColor = "#0565E6";
            e.target.style.boxShadow = "0 0 0 3px rgba(5,101,230,0.10)";
            e.target.style.background = "#fff";
          }}
          onBlur={e => {
            e.target.style.borderColor = "#e5e7eb";
            e.target.style.boxShadow = "none";
            e.target.style.background = "#fafbff";
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(v => !v)}
            style={{
              position: "absolute", right: 12,
              background: "none", border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 700, color: "#0565E6",
              fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.3,
            }}
          >
            {show ? "HIDE" : "SHOW"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }

        .login-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: linear-gradient(135deg, #EFF2FF 0%, #F0F4FF 60%, #f8faff 100%);
          display: flex;
          flex-direction: column;
        }

        .login-nav {
          background: #fff;
          border-bottom: 1px solid #E8EDFF;
          height: 60px;
          display: flex;
          align-items: center;
          padding: 0 32px;
          box-shadow: 0 1px 8px rgba(5,101,230,0.06);
        }
        .login-nav a {
          display: flex;
          align-items: center;
          gap: 4px;
          text-decoration: none;
        }
        .login-nav-chevron {
          color: #0565E6;
          font-size: 20px;
          font-weight: 900;
          letter-spacing: -4px;
        }
        .login-nav-name {
          font-size: 18px;
          font-weight: 800;
          color: #111;
          letter-spacing: -0.3px;
        }

        .login-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 16px;
        }

        .login-card {
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 8px 40px rgba(5,101,230,0.10), 0 1px 4px rgba(0,0,0,0.04);
          padding: 44px 40px;
          width: 100%;
          max-width: 440px;
        }

        .login-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #EFF2FF;
          color: #0565E6;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 14px;
          border: 1px solid #D4E1FF;
        }
        .login-eyebrow-dot {
          width: 7px; height: 7px;
          background: #0565E6;
          border-radius: 50%;
          display: inline-block;
        }

        .login-title {
          font-size: 28px;
          font-weight: 800;
          color: #111;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }
        .login-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 32px;
          line-height: 1.5;
        }

        .login-submit-btn {
          width: 100%;
          padding: 13px;
          background: #0565E6;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 6px;
          transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(5,101,230,0.25);
          letter-spacing: 0.3px;
        }
        .login-submit-btn:hover {
          background: #0450C5;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(5,101,230,0.30);
        }
        .login-submit-btn:active { transform: translateY(0); }

        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
        }
        .login-divider-line { flex: 1; height: 1px; background: #f0f0f0; }
        .login-divider-text { font-size: 12px; color: #c4c9d4; font-weight: 500; }

        .login-google-btn {
          width: 100%;
          padding: 11px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .login-google-btn:hover {
          border-color: #0565E6;
          box-shadow: 0 0 0 3px rgba(5,101,230,0.08);
        }

        .login-footer {
          text-align: center;
          margin-top: 22px;
          font-size: 14px;
          color: #6b7280;
        }
        .login-footer a {
          color: #0565E6;
          font-weight: 700;
          text-decoration: none;
        }
        .login-footer a:hover { text-decoration: underline; }

        .login-trust {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 24px;
          flex-wrap: wrap;
        }
        .login-trust-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: #9ca3af;
          font-weight: 500;
        }
        .login-trust-dot {
          width: 6px; height: 6px;
          background: #0565E6;
          border-radius: 50%;
          flex-shrink: 0;
        }

        @media (max-width: 500px) {
          .login-card { padding: 32px 22px; border-radius: 20px; }
          .login-title { font-size: 24px; }
          .login-body { padding: 32px 16px; }
        }
      `}</style>

      <div className="login-root">

        {/* Body */}
        <div className="login-body">
          <div className="login-card">

            {/* Header */}
            <div className="login-eyebrow">
              <span className="login-eyebrow-dot" />
              Welcome Back
            </div>
            <h1 className="login-title">Login</h1>
            <p className="login-subtitle">Sign in to check your device price and manage pickups.</p>

            {/* Form */}
            <form onSubmit={e => e.preventDefault()}>
              <Field
                label="Email"
                icon={<MailIcon />}
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
                name="email"
                autoComplete="email"
              />
              <Field
                label="Password"
                forgotLink="#"
                icon={<LockIcon />}
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={set("password")}
                name="password"
                autoComplete="current-password"
              />
              <button type="submit" className="login-submit-btn">
                Login <ArrowRightIcon />
              </button>
            </form>

            {/* Divider */}
            <div className="login-divider">
              <div className="login-divider-line" />
              <span className="login-divider-text">OR</span>
              <div className="login-divider-line" />
            </div>


            {/* Footer */}
            <p className="login-footer">
              Don't have an account? <a href="/signup">Sign up</a>
            </p>

            {/* Trust */}
            <div className="login-trust">
              {["SSL Secure", "No Spam", "Free Pickup"].map(t => (
                <div key={t} className="login-trust-item">
                  <div className="login-trust-dot" />{t}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}