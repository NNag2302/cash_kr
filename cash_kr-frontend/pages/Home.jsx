import { useState } from "react";

// ─── Icons ───────────────────────────────────────────────────────────────────

const MobileIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);
const TabletIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);
const LaptopIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
  </svg>
);
const MacIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="14" rx="2" />
    <path d="M8 20h8M12 18v2" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const TagIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);
const ZapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const TruckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const StarIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const ChevronIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const DEVICE_CATEGORIES = [
  { icon: <MobileIcon />, label: "Mobile", sub: "iPhone, Android", desc: "Sell old mobile phone for instant cash" },
  { icon: <TabletIcon />, label: "Tablet", sub: "iPad, Tab", desc: "Sell old tablet for instant cash" },
  { icon: <LaptopIcon />, label: "Laptop", sub: "Instant Quote", desc: "Sell old laptop for instant cash" },
  { icon: <MacIcon />, label: "Mac", sub: "MacBook, iMac", desc: "Sell old MacBook or iMac for instant cash" },
];

const STATS = [
  { value: "4.8", label: "Verified Rating" },
  { value: "100Cr+", label: "Cash Paid" },
  { value: "50K+", label: "Happy Customers" },
];

const HOW_STEPS = [
  {
    num: "01",
    title: "Check Your Instant Device Price",
    desc: "Select your device and answer a few questions about its condition to receive an accurate price estimate in seconds.",
  },
  {
    num: "02",
    title: "Schedule Free Doorstep Pickup",
    desc: "Choose a convenient date and time for our team to collect your device safely from your doorstep.",
  },
  {
    num: "03",
    title: "Get Instant Payment After Verification",
    desc: "Receive immediate payment via UPI, bank transfer, or cash once your device is verified.",
  },
];

const TRUST_FEATURES = [
  { icon: <ShieldIcon />, title: "Verified Pickup Professionals", desc: "Every pickup is handled by background-checked, trained professionals you can trust." },
  { icon: <TagIcon />, title: "Transparent Device Pricing", desc: "Our smart algorithm gives you a fair, data-driven price with no hidden deductions." },
  { icon: <ZapIcon />, title: "Instant Payment After Verification", desc: "Get paid immediately via UPI, bank transfer, or cash right after device inspection." },
  { icon: <TruckIcon />, title: "Free Doorstep Pickup Across Cities", desc: "We come to you — no need to visit a store. Free pickup from 2,000+ cities in India." },
];

const CALCULATOR_ITEMS = [
  { icon: <MobileIcon />, label: "Phone Calculator", desc: "iPhones, Samsung, Google, Xiaomi, OnePlus & more" },
  { icon: <LaptopIcon />, label: "Laptop Calculator", desc: "Dell, HP, Samsung, Lenovo, Acer, Microsoft & more" },
  { icon: <MacIcon />, label: "Mac Calculator", desc: "iPad, Mac mini, MacBook Pro, MacBook Air, iMac & more" },
  { icon: <TabletIcon />, label: "Tablet Calculator", desc: "Samsung Tab, iPad, OnePlus Pad, Lenovo Tab & more" },
];

const REVIEWS = [
  { name: "Nitin Gowda", text: "Flawless experience. Instant credit. No haggling whatsoever — exactly what I expected.", stars: 5 },
  { name: "Vidyankit Official", text: "Sold my Realme GT Neo 2. Very smooth process, no negotiation unlike other platforms. Highly recommend!", stars: 5 },
  { name: "Jatin Mishra", text: "Sold my phone, nice company, smooth process. Pickup was on time and payment was instant.", stars: 5 },
  { name: "Disha Doshi", text: "Value for money and service is good. Got the exact price that was shown online.", stars: 5 },
  { name: "pawan mishra", text: "Excellent services! The pickup was too good and the security and checking purposes were professional.", stars: 5 },
  { name: "Mayank Doshi", text: "Very prompt service and got a very good price. Absolutely hassle-free. Highly recommended!", stars: 5 },
];

