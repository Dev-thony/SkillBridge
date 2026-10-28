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
        <Link to="/" className="navbar__brand" aria-label="SkillBridge home">
          <img
            src="/images/skillbridge-logo.png"
            alt="SkillBridge"
            className="navbar__logo"
          />
          <span className="navbar__brand-name">SkillBridge</span>
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
