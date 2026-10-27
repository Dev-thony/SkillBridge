import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import "./Navbar.css";

const navigationItems = [
  { label: "Explore Projects", to: "/explore" },
  { label: "How It Works", to: "/#how-it-works" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <Link
          to="/"
          className="brand"
          aria-label="SkillBridge home"
          onClick={closeMenu}
        >
          <span className="brand__mark" aria-hidden="true">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="2"
                y="2"
                width="28"
                height="28"
                rx="8"
                fill="currentColor"
              />
              <path
                d="M10 11H22M10 16H16M16 16L22 21M16 16L10 21"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <span className="brand__name">SkillBridge</span>
        </Link>

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <nav
          id="primary-navigation"
          className={`site-nav ${menuOpen ? "site-nav--open" : ""}`}
          aria-label="Primary navigation"
        >
          <div className="site-nav__links">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `site-nav__link${isActive ? " site-nav__link--active" : ""}`
                }
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="site-nav__actions">
            <Link to="/login" className="site-nav__login" onClick={closeMenu}>
              Log in
            </Link>

            <Link to="/register" className="site-nav__cta" onClick={closeMenu}>
              Create Profile
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
