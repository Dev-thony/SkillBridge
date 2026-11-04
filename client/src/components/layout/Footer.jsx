import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./Footer.css";

export default function Footer() {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <div className="site-footer__main">
          <div className="site-footer__brand">
            <Link to="/" className="site-footer__logo">
              <img
                src="/images/skillbridge-logo.png"
                alt="SkillBridge"
                width="40"
                height="40"
              />
              <span>SkillBridge</span>
            </Link>

            <p>
              Build projects together. Gain real-world experience. Find your
              next opportunity to learn, collaborate and grow.
            </p>
          </div>

          <div className="site-footer__links">
            <div>
              <h3>Explore</h3>
              <Link to="/explore">Discover projects</Link>
              <Link to="/explore">Find collaborators</Link>
            </div>

            <div>
              <h3>Account</h3>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">My dashboard</Link>
                  <Link to="/profile">My profile</Link>
                  <Link to="/settings">Settings</Link>
                </>
              ) : (
                <>
                  <Link to="/login">Log in</Link>
                  <Link to="/register">Create an account</Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>
            © {new Date().getFullYear()} SkillBridge. Build something meaningful
            together.
          </p>

          <Link to="/explore">
            Explore projects
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
