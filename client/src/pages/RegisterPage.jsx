import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Check, Circle } from "lucide-react";

import { TextField } from "../components/ui/TextField";
import { useAuth } from "../context/AuthContext";
import "./RegisterPage.css";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const passwordRules = [
  {
    label: "At least 8 characters",
    test: (password) => password.length >= 8,
  },
  {
    label: "One uppercase letter",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: "One lowercase letter",
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: "One number",
    test: (password) => /\d/.test(password),
  },
  {
    label: "One special character",
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordIsValid = passwordRules.every((rule) =>
    rule.test(form.password),
  );

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

    if (form.name.trim().length < 2) {
      nextErrors.name = "Enter at least 2 characters.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!passwordIsValid) {
      nextErrors.password = "Please meet all password requirements.";
    }

    if (form.password.length > 128) {
      nextErrors.password = "Password must not exceed 128 characters.";
    }

    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setServerError("");

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      navigate("/profile/setup", { replace: true });
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
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

          <span className="auth-card__eyebrow">JOIN SKILLBRIDGE</span>

          <h1>Create your account</h1>

          <p>
            Build your profile, discover projects, and collaborate with people
            who share your interests.
          </p>
        </div>

        {serverError && (
          <div className="auth-card__alert" role="alert">
            {serverError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Full name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            autoComplete="name"
            maxLength={80}
            required
          />

          <TextField
            label="Email address"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
            maxLength={254}
            required
          />

          <div className="auth-form__password">
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a secure password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
            />

            <button
              type="button"
              className="auth-form__toggle"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>

            {form.password.length > 0 && (
              <div
                className="password-checklist"
                aria-label="Password requirements"
                aria-live="polite"
              >
                <p>Password requirements</p>

                <ul>
                  {passwordRules.map((rule) => {
                    const passed = rule.test(form.password);

                    return (
                      <li key={rule.label} className={passed ? "is-valid" : ""}>
                        {passed ? (
                          <Check size={14} aria-hidden="true" />
                        ) : (
                          <Circle size={12} aria-hidden="true" />
                        )}
                        <span>{rule.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <TextField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
            required
          />

          <button
            type="submit"
            className="auth-form__submit"
            disabled={loading}
          >
            <span>{loading ? "Creating account..." : "Create account"}</span>
            {!loading && <ArrowRight size={19} />}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>

      <aside className="auth-aside">
        <div className="auth-aside__content">
          <span className="auth-aside__badge">BUILD • LEARN • COLLABORATE</span>

          <h2>
            Great projects start with
            <span> great connections.</span>
          </h2>

          <p>
            Connect with other builders, share your skills, and turn ideas into
            real-world projects.
          </p>

          <div className="auth-aside__features">
            <div>
              <span className="auth-aside__feature-icon">01</span>
              <span>Discover meaningful projects</span>
            </div>

            <div>
              <span className="auth-aside__feature-icon">02</span>
              <span>Collaborate with other developers</span>
            </div>

            <div>
              <span className="auth-aside__feature-icon">03</span>
              <span>Build your portfolio through experience</span>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
