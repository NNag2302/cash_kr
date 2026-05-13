import { useState } from "react";

const NAV_ITEMS = [
  {
    label: "Mobile",
    hasDropdown: true,
    items: ["Samsung", "Apple", "OnePlus", "Xiaomi", "Realme", "Vivo", "Oppo"],
  },
  {
    label: "Tablet",
    hasDropdown: true,
    items: ["iPad", "Samsung Tab", "Lenovo Tab", "OnePlus Pad"],
  },
  {
    label: "Laptop",
    hasDropdown: true,
    items: ["Dell", "HP", "Lenovo", "Apple MacBook", "Asus", "Acer"],
  },
  {
    label: "Mac",
    hasDropdown: true,
    items: ["MacBook Air", "MacBook Pro", "Mac Mini", "iMac"],
  },
  { label: "Corporate", hasDropdown: false },
  { label: "Calculator", hasDropdown: false },
  { label: "Articles", hasDropdown: false },
  { label: "Referral", hasDropdown: false },
  { label: "Partner", hasDropdown: false },
];

const ChevronDown = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [activeItem, setActiveItem] = useState("Corporate");

  const handleDropdown = (label) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  const handleMobileExpand = (label) => {
    setMobileExpanded((prev) => (prev === label ? null : label));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .navbar-root {
          font-family: 'DM Sans', sans-serif;
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #fff;
          box-shadow: 0 1px 0 #e8e8e8;
          margin-left: 20px;
          margin-right: 20px;
          border-radius: 8px;
        }

        /* Top Bar */
        .navbar-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          height: 64px;
          gap: 16px;
          border-bottom: 1px solid #f0f0f0;
        }

        /* Logo */
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo-icon {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .logo-chevrons {
          color: #10b981;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -4px;
          line-height: 1;
        }
        .logo-text {
          font-size: 22px;
          font-weight: 700;
          color: #111;
          letter-spacing: -0.5px;
        }

        /* Search */
        .navbar-search {
          flex: 1;
          max-width: 480px;
          position: relative;
        }
        .navbar-search input {
          width: 100%;
          padding: 10px 42px 10px 18px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #333;
          outline: none;
          background: #fafafa;
          transition: border-color 0.2s, background 0.2s;
        }
        .navbar-search input:focus {
          border-color: #10b981;
          background: #fff;
        }
        .navbar-search input::placeholder { color: #aaa; }
        .search-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #888;
          display: flex;
          align-items: center;
          padding: 0;
          transition: color 0.2s;
        }
        .search-btn:hover { color: #10b981; }

        /* Right Actions */
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .btn-login {
          display: flex;
          align-items: center;
          gap: 7px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #333;
          padding: 8px 12px;
          border-radius: 8px;
          transition: background 0.15s, color 0.15s;
        }
        .btn-login:hover { background: #f4f4f4; color: #10b981; }
        .btn-download {
          background: #10b981;
          color: #fff;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: 10px 20px;
          border-radius: 9px;
          transition: background 0.2s, transform 0.1s;
          white-space: nowrap;
        }
        .btn-download:hover { background: #0da271; transform: translateY(-1px); }
        .btn-download:active { transform: translateY(0); }

        /* Bottom Nav */
        .navbar-bottom {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0 32px;
          height: 44px;
          gap: 2px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .navbar-bottom::-webkit-scrollbar { display: none; }

        .nav-item {
          position: relative;
          padding: 0 8px;
        }
        .nav-item-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #555;
          padding: 8px 16px;
          border-radius: 7px;
          white-space: nowrap;
          transition: color 0.15s, background 0.15s;
        }
        .nav-item-btn:hover { color: #10b981; background: #f0fdf8; }
        .nav-item-btn.active {
          color: #111;
          font-weight: 700;
        }
        .chevron-icon {
          transition: transform 0.2s;
          opacity: 0.6;
        }
        .chevron-icon.open { transform: rotate(180deg); }

        /* Dropdown */
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.10);
          min-width: 180px;
          padding: 8px 0;
          z-index: 2000;
          animation: dropIn 0.15s ease;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dropdown-item {
          display: block;
          padding: 9px 18px;
          font-size: 14px;
          color: #444;
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }
        .dropdown-item:hover { background: #f0fdf8; color: #10b981; font-weight: 500; }

        /* Mobile Hamburger */
        .hamburger-btn {
          display: none;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          color: #333;
          padding: 6px;
          border-radius: 8px;
          transition: background 0.15s;
        }
        .hamburger-btn:hover { background: #f4f4f4; }

        /* Mobile Menu */
        .mobile-menu {
          display: none;
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          bottom: 0;
          background: #fff;
          z-index: 999;
          overflow-y: auto;
          padding: 12px 0 32px;
          border-top: 1px solid #f0f0f0;
          animation: slideDown 0.2s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-menu.open { display: block; }

        .mobile-search {
          padding: 12px 20px 16px;
          border-bottom: 1px solid #f0f0f0;
        }
        .mobile-search input {
          width: 100%;
          padding: 10px 18px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #333;
          outline: none;
          background: #fafafa;
        }
        .mobile-nav-item {}
        .mobile-nav-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 14px 24px;
          background: none;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #333;
          cursor: pointer;
          text-align: left;
          transition: background 0.12s;
          border-bottom: 1px solid #f7f7f7;
        }
        .mobile-nav-btn:hover { background: #f9f9f9; }
        .mobile-nav-btn.active { color: #10b981; font-weight: 700; }
        .mobile-dropdown {
          background: #f9fdfb;
          border-bottom: 1px solid #f0f0f0;
        }
        .mobile-dropdown-item {
          display: block;
          padding: 11px 36px;
          font-size: 14px;
          color: #555;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.12s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }
        .mobile-dropdown-item:hover { color: #10b981; }
        .mobile-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 20px 20px 0;
        }
        .mobile-btn-login {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          background: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #333;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .mobile-btn-login:hover { border-color: #10b981; color: #10b981; }
        .mobile-btn-download {
          background: #10b981;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 13px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s;
        }
        .mobile-btn-download:hover { background: #0da271; }

        /* Responsive */
        @media (max-width: 900px) {
          .navbar-top { padding: 0 16px; }
          .navbar-bottom { display: none; }
          .hamburger-btn { display: flex; }
          .navbar-search { display: none; }
          .btn-login { display: none; }
          .btn-download { display: none; }
        }
        @media (max-width: 480px) {
          .logo-text { font-size: 19px; }
        }
      `}</style>

      <nav className="navbar-root">
        {/* Top Bar */}
        <div className="navbar-top">
          {/* Logo */}
          <a href="/" className="navbar-logo">
            <span className="logo-chevrons">«</span>
            <span className="logo-text">Cash_Brand</span>
          </a>

          {/* Search */}
          <div className="navbar-search">
            <input type="text" placeholder="What are you selling today?" />
            <button className="search-btn" aria-label="Search">
              <SearchIcon />
            </button>
          </div>

          {/* Actions */}
          <div className="navbar-actions">
            <button className="btn-login">
              <UserIcon />
              Login
            </button>
            <button className="btn-download">DOWNLOAD APP</button>
            <button
              className="hamburger-btn"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Bottom Nav (Desktop) */}
        <div className="navbar-bottom">
          {NAV_ITEMS.map((item) => (
            <div
              className="nav-item"
              key={item.label}
              onMouseEnter={() => item.hasDropdown && setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className={`nav-item-btn ${activeItem === item.label ? "active" : ""}`}
                onClick={() => {
                  setActiveItem(item.label);
                  if (item.hasDropdown) handleDropdown(item.label);
                }}
              >
                {item.label}
                {item.hasDropdown && (
                  <span className={`chevron-icon ${openDropdown === item.label ? "open" : ""}`}>
                    <ChevronDown />
                  </span>
                )}
              </button>

              {item.hasDropdown && openDropdown === item.label && (
                <div className="dropdown-menu">
                  {item.items.map((sub) => (
                    <button key={sub} className="dropdown-item">
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <div className="mobile-search">
            <input type="text" placeholder="What are you selling today?" />
          </div>

          {NAV_ITEMS.map((item) => (
            <div className="mobile-nav-item" key={item.label}>
              <button
                className={`mobile-nav-btn ${activeItem === item.label ? "active" : ""}`}
                onClick={() => {
                  if (!item.hasDropdown) {
                    setActiveItem(item.label);
                    setMobileMenuOpen(false);
                  } else {
                    handleMobileExpand(item.label);
                  }
                }}
              >
                <span>{item.label}</span>
                {item.hasDropdown && (
                  <span className={`chevron-icon ${mobileExpanded === item.label ? "open" : ""}`}>
                    <ChevronDown />
                  </span>
                )}
              </button>

              {item.hasDropdown && mobileExpanded === item.label && (
                <div className="mobile-dropdown">
                  {item.items.map((sub) => (
                    <button key={sub} className="mobile-dropdown-item">
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="mobile-actions">
            <button className="mobile-btn-login">
              <UserIcon /> Login
            </button>
            <button className="mobile-btn-download">DOWNLOAD APP</button>
          </div>
        </div>
      </nav>
    </>
  );
}