const FAQS = [
  { q: "Is YourBrand legit?", a: "Yes, YourBrand is a legitimate and trusted platform for selling old electronics online in India with secure pickup and instant payment." },
  { q: "Where can I sell my old device online?", a: "You can sell your old device online through YourBrand, which offers free doorstep pickup and instant cash payment across 2,000+ cities in India." },
  { q: "What is the best place to sell old devices easily?", a: "YourBrand is one of the easiest and safest places to sell old devices online without visiting any shop." },
  { q: "How do I get the highest price for my old gadget?", a: "Select the correct device condition, check the instant online quote, and book a free doorstep pickup on YourBrand for the best value." },
  { q: "Can I sell broken or used devices?", a: "Yes, YourBrand accepts old, used, and broken devices based on their condition and current market value." },
  { q: "Is it safe to sell my old gadget online?", a: "Yes, it is safe. YourBrand ensures verified pickups, transparent pricing, and secure transactions every time." },
];

const GUARANTEES = [
  "Instant Cash at Free Pickup",
  "Transparent Pricing with No Hidden Cuts",
  "Verified & Professional Pickup Partners",
  "Free Doorstep Pickup Anywhere",
  "Factory-Grade Secure Data Wipe",
  "Genuine Official Invoice Provided",
];

const CITIES = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad", "Noida", "Thane", "Navi Mumbai", "Goa", "Coimbatore", "Ghaziabad", "Howrah"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ tag, title, subtitle }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "48px" }}>
      {tag && (
        <span style={{ display: "inline-block", background: "#f0fdf4", color: "#10b981", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", padding: "4px 14px", borderRadius: "20px", marginBottom: "12px" }}>
          {tag}
        </span>
      )}
      <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, color: "#111", lineHeight: 1.25, margin: "0 0 14px" }}>{title}</h2>
      {subtitle && <p style={{ fontSize: "15px", color: "#6b7280", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #f0f0f0" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "16px" }}
      >
        <span style={{ fontSize: "15px", fontWeight: 600, color: "#111", fontFamily: "inherit" }}>{q}</span>
        <span style={{ flexShrink: 0, color: "#10b981" }}><ChevronIcon open={open} /></span>
      </button>
      {open && (
        <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.7, paddingBottom: "18px", margin: 0 }}>{a}</p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { font-family: 'DM Sans', sans-serif; color: #111; background: #fff; overflow-x: hidden; width: 100%; }
        .hp-page { font-family: 'DM Sans', sans-serif; overflow-x: hidden; width: 100%; }
        .hp-container { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
        .hp-section { padding: 72px 0; }
        .hp-section-alt { background: #f9fafb; }

        /* ── Referral Banner ── */
        .referral-bar { background: #f0fdf4; border-bottom: 1px solid #d1fae5; padding: 10px 32px; text-align: center; font-size: 13px; color: #065f46; overflow-x: hidden; width: 100%; }
        .referral-bar a { color: #10b981; font-weight: 700; text-decoration: none; margin-left: 6px; }
        .referral-bar a:hover { text-decoration: underline; }

        /* ── Hero ── */
        .hero { background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f8faff 100%); padding: 64px 32px 72px; overflow-x: hidden; width: 100%; }
        .hero-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .hero-tag { display: inline-flex; align-items: center; gap: 6px; background: #fff; border: 1px solid #d1fae5; border-radius: 20px; padding: 6px 14px; font-size: 12px; font-weight: 600; color: #10b981; letter-spacing: 0.5px; margin-bottom: 20px; }
        .hero-tag::before { content: ""; width: 8px; height: 8px; background: #10b981; border-radius: 50%; }
        .hero-h1 { font-size: clamp(28px, 4vw, 48px); font-weight: 800; color: #111; line-height: 1.15; letter-spacing: -0.5px; margin-bottom: 18px; }
        .hero-h1 span { color: #10b981; }
        .hero-sub { font-size: 16px; color: #6b7280; line-height: 1.65; margin-bottom: 32px; max-width: 480px; }
        .hero-cats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 36px; }
        .hero-cat-card { display: flex; align-items: center; gap: 12px; background: #fff; border: 1.5px solid #e5e7eb; border-radius: 12px; padding: 14px 16px; cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s; text-decoration: none; color: inherit; }
        .hero-cat-card:hover { border-color: #10b981; box-shadow: 0 4px 16px rgba(16,185,129,0.1); }
        .hero-cat-icon { width: 44px; height: 44px; background: #f0fdf4; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #10b981; flex-shrink: 0; }
        .hero-cat-label { font-size: 14px; font-weight: 700; color: #111; }
        .hero-cat-sub { font-size: 12px; color: #9ca3af; margin-top: 2px; }
        .hero-stats { display: flex; gap: 28px; flex-wrap: wrap; }
        .hero-stat {}
        .hero-stat-val { font-size: 22px; font-weight: 800; color: #10b981; }
        .hero-stat-label { font-size: 12px; color: #9ca3af; font-weight: 500; }

        /* Hero Right — visual placeholder grid */
        .hero-right { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: auto auto; gap: 12px; }
        .hero-card { background: #fff; border-radius: 16px; padding: 20px; border: 1px solid #f0f0f0; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
        .hero-card-green { background: #10b981; color: #fff; }
        .hero-card-dark { background: #111827; color: #fff; grid-column: 1 / -1; }
        .hero-card-label { font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; opacity: 0.7; margin-bottom: 6px; }
        .hero-card-val { font-size: 28px; font-weight: 800; }
        .hero-card-sub { font-size: 13px; opacity: 0.75; margin-top: 4px; }
        .hero-card-dark-inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
        .hero-card-dark-stat { text-align: center; }
        .hero-card-dark-stat-val { font-size: 20px; font-weight: 800; color: #10b981; }
        .hero-card-dark-stat-label { font-size: 11px; color: #9ca3af; }

        /* ── How It Works ── */
        .how-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
        .how-step { text-align: center; padding: 32px 24px; background: #fff; border-radius: 16px; border: 1px solid #f0f0f0; box-shadow: 0 2px 12px rgba(0,0,0,0.04); position: relative; }
        .how-step-num { width: 48px; height: 48px; background: #10b981; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; margin: 0 auto 20px; }
        .how-step-title { font-size: 16px; font-weight: 700; color: #111; margin-bottom: 10px; }
        .how-step-desc { font-size: 14px; color: "#6b7280"; line-height: 1.6; }
        .how-connector { position: absolute; right: -18px; top: 50%; transform: translateY(-50%); color: #d1fae5; z-index: 1; }

        /* ── Trust ── */
        .trust-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .trust-card { display: flex; gap: 16px; background: #fff; border: 1px solid #f0f0f0; border-radius: 14px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .trust-icon { width: 48px; height: 48px; background: #f0fdf4; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #10b981; flex-shrink: 0; }
        .trust-title { font-size: 15px; font-weight: 700; color: #111; margin-bottom: 6px; }
        .trust-desc { font-size: 13px; color: #6b7280; line-height: 1.6; }

        /* ── Calculator ── */
        .calc-stats { display: flex; justify-content: center; gap: 48px; margin-bottom: 48px; }
        .calc-stat { text-align: center; }
        .calc-stat-val { font-size: 32px; font-weight: 800; color: #10b981; }
        .calc-stat-label { font-size: 13px; color: "#6b7280"; }
        .calc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .calc-card { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 14px; padding: 24px 20px; text-align: center; cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s; }
        .calc-card:hover { border-color: #10b981; box-shadow: 0 4px 16px rgba(16,185,129,0.1); }
        .calc-card-icon { width: 52px; height: 52px; background: #f0fdf4; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #10b981; margin: 0 auto 14px; }
        .calc-card-label { font-size: 15px; font-weight: 700; color: #111; margin-bottom: 6px; }
        .calc-card-desc { font-size: 12px; color: #9ca3af; line-height: 1.5; margin-bottom: 16px; }
        .calc-card-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #10b981; background: none; border: none; cursor: pointer; font-family: inherit; }

        /* ── Reviews ── */
        .reviews-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .review-card { background: #fff; border: 1px solid #f0f0f0; border-radius: 14px; padding: 22px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .review-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .review-avatar { width: 38px; height: 38px; border-radius: 50%; background: #10b981; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; flex-shrink: 0; }
        .review-name { font-size: 14px; font-weight: 600; color: #111; }
        .review-stars { display: flex; gap: 2px; margin-top: 2px; }
        .review-text { font-size: 13px; color: "#6b7280"; line-height: 1.65; }

        /* ── Trust Score ── */
        .trust-score-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; text-align: center; }
        .ts-val { font-size: 36px; font-weight: 800; color: #10b981; }
        .ts-label { font-size: 13px; color: "#6b7280"; margin-top: 4px; }

        /* ── Guarantees ── */
        .guarantee-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .guarantee-item { display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid #f0f0f0; border-radius: 10px; padding: 14px 16px; font-size: 14px; font-weight: 500; color: #111; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
        .guarantee-check { width: 20px; height: 20px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #fff; font-size: 11px; }

        /* ── Cities ── */
        .cities-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; justify-content: center; }
        .cities-tab { padding: 7px 16px; border-radius: 20px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; color: #555; transition: all 0.15s; }
        .cities-tab.active, .cities-tab:hover { border-color: #10b981; background: #f0fdf4; color: #10b981; font-weight: 600; }
        .cities-grid { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        .city-chip { padding: 8px 16px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 13px; color: #444; cursor: pointer; transition: all 0.15s; }
        .city-chip:hover { border-color: #10b981; color: #10b981; background: #f0fdf4; }

        /* ── App Download ── */
        .app-section { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 64px 32px; text-align: center; color: #fff; overflow-x: hidden; width: 100%; }
        .app-section h2 { font-size: clamp(22px, 3vw, 32px); font-weight: 800; margin-bottom: 12px; }
        .app-section p { font-size: 15px; opacity: 0.85; margin-bottom: 32px; }
        .app-features { display: flex; justify-content: center; gap: 28px; flex-wrap: wrap; margin-bottom: 36px; }
        .app-feature { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 500; }
        .app-feature::before { content: "✓"; font-weight: 800; }
        .app-btns { display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; }
        .app-btn-hero { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.4); border-radius: 12px; padding: 12px 22px; cursor: pointer; color: #fff; text-decoration: none; transition: background 0.2s; }
        .app-btn-hero:hover { background: rgba(255,255,255,0.25); }
        .app-btn-hero-label { font-size: 10px; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.5px; }
        .app-btn-hero-name { font-size: 15px; font-weight: 700; }

        /* ── FAQ ── */
        .faq-inner { max-width: 720px; margin: 0 auto; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .hero-inner { grid-template-columns: 1fr; }
          .hero-right { display: none; }
          .how-steps { grid-template-columns: 1fr; }
          .trust-grid { grid-template-columns: 1fr; }
          .calc-grid { grid-template-columns: 1fr 1fr; }
          .reviews-grid { grid-template-columns: 1fr 1fr; }
          .trust-score-grid { grid-template-columns: 1fr 1fr; gap: 20px; }
          .guarantee-list { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .hp-container { padding: 0 16px; }
          .hero { padding: 40px 16px 52px; }
          .referral-bar { padding: 8px 16px; font-size: 12px; }
          .app-section { padding: 48px 16px; }
          .hero-cats { grid-template-columns: 1fr 1fr; }
          .hero-stats { gap: 20px; }
          .calc-grid { grid-template-columns: 1fr 1fr; }
          .reviews-grid { grid-template-columns: 1fr; }
          .guarantee-list { grid-template-columns: 1fr; }
          .trust-score-grid { grid-template-columns: 1fr 1fr; }
          .calc-stats { gap: 24px; }
          .hp-section { padding: 40px 0; }
        }
      `}</style>

      <div className="hp-page">

        {/* ── Referral Banner ── */}
        <div className="referral-bar">
          🎉 Refer a friend and get up to <strong>₹500</strong> directly into your bank account.
          <a href="#">Refer Now →</a>
        </div>

        {/* ── Hero Section ── */}
        <section className="hero">
          <div className="hero-inner">
            {/* Left */}
            <div>
              <div className="hero-tag">India's #1 Device Buyback Platform</div>
              <h1 className="hero-h1">
                India's Trusted Buyback<br />
                Platform to <span>Sell Old Devices</span>
              </h1>
              <p className="hero-sub">
                YourBrand is India's online device buyback platform helping you sell old electronics with fair pricing, free doorstep pickup and instant payment.
              </p>

              {/* Device Category Cards */}
              <div className="hero-cats">
                {DEVICE_CATEGORIES.map((cat) => (
                  <a href="#" key={cat.label} className="hero-cat-card">
                    <div className="hero-cat-icon">{cat.icon}</div>
                    <div>
                      <div className="hero-cat-label">{cat.label}</div>
                      <div className="hero-cat-sub">{cat.sub}</div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Stats */}
              <div className="hero-stats">
                {STATS.map((s) => (
                  <div key={s.label} className="hero-stat">
                    <div className="hero-stat-val">{s.value}</div>
                    <div className="hero-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Info Cards */}
            <div className="hero-right">
              <div className="hero-card hero-card-green">
                <div className="hero-card-label">Today's Best Price</div>
                <div className="hero-card-val">₹42,000</div>
                <div className="hero-card-sub">iPhone 13 · 128GB · Good</div>
              </div>
              <div className="hero-card">
                <div className="hero-card-label" style={{ color: "#9ca3af" }}>Free Pickup</div>
                <div className="hero-card-val" style={{ fontSize: "20px", color: "#111" }}>Doorstep</div>
                <div className="hero-card-sub" style={{ color: "#9ca3af" }}>2,000+ Cities</div>
              </div>
              <div className="hero-card hero-card-dark">
                <div className="hero-card-dark-inner">
                  <div className="hero-card-dark-stat">
                    <div className="hero-card-dark-stat-val">1M+</div>
                    <div className="hero-card-dark-stat-label">Downloads</div>
                  </div>
                  <div className="hero-card-dark-stat">
                    <div className="hero-card-dark-stat-val">₹500Cr</div>
                    <div className="hero-card-dark-stat-label">Cash Given</div>
                  </div>
                  <div className="hero-card-dark-stat">
                    <div className="hero-card-dark-stat-val">100K+</div>
                    <div className="hero-card-dark-stat-label">Devices Acquired</div>
                  </div>
                  <div className="hero-card-dark-stat">
                    <div className="hero-card-dark-stat-val">4.8 ★</div>
                    <div className="hero-card-dark-stat-label">Verified Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ── How It Works ── */}
        <section className="hp-section">
          <div className="hp-container">
            <SectionTitle
              tag="Simple Process"
              title="How YourBrand Device Buyback Process Works"
              subtitle="No hassle, no bargaining — selling your old device online is simple. Instant pricing, secure pickups, and fast payments."
            />
            <div className="how-steps">
              {HOW_STEPS.map((step, i) => (
                <div key={step.num} className="how-step" style={{ position: "relative" }}>
                  <div className="how-step-num">{step.num}</div>
                  <div className="how-step-title">{step.title}</div>
                  <p className="how-step-desc" style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.6 }}>{step.desc}</p>
                  {i < HOW_STEPS.length - 1 && (
                    <div className="how-connector" style={{ position: "absolute", right: "-18px", top: "40px", color: "#10b981" }}>
                      <ArrowRightIcon />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Trust Us ── */}
        <section className="hp-section hp-section-alt">
          <div className="hp-container">
            <SectionTitle
              tag="Why Choose Us"
              title="Why People Trust YourBrand"
              subtitle="Built to make selling electronics simple, transparent, and secure — every single time."
            />
            <div className="trust-grid">
              {TRUST_FEATURES.map((f) => (
                <div key={f.title} className="trust-card">
                  <div className="trust-icon">{f.icon}</div>
                  <div>
                    <div className="trust-title">{f.title}</div>
                    <div className="trust-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Device Resale Calculator ── */}
        <section className="hp-section">
          <div className="hp-container">
            <SectionTitle
              tag="Price Calculator"
              title="Check Your Device Resale Value Instantly"
              subtitle="Our smart calculator evaluates your device model, condition, storage variant, and market demand for a transparent and fair price estimate."
            />
            <div className="calc-stats">
              <div className="calc-stat">
                <div className="calc-stat-val">5,000+</div>
                <div className="calc-stat-label" style={{ color: "#6b7280", fontSize: "13px" }}>Supported Devices</div>
              </div>
              <div className="calc-stat">
                <div className="calc-stat-val">10,000+</div>
                <div className="calc-stat-label" style={{ color: "#6b7280", fontSize: "13px" }}>Daily Calculations</div>
              </div>
            </div>
            <div className="calc-grid">
              {CALCULATOR_ITEMS.map((item) => (
                <div key={item.label} className="calc-card">
                  <div className="calc-card-icon">{item.icon}</div>
                  <div className="calc-card-label">{item.label}</div>
                  <div className="calc-card-desc">{item.desc}</div>
                  <button className="calc-card-btn">
                    Get My Value Now <ArrowRightIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Reviews ── */}
        <section className="hp-section hp-section-alt">
          <div className="hp-container">
            <SectionTitle
              tag="Customer Reviews"
              title="Real Feedback From Our Customers"
              subtitle="Thousands of users across India trust YourBrand to convert their old phones into instant cash with free pickup and transparent pricing."
            />
            <div className="reviews-grid">
              {REVIEWS.map((r) => (
                <div key={r.name} className="review-card">
                  <div className="review-top">
                    <div className="review-avatar">{r.name[0].toUpperCase()}</div>
                    <div>
                      <div className="review-name">{r.name}</div>
                      <div className="review-stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon key={i} filled={i < r.stars} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="review-text" style={{ color: "#6b7280" }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trust Score ── */}
        <section className="hp-section">
          <div className="hp-container">
            <SectionTitle
              tag="Our Impact"
              title="YourBrand Trust Score"
              subtitle="Over the years, YourBrand has helped users sell thousands of devices through a transparent buyback platform."
            />
            <div className="trust-score-grid">
              {[
                { val: "1M+", label: "Downloads" },
                { val: "₹500Cr", label: "Cash Given" },
                { val: "100K+", label: "Devices Acquired" },
                { val: "2,000+", label: "Areas Covered" },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: "center", padding: "28px", background: "#f9fafb", borderRadius: "14px", border: "1px solid #f0f0f0" }}>
                  <div className="ts-val">{s.val}</div>
                  <div className="ts-label" style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Guarantees ── */}
        <section className="hp-section hp-section-alt">
          <div className="hp-container">
            <SectionTitle tag="Our Promise" title="YourBrand Guarantees" subtitle="Every transaction follows a transparent and secure process designed to protect both customers and devices." />
            <div className="guarantee-list">
              {GUARANTEES.map((g) => (
                <div key={g} className="guarantee-item">
                  <div className="guarantee-check">✓</div>
                  {g}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cities ── */}
        <section className="hp-section">
          <div className="hp-container">
            <SectionTitle
              tag="Service Coverage"
              title="Cities Where Pickup Is Available 💚"
              subtitle="Free doorstep pickup services across major cities in India. Serving 2,000+ Cities Across India."
            />
            <div className="cities-tabs">
              {["Mobile", "Tablet", "Laptop", "Mac"].map((t) => (
                <button key={t} className={`cities-tab ${t === "Mobile" ? "active" : ""}`}>{t}</button>
              ))}
            </div>
            <div className="cities-grid">
              {CITIES.map((city) => (
                <a key={city} href="#" className="city-chip">{city}</a>
              ))}
            </div>
          </div>
        </section>

        {/* ── App Download ── */}
        <section className="app-section">
          <div style={{ maxWidth: "640px", margin: "0 auto" }}>
            <h2>Download the App Now</h2>
            <p>Experience Seamless Device Selling in Minutes on the YourBrand App</p>
            <div className="app-features">
              {["Get instant quotes", "Schedule pickups", "Track your orders"].map((f) => (
                <div key={f} className="app-feature">{f}</div>
              ))}
            </div>
            <div className="app-btns">
              <a href="#" className="app-btn-hero">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.3.17.65.2.98.09L14.84 12 3.18.15a1.1 1.1 0 0 0-.98.09C1.84.61 1.5 1.04 1.5 1.6v20.8c0 .56.34.99.84 1.27.28.15.56.16.84.09zM16.55 10.33l-2.29-2.29 2.64-4.56 4.08 2.36c.62.36.62 1.26 0 1.62l-4.43 2.87zM14.84 12l-11.66 11.76 13.26-7.67L14.84 12zM14.84 12l1.6-1.6-11.26-9.96L14.84 12z" /></svg>
                <div>
                  <div className="app-btn-hero-label">GET IT ON</div>
                  <div className="app-btn-hero-name">Google Play</div>
                </div>
              </a>
              <a href="#" className="app-btn-hero">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                <div>
                  <div className="app-btn-hero-label">DOWNLOAD ON</div>
                  <div className="app-btn-hero-name">App Store</div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="hp-section">
          <div className="hp-container">
            <SectionTitle tag="FAQs" title="Frequently Asked Questions" subtitle="Find clear answers to all your questions, from device pricing to pickup and secure payments." />
            <div className="faq-inner">
              {FAQS.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}