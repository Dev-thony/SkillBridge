import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

import { TextField } from "../components/ui/TextField";
import { useAuth } from "../context/AuthContext";

import "./RegisterPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isAuthenticated, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const requestedPath = location.state?.from;
  const redirectTo =
    requestedPath?.pathname?.startsWith("/") &&
    !requestedPath.pathname.startsWith("//")
      ? `${requestedPath.pathname}${requestedPath.search || ""}`
      : "/profile/setup";

  if (authLoading) {
    return (
      <main className="auth-loading" role="status">
        Checking your session...
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setServerError("");
  }

  function validateForm() {
    const nextErrors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setServerError("");

    try {
      await login({
        email: form.email.trim(),
        password: form.password,
      });

      navigate(redirectTo, { replace: true });
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__logo">
            <img
              src="/images/skillbridge-logo.png"
              alt=""
              width="48"
              height="48"
            />
          </div>

          <span className="auth-card__eyebrow">WELCOME BACK</span>

          <h1>Log in to SkillBridge</h1>

          <p>
            Continue building, collaborating, and exploring projects with your
            community.
          </p>
        </div>

        {serverError && (
          <div className="auth-card__alert" role="alert">
            {serverError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email address"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
            required
          />

          <div className="auth-form__password">
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="auth-form__toggle"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          <button
            type="submit"
            className="auth-form__submit"
            disabled={submitting}
          >
            <span>{submitting ? "Logging in..." : "Log in"}</span>

            {!submitting && <ArrowRight size={19} />}
          </button>
        </form>

        <p className="auth-card__footer">
          Don't have an account? <Link to="/register">Create an account</Link>
        </p>
      </section>

      <aside className="auth-aside">
        <div className="auth-aside__content">
          <span className="auth-aside__badge">YOUR JOURNEY CONTINUES</span>

          <h2>
            Welcome back to
            <span> building together.</span>
          </h2>

          <p>
            Your next collaboration, learning opportunity, or exciting project
            is waiting for you.
          </p>

          <div className="auth-aside__features">
            <div>
              <span className="auth-aside__feature-icon">01</span>
              <span>Explore new project opportunities</span>
            </div>

            <div>
              <span className="auth-aside__feature-icon">02</span>
              <span>Connect with talented collaborators</span>
            </div>

            <div>
              <span className="auth-aside__feature-icon">03</span>
              <span>Continue growing your portfolio</span>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
