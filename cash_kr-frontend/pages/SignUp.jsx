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

const UserIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.09-1.09a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

// ─── Field Component ──────────────────────────────────────────────────────────

function Field({ label, icon, type = "text", placeholder, value, onChange, name, autoComplete }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && show ? "text" : type;

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>
        {label}
      </label>
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

// ─── Password Strength Meter ──────────────────────────────────────────────────

function PasswordStrength({ password }) {
  if (!password) return null;
  const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(password)).length;
  const level = score <= 1 ? "weak" : score <= 3 ? "medium" : "strong";
  const colors = { weak: "#ef4444", medium: "#f59e0b", strong: "#10b981" };
  const labels = { weak: "Weak password", medium: "Fair password", strong: "Strong password" };

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            height: 3, flex: 1, borderRadius: 99,
            background: score > i ? colors[level] : "#f0f0f0",
            transition: "background 0.3s",
          }} />
        ))}
      </div>
      <p style={{ fontSize: 11, fontWeight: 600, color: colors[level], marginTop: 4 }}>
        {labels[level]}
      </p>
    </div>
  );
}

// ─── Signup Page ──────────────────────────────────────────────────────────────

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [agreed, setAgreed] = useState(false);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const passwordsMatch   = form.confirm.length > 0 && form.password === form.confirm;
  const passwordsMismatch = form.confirm.length > 0 && form.password !== form.confirm;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }

        .signup-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: linear-gradient(135deg, #EFF2FF 0%, #F0F4FF 60%, #f8faff 100%);
          display: flex;
          flex-direction: column;
        }

        .signup-nav {
          background: #fff;
          border-bottom: 1px solid #E8EDFF;
          height: 60px;
          display: flex;
          align-items: center;
          padding: 0 32px;
          box-shadow: 0 1px 8px rgba(5,101,230,0.06);
        }
        .signup-nav a {
          display: flex;
          align-items: center;
          gap: 4px;
          text-decoration: none;
        }
        .signup-nav-chevron {
          color: #0565E6;
          font-size: 20px;
          font-weight: 900;
          letter-spacing: -4px;
        }
        .signup-nav-name {
          font-size: 18px;
          font-weight: 800;
          color: #111;
          letter-spacing: -0.3px;
        }

        .signup-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
        }

        .signup-card {
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 8px 40px rgba(5,101,230,0.10), 0 1px 4px rgba(0,0,0,0.04);
          padding: 44px 40px;
          width: 100%;
          max-width: 460px;
        }

        .signup-eyebrow {
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
        .signup-eyebrow-dot {
          width: 7px; height: 7px;
          background: #0565E6;
          border-radius: 50%;
          display: inline-block;
        }

        .signup-title {
          font-size: 28px;
          font-weight: 800;
          color: #111;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }
        .signup-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 28px;
          line-height: 1.5;
        }

        .signup-submit-btn {
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
          margin-top: 4px;
          transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(5,101,230,0.25);
          letter-spacing: 0.3px;
        }
        .signup-submit-btn:hover {
          background: #0450C5;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(5,101,230,0.30);
        }
        .signup-submit-btn:active { transform: translateY(0); }

        .signup-footer {
          text-align: center;
          margin-top: 22px;
          font-size: 14px;
          color: #6b7280;
        }
        .signup-footer a {
          color: #0565E6;
          font-weight: 700;
          text-decoration: none;
        }
        .signup-footer a:hover { text-decoration: underline; }

        .signup-trust {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 24px;
          flex-wrap: wrap;
        }
        .signup-trust-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: #9ca3af;
          font-weight: 500;
        }
        .signup-trust-dot {
          width: 6px; height: 6px;
          background: #0565E6;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .signup-terms-link {
          color: #0565E6;
          font-weight: 600;
          text-decoration: none;
        }
        .signup-terms-link:hover { text-decoration: underline; }

        @media (max-width: 500px) {
          .signup-card { padding: 32px 22px; border-radius: 20px; }
          .signup-title { font-size: 24px; }
          .signup-body { padding: 28px 16px; }
        }
      `}</style>

      <div className="signup-root">

        {/* Body */}
        <div className="signup-body">
          <div className="signup-card">

            {/* Header */}
            <div className="signup-eyebrow">
              <span className="signup-eyebrow-dot" />
              Get Started Free
            </div>
            <h1 className="signup-title">Create Account</h1>
            <p className="signup-subtitle">
              Join 50,000+ users selling their devices at the best price.
            </p>

            {/* Form */}
            <form onSubmit={e => e.preventDefault()}>

              <Field
                label="Full Name"
                icon={<UserIcon />}
                placeholder="Ravi Kumar"
                value={form.name}
                onChange={set("name")}
                name="name"
                autoComplete="name"
              />

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
                label="Phone Number"
                icon={<PhoneIcon />}
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={set("phone")}
                name="phone"
                autoComplete="tel"
              />

              {/* Password with strength meter */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>
                  Password
                </label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <span style={{ position: "absolute", left: 13, color: "#9ca3af", display: "flex", pointerEvents: "none" }}>
                    <LockIcon />
                  </span>
                  <PasswordInput
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={set("password")}
                    autoComplete="new-password"
                  />
                </div>
                <PasswordStrength password={form.password} />
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>
                  Confirm Password
                </label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <span style={{ position: "absolute", left: 13, color: "#9ca3af", display: "flex", pointerEvents: "none" }}>
                    <LockIcon />
                  </span>
                  <PasswordInput
                    placeholder="Repeat your password"
                    value={form.confirm}
                    onChange={set("confirm")}
                    autoComplete="new-password"
                    borderColor={passwordsMismatch ? "#ef4444" : passwordsMatch ? "#10b981" : undefined}
                  />
                </div>
                {passwordsMismatch && (
                  <p style={{ fontSize: 12, color: "#ef4444", marginTop: 5, fontWeight: 500 }}>
                    ✕ Passwords do not match
                  </p>
                )}
                {passwordsMatch && (
                  <p style={{ fontSize: 12, color: "#10b981", marginTop: 5, fontWeight: 500 }}>
                    ✓ Passwords match
                  </p>
                )}
              </div>

              {/* Terms checkbox */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 22 }}>
                <div
                  onClick={() => setAgreed(v => !v)}
                  style={{
                    width: 18, height: 18, flexShrink: 0,
                    border: `2px solid ${agreed ? "#0565E6" : "#d1d5db"}`,
                    borderRadius: 5,
                    background: agreed ? "#0565E6" : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginTop: 1, transition: "all 0.15s", cursor: "pointer",
                  }}
                >
                  {agreed && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>
                  I agree to the{" "}
                  <a href="#" className="signup-terms-link">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="signup-terms-link">Privacy Policy</a>
                </span>
              </label>

              <button type="submit" className="signup-submit-btn">
                Create Account <ArrowRightIcon />
              </button>
            </form>

            {/* Footer */}
            <p className="signup-footer">
              Already have an account? <a href="/login">Login</a>
            </p>

            {/* Trust strip */}
            <div className="signup-trust">
              {["SSL Secure", "No Spam", "Instant Quotes"].map(t => (
                <div key={t} className="signup-trust-item">
                  <div className="signup-trust-dot" />{t}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

// ─── Reusable password input with show/hide ───────────────────────────────────

function PasswordInput({ value, onChange, placeholder, autoComplete, borderColor }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        style={{
          width: "100%",
          padding: "11px 60px 11px 40px",
          border: `1.5px solid ${borderColor || "#e5e7eb"}`,
          borderRadius: 12,
          fontSize: 14,
          fontFamily: "'DM Sans', sans-serif",
          color: "#111",
          outline: "none",
          background: "#fafbff",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onFocus={e => {
          if (!borderColor) e.target.style.borderColor = "#0565E6";
          e.target.style.boxShadow = "0 0 0 3px rgba(5,101,230,0.10)";
          e.target.style.background = "#fff";
        }}
        onBlur={e => {
          if (!borderColor) e.target.style.borderColor = "#e5e7eb";
          e.target.style.boxShadow = "none";
          e.target.style.background = "#fafbff";
        }}
      />
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
    </>
  );
}