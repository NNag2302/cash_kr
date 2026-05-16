import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NAV_ITEMS = [
  { label: "Mobile", hasDropdown: false, to: "/sell-old-mobile-phones/brand" },
  { label: "Tablet", hasDropdown: false },
  { label: "Laptop", hasDropdown: false },
  { label: "Mac", hasDropdown: false },
  { label: "Corporate", hasDropdown: false },
  { label: "Calculator", hasDropdown: false },
  { label: "Articles", hasDropdown: false },
  { label: "Referral", hasDropdown: false },
  { label: "Partner", hasDropdown: false },
];

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [activeItem, setActiveItem] = useState("Corporate");
  const auth = useAuth();
  const isLoggedIn = auth?.isAuthenticated;
  const userName = auth?.user?.name;
  const navigate = useNavigate();

  const handleMobileExpand = (label) => {
    setMobileExpanded((prev) => (prev === label ? null : label));
  };

  return (
    <nav className="sticky top-0 z-[1000] bg-white border-b border-gray-100 mx-4 sm:mx-8 mt-2 rounded-xl shadow-sm">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 h-16 gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 no-underline shrink-0">
          <span className="text-primary text-2xl font-black tracking-[-4px] leading-none">«</span>
          <span className="text-2xl font-bold text-text-primary tracking-tight">CashKr</span>
        </Link>

        {/* Search (Desktop) */}
        <div className="hidden md:block flex-1 max-w-md relative">
          <input 
            type="text" 
            placeholder="What are you selling today?" 
            className="w-full pl-4 pr-10 py-2.5 border-1.5 border-gray-200 rounded-xl text-sm font-sans text-gray-800 outline-none bg-gray-50 focus:border-primary focus:bg-white transition-all"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
            <SearchIcon />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {isLoggedIn ? (
            <Link to="/dashboard" className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-sm no-underline transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                {userName?.[0]?.toUpperCase() || 'U'}
              </div>
              Dashboard
            </Link>
          ) : (
            <Link to="/login" className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-sm no-underline transition-colors">
              <UserIcon />
              Login
            </Link>
          )}
          
          <Link to="/sell-old-mobile-phones/brand" className="bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-all no-underline shadow-sm hover:-translate-y-px active:translate-y-0 uppercase tracking-wide">
            Sell Now
          </Link>

          {/* Hamburger */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Bottom Nav (Desktop) */}
      <div className="hidden md:flex items-center justify-around px-8 h-12 gap-1 overflow-x-auto no-scrollbar">
        {NAV_ITEMS.map((item) => (
          <div 
            key={item.label}
            className="relative"
            onMouseEnter={() => item.hasDropdown && setOpenDropdown(item.label)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button 
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                ${activeItem === item.label ? 'text-text-primary font-bold bg-gray-50' : 'text-gray-500 hover:text-primary hover:bg-primary-light'}`}
              onClick={() => {
                setActiveItem(item.label);
                if (item.to) {
                  navigate(item.to);
                }
              }}
            >
              {item.label}
              {item.hasDropdown && (
                <span className={`transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`}>
                  <ChevronDown />
                </span>
              )}
            </button>

            {item.hasDropdown && openDropdown === item.label && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl min-w-[180px] py-2 z-[2000] animate-in fade-in slide-in-from-top-2 duration-150">
                {item.items.map((sub) => (
                  <button key={sub} className="block w-full text-left px-5 py-2.5 text-sm text-gray-600 hover:bg-primary-light hover:text-primary transition-colors font-sans">
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-18 bg-white z-[999] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200 p-4">
          <div className="mb-6">
            <input 
              type="text" 
              placeholder="What are you selling today?" 
              className="w-full px-4 py-3 border-1.5 border-gray-200 rounded-xl text-sm font-sans bg-gray-50 outline-none focus:border-primary focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <button 
                  className={`flex items-center justify-between w-full px-5 py-4 text-left font-medium border-b border-gray-50 transition-colors
                    ${activeItem === item.label ? 'text-primary font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => {
                    if (!item.hasDropdown) {
                      setActiveItem(item.label);
                      setMobileMenuOpen(false);
                      if (item.to) {
                        navigate(item.to);
                      }
                    } else {
                      handleMobileExpand(item.label);
                    }
                  }}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <span className={`transition-transform duration-200 ${mobileExpanded === item.label ? 'rotate-180' : ''}`}>
                      <ChevronDown />
                    </span>
                  )}
                </button>

                {item.hasDropdown && mobileExpanded === item.label && (
                  <div className="bg-gray-50 px-8 py-2 border-b border-gray-100">
                    {item.items.map((sub) => (
                      <button key={sub} className="block w-full text-left py-3 text-sm text-gray-500 hover:text-primary transition-colors">
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {isLoggedIn ? (
              <Link to="/dashboard" className="flex items-center justify-center gap-2 p-4 border-1.5 border-gray-200 rounded-xl font-medium text-gray-700 no-underline hover:border-primary hover:text-primary transition-colors">
                <UserIcon /> Dashboard
              </Link>
            ) : (
              <Link to="/login" className="flex items-center justify-center gap-2 p-4 border-1.5 border-gray-200 rounded-xl font-medium text-gray-700 no-underline hover:border-primary hover:text-primary transition-colors">
                <UserIcon /> Login
              </Link>
            )}
            <Link to="/sell-old-mobile-phones/brand" className="bg-primary text-white p-4 rounded-xl font-bold text-center no-underline shadow-lg uppercase tracking-wider">
              Sell Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}