import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// ─── Icons ───────────────────────────────────────────────────────────────────

const MobileIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);
const TabletIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);
const LaptopIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
  </svg>
);
const MacIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="14" rx="2" /><path d="M8 20h8M12 18v2" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const TagIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);
const ZapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const TruckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const StarIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const ChevronIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const PlayStoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L18.81,16.23C19.46,16.59 19.46,17.41 18.81,17.77L15.44,19.64L12.5,16.71L16.81,15.12M16.81,8.88L12.5,7.29L15.44,4.36L18.81,6.23C19.46,6.59 19.46,7.41 18.81,7.77L16.81,8.88M14.44,12.75L4.54,22.65C4.69,22.73 4.87,22.78 5.06,22.78C5.25,22.78 5.43,22.73 5.58,22.65L14.77,17.53L12.27,15.03L14.44,12.75M14.44,11.25L12.27,8.97L14.77,6.47L5.58,1.35C5.43,1.27 5.25,1.22 5.06,1.22C4.87,1.22 4.69,1.27 4.54,1.35L14.44,11.25Z" />
  </svg>
);

const AppStoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const DEVICE_CATEGORIES = [
  { icon: <MobileIcon />, label: "Mobile", sub: "iPhone, Android", desc: "Sell old mobile phone for instant cash" },
  { icon: <TabletIcon />, label: "Tablet", sub: "iPad, Tab", desc: "Sell old tablet for instant cash" },
  { icon: <LaptopIcon />, label: "Laptop", sub: "Instant Quote", desc: "Sell old laptop for instant cash" },
  { icon: <MacIcon />, label: "Mac", sub: "MacBook, iMac", desc: "Sell old MacBook or iMac for instant cash" },
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

const REVIEWS = [
  { name: "Nitin Gowda", text: "Flawless experience. Instant credit. No haggling whatsoever — exactly what I expected.", stars: 5 },
  { name: "Vidyankit Official", text: "Sold my Realme GT Neo 2. Very smooth process, no negotiation unlike other platforms. Highly recommend!", stars: 5 },
  { name: "Jatin Mishra", text: "Sold my phone, nice company, smooth process. Pickup was on time and payment was instant.", stars: 5 },
  { name: "Disha Doshi", text: "Value for money and service is good. Got the exact price that was shown online.", stars: 5 },
  { name: "pawan mishra", text: "Excellent services! The pickup was too good and the security and checking purposes were professional.", stars: 5 },
  { name: "Mayank Doshi", text: "Very prompt service and got a very good price. Absolutely hassle-free. Highly recommended!", stars: 5 },
  { name: "Ritu Sharma", text: "Super easy process. Got a great price for my old Samsung. Will definitely use again!", stars: 5 },
  { name: "Aakash Mehta", text: "Loved the transparent pricing. No last minute deductions. Payment received in under 10 minutes.", stars: 5 },
  { name: "Priya Nair", text: "The pickup agent was very professional and courteous. Got ₹2,000 more than other platforms quoted.", stars: 5 },
];

const FAQS = [
  { q: "Is CashKr legit?", a: "Yes, CashKr is a legitimate and trusted platform for selling old electronics online in India with secure pickup and instant payment." },
  { q: "Where can I sell my old device online?", a: "You can sell your old device online through CashKr, which offers free doorstep pickup and instant cash payment across 2,000+ cities in India." },
  { q: "What is the best place to sell old devices easily?", a: "CashKr is one of the easiest and safest places to sell old devices online without visiting any shop." },
  { q: "How do I get the highest price for my old gadget?", a: "Select the correct device condition, check the instant online quote, and book a free doorstep pickup on CashKr for the best value." },
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

// ─── Vertical Scrolling Reviews Column ───────────────────────────────────────

function ReviewColumn({ reviews, reverse = false }) {
  const trackRef = useRef(null);
  const animationRef = useRef(null);
  const positionRef = useRef(reverse ? -50 : 0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const speed = 0.02;
    let lastTime = null;
    let paused = false;

    const step = (timestamp) => {
      if (paused) { animationRef.current = requestAnimationFrame(step); return; }
      if (!lastTime) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;

      if (reverse) {
        positionRef.current += speed * delta;
        if (positionRef.current >= 0) positionRef.current = -50;
      } else {
        positionRef.current -= speed * delta;
        if (positionRef.current <= -50) positionRef.current = 0;
      }

      track.style.transform = `translateY(${positionRef.current}%)`;
      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);

    const handleEnter = () => { paused = true; };
    const handleLeave = () => { paused = false; lastTime = null; };
    track.addEventListener("mouseenter", handleEnter);
    track.addEventListener("mouseleave", handleLeave);

    return () => {
      cancelAnimationFrame(animationRef.current);
      track.removeEventListener("mouseenter", handleEnter);
      track.removeEventListener("mouseleave", handleLeave);
    };
  }, [reverse]);

  const doubled = [...reviews, ...reviews];

  return (
    <div className="relative overflow-hidden h-[480px]">
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-bg-alt to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-bg-alt to-transparent z-10 pointer-events-none" />
      
      <div ref={trackRef} className="will-change-transform">
        {doubled.map((r, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 shadow-sm hover:border-primary-light hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                {r.name[0]}
              </div>
              <div>
                <div className="text-sm font-bold text-text-primary">{r.name}</div>
                <div className="flex gap-0.5 mt-0.5">
                  {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} filled={s <= r.stars} />)}
                </div>
              </div>
            </div>
            <p className="text-sm text-text-muted leading-relaxed m-0">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ tag, title, subtitle }) {
  return (
    <div className="text-center mb-12 px-4">
      {tag && (
        <span className="inline-block bg-primary-light text-primary text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4 border border-border-light">
          {tag}
        </span>
      )}
      <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary mb-4 leading-tight tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 bg-gray-50 rounded-2xl mb-4 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-6 py-5 text-left bg-transparent border-none cursor-pointer gap-4 group"
      >
        <span className="text-base sm:text-lg font-bold text-text-primary group-hover:text-primary transition-colors font-sans">{q}</span>
        <span className="text-primary flex-shrink-0"><ChevronIcon open={open} /></span>
      </button>
      {open && (
        <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-sm sm:text-base text-text-muted leading-relaxed m-0">{a}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="w-full">
      {/* ── Referral Banner ── */}
      <div className="bg-primary-light border-b border-border-light py-2.5 px-4 text-center text-[11px] sm:text-sm font-medium text-primary-dark">
        🎉 Refer a friend and get up to <strong className="font-bold">₹500</strong> directly into your bank account.
        <Link to="/referral" className="text-primary font-bold ml-1.5 hover:underline">Refer Now →</Link>
      </div>

      {/* ── Hero Section ── */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 overflow-hidden bg-gradient-to-br from-primary-light via-white to-white">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="z-10">
            <div className="inline-flex items-center gap-2 bg-white border border-border-light rounded-full px-4 py-1.5 text-[10px] sm:text-xs font-bold text-primary mb-6 shadow-sm">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              India's #1 Device Buyback Platform
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-text-primary leading-[1.1] tracking-tight mb-6">
              India's Trusted Buyback<br />
              Platform to <span className="text-primary">Sell Old Devices</span>
            </h1>
            <p className="text-sm sm:text-lg text-text-muted leading-relaxed mb-8 max-w-xl">
              CashKr is India's premier online device buyback platform helping you sell old electronics with fair pricing, free doorstep pickup and instant payment.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {DEVICE_CATEGORIES.map((cat) => (
                <Link 
                  to={`/sell-old-mobile-phones/brand`} 
                  key={cat.label} 
                  className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all no-underline"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-light rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    {cat.icon}
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-text-primary leading-none mb-1">{cat.label}</div>
                    <div className="text-xs sm:text-sm text-text-muted font-medium">{cat.sub}</div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-8 sm:gap-12">
              {[
                { val: "4.8 ★", label: "Verified Rating" },
                { val: "100Cr+", label: "Cash Paid" },
                { val: "50K+", label: "Happy Customers" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-xl sm:text-2xl font-black text-primary">{s.val}</div>
                  <div className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Right: Stats Cards (Desktop Only) */}
          <div className="hidden lg:grid grid-cols-2 gap-4 relative">
            <div className="absolute -inset-4 bg-primary/5 rounded-[40px] blur-3xl -z-10" />
            <div className="bg-primary text-white rounded-[24px] p-6 shadow-2xl shadow-primary/20 hover:scale-105 transition-transform">
              <div className="text-[10px] font-bold uppercase opacity-80 mb-2 tracking-widest">Today's Best Price</div>
              <div className="text-3xl font-black mb-1">₹42,000</div>
              <div className="text-xs opacity-80">iPhone 13 · 128GB · Good</div>
            </div>
            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-xl hover:scale-105 transition-transform">
              <div className="text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-widest">Free Pickup</div>
              <div className="text-2xl font-black text-text-primary mb-1">Doorstep</div>
              <div className="text-xs text-text-muted font-medium">2,000+ Cities in India</div>
            </div>
            <div className="col-span-2 bg-gray-900 rounded-[24px] p-8 shadow-2xl hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-center gap-4">
                {[
                  { v: "1M+", l: "Downloads" },
                  { v: "₹500Cr", l: "Cash Given" },
                  { v: "4.8 ★", l: "Rating" },
                ].map(s => (
                  <div key={s.l} className="text-center">
                    <div className="text-2xl font-black text-primary mb-1">{s.v}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionTitle 
            tag="Simple Process" 
            title="How CashKr Buyback Process Works" 
            subtitle="No hassle, no bargaining — selling your old device online is simple. Instant pricing, secure pickups, and fast payments."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-primary/20 -z-10" />
            
            {HOW_STEPS.map((step, i) => (
              <div key={step.num} className="bg-white rounded-[32px] p-8 text-center border border-gray-100 shadow-sm hover:shadow-xl transition-shadow relative">
                <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center text-xl font-black mx-auto mb-6 shadow-lg shadow-primary/30">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-4">{step.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Trust Us ── */}
      <section className="py-16 sm:py-24 bg-bg-alt">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionTitle 
            tag="Why Choose Us" 
            title="Why People Trust CashKr" 
            subtitle="Built to make selling electronics simple, transparent, and secure — every single time."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TRUST_FEATURES.map((f) => (
              <div key={f.title} className="flex gap-6 bg-white rounded-2xl p-6 sm:p-8 border border-gray-50 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-light rounded-xl flex items-center justify-center text-primary shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-text-primary mb-2">{f.title}</h4>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Customer Reviews ── */}
      <section className="py-16 sm:py-24 bg-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionTitle 
            tag="Customer Reviews" 
            title="Real Feedback From Our Customers" 
            subtitle="Thousands of users across India trust CashKr to convert their old phones into instant cash with free pickup."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReviewColumn reviews={REVIEWS.slice(0, 3)} />
            <div className="hidden md:block">
              <ReviewColumn reviews={REVIEWS.slice(3, 6)} reverse />
            </div>
            <div className="hidden md:block">
              <ReviewColumn reviews={REVIEWS.slice(6, 9)} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Cities & Guarantees ── */}
      <section className="py-16 sm:py-24 bg-bg-alt">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-text-primary mb-6">Serving 2,000+ Cities Across India 🇮🇳</h2>
              <p className="text-sm text-text-muted mb-8">Free doorstep pickup services across major cities in India. We're growing fast!</p>
              <div className="flex flex-wrap gap-2">
                {CITIES.map((city) => (
                  <Link key={city} to="/sell-old-mobile-phones/brand" className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-xs font-bold text-gray-600 hover:border-primary hover:text-primary hover:shadow-sm transition-all no-underline">
                    {city}
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-gray-100 shadow-xl">
              <h3 className="text-xl font-bold text-text-primary mb-8">CashKr Guarantees</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GUARANTEES.map((g) => (
                  <div key={g} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 rounded-xl p-4">
                    <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-[10px] shrink-0">✓</div>
                    {g}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── App Download CTA ── */}
      <section className="py-16 sm:py-24 bg-primary px-4">
        <div className="max-w-[800px] mx-auto text-center text-white">
          <h2 className="text-2xl sm:text-4xl font-black mb-6">Download the CashKr App Now</h2>
          <p className="text-sm sm:text-lg opacity-80 mb-10 leading-relaxed">Experience seamless device selling in minutes. Get instant quotes, schedule pickups, and track orders from your phone.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-2xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all no-underline">
              <PlayStoreIcon /> Google Play
            </a>
            <a href="#" className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all no-underline border border-gray-800">
              <AppStoreIcon /> App Store
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-[800px] mx-auto px-4">
          <SectionTitle 
            tag="FAQs" 
            title="Frequently Asked Questions" 
            subtitle="Find clear answers to all your questions about device pricing, pickups, and secure payments."
          />
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}