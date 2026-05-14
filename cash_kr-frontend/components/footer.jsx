import "./footer.css";

const FooterLogo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
    <span style={{ color: "#0565E6", fontSize: "24px", fontWeight: 900, letterSpacing: "-4px", lineHeight: 1 }}>«</span>
    <span style={{ fontSize: "22px", fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>YourBrand</span>
  </div>
);

const FOOTER_LINKS = {
  "Sell Device": ["Sell Mobile", "Sell Tablet", "Sell Laptop", "Sell Mac", "Corporate Sell"],
  "Quick Links": ["Calculator", "Articles", "Referral Program", "Become a Partner", "Blog"],
  "Support": ["Help Center", "Contact Us", "Track Order", "Terms & Conditions", "Privacy Policy"],
  "Download App": ["Available on App Store", "Available on Play Store"],
};

const SOCIAL_LINKS = [
  {
    name: "Twitter/X",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

const PlayStoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.18 23.76c.3.17.65.2.98.09L14.84 12 3.18.15a1.1 1.1 0 0 0-.98.09C1.84.61 1.5 1.04 1.5 1.6v20.8c0 .56.34.99.84 1.27.28.15.56.16.84.09zM16.55 10.33l-2.29-2.29 2.64-4.56 4.08 2.36c.62.36.62 1.26 0 1.62l-4.43 2.87zM14.84 12l-11.66 11.76 13.26-7.67L14.84 12zM14.84 12l1.6-1.6-11.26-9.96L14.84 12z" />
  </svg>
);

const AppStoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

export default function Footer() {
  return (
    <>
      <footer className="footer-root">
        <div className="footer-main">
          {/* Brand */}
          <div className="footer-brand">
            <FooterLogo />
            <p className="footer-brand-tagline">
              India's most trusted platform to sell your old devices. Get the best price instantly.
            </p>

            <div className="footer-rating">
              <div className="footer-stars">
                {[1,2,3,4,5].map((s) => (
                  <span key={s} className="star">★</span>
                ))}
              </div>
              <span className="footer-rating-text">
                <strong>4.8</strong> / 5 · 10,000+ Reviews
              </span>
            </div>

            <div className="footer-app-buttons">
              <a href="#" className="app-btn">
                <span className="app-btn-icon"><PlayStoreIcon /></span>
                <span className="app-btn-text">
                  <span className="app-btn-label">Get it on</span>
                  <span className="app-btn-name">Google Play</span>
                </span>
              </a>
              <a href="#" className="app-btn">
                <span className="app-btn-icon"><AppStoreIcon /></span>
                <span className="app-btn-text">
                  <span className="app-btn-label">Download on</span>
                  <span className="app-btn-name">App Store</span>
                </span>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div className="footer-col" key={title}>
              <div className="footer-col-title">{title}</div>
              <ul className="footer-col-links">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="footer-divider" />

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} YourBrand. All rights reserved. &nbsp;
            <a href="#">Privacy Policy</a> &nbsp;·&nbsp;
            <a href="#">Terms of Use</a>
          </p>

          <div className="footer-badges">
            <span className="footer-badge">🔒 SSL Secure</span>
            <span className="footer-badge">🇮🇳 Made in India</span>
          </div>

          <div className="footer-social">
            {SOCIAL_LINKS.map((s) => (
              <a key={s.name} href={s.href} className="social-btn" aria-label={s.name}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}