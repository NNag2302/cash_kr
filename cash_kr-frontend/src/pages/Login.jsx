import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

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

// ─── Field Component ──────────────────────────────────────────────────────────

function Field({ label, forgotLink, icon, type = "text", placeholder, value, onChange, name, autoComplete }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && show ? "text" : type;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5 ml-1">
        <label className="text-xs sm:text-sm font-bold text-gray-700">{label}</label>
        {forgotLink && (
          <a href={forgotLink} className="text-[11px] sm:text-xs font-bold text-primary hover:underline no-underline">
            Forgot password?
          </a>
        )}
      </div>
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-4 text-gray-400 flex pointer-events-none">
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
          className="w-full pl-11 pr-11 py-3 border-1.5 border-gray-200 rounded-xl text-sm font-sans text-text-primary outline-none bg-gray-50 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 bg-transparent border-none cursor-pointer text-[10px] font-black text-primary hover:text-primary-dark tracking-wider outline-none"
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      const params = new URLSearchParams(location.search);
      const returnUrl = params.get("returnUrl") || "/dashboard";
      navigate(returnUrl);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-primary-light via-white to-primary-light flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-[440px] bg-white rounded-[32px] shadow-2xl shadow-primary/10 border border-gray-100 p-8 sm:p-12 animate-in fade-in zoom-in-95 duration-300">
        <div className="inline-flex items-center gap-2 bg-primary-light text-primary text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-6 border border-border-light">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          Welcome Back
        </div>
        
        <h1 className="text-3xl font-black text-text-primary tracking-tight mb-2">Login</h1>
        <p className="text-sm text-text-muted mb-8">Sign in to check your device price and manage pickups.</p>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-xs font-bold mb-6 animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary/30 hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed group"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"} 
            {!loading && <ArrowRightIcon />}
          </button>
        </form>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">OR</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <p className="text-center text-sm text-text-muted font-medium">
          Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
        </p>

        <div className="flex justify-center gap-5 mt-10">
          {["SSL Secure", "No Spam", "Free Pickup"].map(t => (
            <div key={t} className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
              <div className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}