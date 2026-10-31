import { Link, NavLink, useNavigate } from "react-router-dom";
import { ArrowUpRight, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

import { useAuth } from "../../context/AuthContext";

import "./Navbar.css";

const navigationItems = [
  { label: "Explore Projects", to: "/explore" },
  { label: "How It Works", to: "/#how-it-works" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  function closeMenu() {
    setMenuOpen(false);
  }

  async function handleLogout() {
    try {
      setLogoutError("");
      await logout();
      closeMenu();
      navigate("/", { replace: true });
    } catch {
      setLogoutError("Unable to log out. Please try again.");
    }
  }

  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <Link
          to="/"
          className="navbar__brand"
          aria-label="SkillBridge home"
          onClick={closeMenu}
        >
          <img
            src="/images/skillbridge-logo.png"
            alt=""
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
            {!loading &&
              (isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="site-nav__login"
                    onClick={closeMenu}
                  >
                    My Projects
                  </Link>

                  <Link
                    to="/applications"
                    className="site-nav__login"
                    onClick={closeMenu}
                  >
                    My Applications
                  </Link>

                  <Link
                    to="/profile"
                    className="site-nav__login"
                    onClick={closeMenu}
                  >
                    {user?.name || "My Profile"}
                  </Link>

                  <button
                    type="button"
                    className="site-nav__cta navbar__logout"
                    onClick={handleLogout}
                  >
                    Log out
                    <LogOut size={16} aria-hidden="true" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="site-nav__login"
                    onClick={closeMenu}
                  >
                    Log in
                  </Link>

                  <Link
                    to="/register"
                    className="site-nav__cta"
                    onClick={closeMenu}
                  >
                    Create Profile
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </>
              ))}
          </div>
        </nav>
      </div>

      {logoutError && (
        <p className="navbar__error" role="alert">
          {logoutError}
        </p>
      )}
    </header>
  );
}
