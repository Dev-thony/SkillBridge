import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  FolderKanban,
  ClipboardList,
  Settings,
  UserRound,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";
import { useTheme } from "../../context/ThemeContext";

const navigationItems = [
  { label: "Explore Projects", to: "/explore" },
  { label: "How It Works", to: "/#how-it-works" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const profileMenuRef = useRef(null);

  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

  const { theme, setTheme } = useTheme();

  function toggleVisitorTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!profileMenuOpen) return;

    function handleOutsideClick(event) {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") setProfileMenuOpen(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileMenuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") closeMenu();
    }

    function handleResize() {
      if (window.innerWidth > 768) closeMenu();
    }

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    document.body.classList.add("mobile-navigation-open");

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
      document.body.classList.remove("mobile-navigation-open");
    };
  }, [menuOpen]);

  async function handleLogout() {
    try {
      setLogoutError("");
      await logout();
      closeMenu();
      setProfileMenuOpen(false);
      navigate("/", { replace: true });
    } catch {
      setLogoutError("Unable to log out. Please try again.");
    }
  }

  function getInitials(name) {
    if (!name) return "U";
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }

  const avatar = user?.avatarUrl ? (
    <img src={user.avatarUrl} alt="" className="navbar__avatar-image" />
  ) : (
    <span aria-hidden="true">{getInitials(user?.name)}</span>
  );

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner container">
          <Link to="/" className="navbar__brand" onClick={closeMenu}>
            <img
              src="/images/skillbridge-logo.png"
              alt=""
              className="navbar__logo"
            />
            <span className="navbar__brand-name">SkillBridge</span>
          </Link>

          <nav
            className="site-nav site-nav--desktop"
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
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {!loading && (
              <div className="site-nav__actions">
                {isAuthenticated ? (
                  <>
                    <NavLink to="/dashboard" className="site-nav__link">
                      My Projects
                    </NavLink>

                    <NavLink to="/applications" className="site-nav__link">
                      My Applications
                    </NavLink>

                    <div className="navbar-profile-menu" ref={profileMenuRef}>
                      <button
                        type="button"
                        className="navbar-profile-menu__trigger"
                        aria-label="Open profile menu"
                        aria-expanded={profileMenuOpen}
                        onClick={() => setProfileMenuOpen((open) => !open)}
                      >
                        <span className="navbar__avatar">{avatar}</span>
                        <ChevronDown size={15} />
                      </button>

                      {profileMenuOpen && (
                        <div className="navbar-profile-menu__dropdown">
                          <div className="navbar-profile-menu__identity">
                            <strong>{user?.name || "My account"}</strong>
                            <span>{user?.email}</span>
                          </div>

                          <Link
                            to="/profile"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            <UserRound size={17} />
                            My Profile
                          </Link>

                          <Link
                            to="/settings"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            <Settings size={17} />
                            Settings
                          </Link>

                          <button type="button" onClick={handleLogout}>
                            <LogOut size={17} />
                            Log out
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="navbar-theme-toggle"
                      onClick={toggleVisitorTheme}
                      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                    >
                      {theme === "dark" ? (
                        <Sun size={18} />
                      ) : (
                        <Moon size={18} />
                      )}
                      <span>{theme === "dark" ? "Light" : "Dark"}</span>
                    </button>

                    <Link to="/login" className="site-nav__login">
                      Log in
                    </Link>

                    <Link to="/register" className="site-nav__cta">
                      Create Profile
                      <ArrowUpRight size={16} />
                    </Link>
                  </>
                )}
              </div>
            )}
          </nav>

          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {logoutError && (
          <p className="navbar__error" role="alert">
            {logoutError}
          </p>
        )}
      </header>

      {menuOpen && (
        <div
          className="mobile-navigation-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeMenu();
          }}
        >
          <nav
            className="mobile-navigation-drawer"
            aria-label="Mobile navigation"
          >
            <div className="mobile-navigation-drawer__header">
              <Link to="/" className="navbar__brand" onClick={closeMenu}>
                <img
                  src="/images/skillbridge-logo.png"
                  alt=""
                  className="navbar__logo"
                />
                <span className="navbar__brand-name">SkillBridge</span>
              </Link>
              <button
                type="button"
                className="mobile-navigation-drawer__close"
                onClick={closeMenu}
                aria-label="Close navigation"
              >
                <X size={21} />
              </button>
            </div>

            <div className="mobile-navigation-drawer__content">
              <div className="mobile-navigation-drawer__links">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="mobile-navigation-drawer__link"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>

              {!loading && (
                <div className="mobile-navigation-drawer__account">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/profile"
                        className="mobile-navigation-drawer__profile"
                        onClick={closeMenu}
                      >
                        <span className="navbar__avatar navbar__avatar--drawer">
                          {avatar}
                        </span>
                        <span className="mobile-navigation-drawer__profile-text">
                          <strong>{user?.name || "My Profile"}</strong>
                          <span>View profile</span>
                        </span>
                      </Link>

                      <Link
                        to="/dashboard"
                        className="mobile-navigation-drawer__link"
                        onClick={closeMenu}
                      >
                        <FolderKanban size={18} /> My Projects
                      </Link>
                      <Link
                        to="/applications"
                        className="mobile-navigation-drawer__link"
                        onClick={closeMenu}
                      >
                        <ClipboardList size={18} /> My Applications
                      </Link>
                      <Link
                        to="/settings"
                        className="mobile-navigation-drawer__link"
                        onClick={closeMenu}
                      >
                        <Settings size={18} /> Settings
                      </Link>

                      <button
                        type="button"
                        className="site-nav__cta navbar__logout mobile-navigation-drawer__logout"
                        onClick={handleLogout}
                      >
                        Log out <LogOut size={17} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="navbar-theme-toggle navbar-theme-toggle--drawer"
                        onClick={toggleVisitorTheme}
                      >
                        {theme === "dark" ? (
                          <Sun size={18} />
                        ) : (
                          <Moon size={18} />
                        )}
                        <span>
                          Switch to {theme === "dark" ? "Light" : "Dark"} theme
                        </span>
                      </button>

                      <Link
                        to="/login"
                        className="mobile-navigation-drawer__link"
                        onClick={closeMenu}
                      >
                        Log in
                      </Link>

                      <Link
                        to="/register"
                        className="site-nav__cta"
                        onClick={closeMenu}
                      >
                        Create Profile <ArrowUpRight size={16} />
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
