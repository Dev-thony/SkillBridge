import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import "./ProfileSetupPage.css";

const emptyProfile = {
  name: "",
  title: "",
  bio: "",
  skills: "",
  interests: "",
  portfolio: "",
  github: "",
  linkedin: "",
  x: "",
};

function profileToForm(user) {
  return {
    name: user?.name || "",
    title: user?.title || "",
    bio: user?.bio || "",
    skills: (user?.skills || []).join(", "),
    interests: (user?.interests || []).join(", "),
    portfolio: user?.links?.portfolio || "",
    github: user?.links?.github || "",
    linkedin: user?.links?.linkedin || "",
    x: user?.links?.x || "",
  };
}

function splitList(value) {
  return [
    ...new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
}

export default function ProfileSetupPage() {
  const { user, loading, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(() =>
    user ? profileToForm(user) : emptyProfile,
  );
  const [previousUser, setPreviousUser] = useState(user);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (user && user !== previousUser) {
    setPreviousUser(user);
    setForm(profileToForm(user));
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = form.name.trim();
    const cleanTitle = form.title.trim();
    const cleanBio = form.bio.trim();

    if (cleanName.length < 2 || cleanName.length > 80) {
      setError("Your name must contain between 2 and 80 characters.");
      return;
    }

    if (cleanTitle.length > 100) {
      setError("Your professional title cannot exceed 100 characters.");
      return;
    }

    if (cleanBio.length > 500) {
      setError("Your bio cannot exceed 500 characters.");
      return;
    }

    const profileData = {
      name: cleanName,
      title: cleanTitle,
      bio: cleanBio,
      skills: splitList(form.skills),
      interests: splitList(form.interests),
      links: {
        portfolio: form.portfolio.trim(),
        github: form.github.trim(),
        linkedin: form.linkedin.trim(),
        x: form.x.trim(),
      },
      profileCompleted: true,
    };

    setSaving(true);

    try {
      await updateProfile(profileData);
      setSuccess("Your profile has been saved successfully.");

      navigate("/profile", { replace: true });
    } catch (saveError) {
      setError(
        saveError.message || "Unable to save your profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="profile-setup">
        <p>Loading your profile...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="profile-setup">
        <p>Please log in to complete your profile.</p>
        <button type="button" onClick={() => navigate("/login")}>
          Go to login
        </button>
      </main>
    );
  }

  return (
    <main className="profile-setup">
      <section className="profile-setup__card">
        <header className="profile-setup__header">
          <span className="profile-setup__eyebrow">
            YOUR SKILLBRIDGE PROFILE
          </span>

          <h1>Tell us about yourself</h1>

          <p>
            Share your skills, interests, and experience so other developers can
            discover you and collaborate with you.
          </p>
        </header>

        {error && (
          <div
            className="profile-setup__message profile-setup__message--error"
            role="alert"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="profile-setup__message profile-setup__message--success"
            role="status"
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="profile-setup__field">
            <label htmlFor="name">Full name *</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              minLength={2}
              maxLength={80}
              required
            />
          </div>

          <div className="profile-setup__field">
            <label htmlFor="title">Professional title</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              maxLength={100}
              placeholder="e.g. Frontend Developer"
            />
          </div>

          <div className="profile-setup__field">
            <label htmlFor="bio">About you</label>
            <textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              maxLength={500}
              rows={5}
              placeholder="Tell other developers about yourself..."
            />
            <small>{form.bio.length}/500 characters</small>
          </div>

          <div className="profile-setup__field">
            <label htmlFor="skills">Skills</label>
            <input
              id="skills"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="JavaScript, React, Node.js"
            />
            <small>Separate skills with commas.</small>
          </div>

          <div className="profile-setup__field">
            <label htmlFor="interests">Interests</label>
            <input
              id="interests"
              name="interests"
              value={form.interests}
              onChange={handleChange}
              placeholder="Open source, Web development"
            />
            <small>Separate interests with commas.</small>
          </div>

          <div className="profile-setup__divider">
            <h2>Links</h2>
            <p>Help other developers find your work online.</p>
          </div>

          <div className="profile-setup__field">
            <label htmlFor="portfolio">Portfolio URL</label>
            <input
              id="portfolio"
              name="portfolio"
              type="url"
              value={form.portfolio}
              onChange={handleChange}
              placeholder="https://yourportfolio.com"
            />
          </div>

          <div className="profile-setup__field">
            <label htmlFor="github">GitHub URL</label>
            <input
              id="github"
              name="github"
              type="url"
              value={form.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
          </div>

          <div className="profile-setup__field">
            <label htmlFor="linkedin">LinkedIn URL</label>
            <input
              id="linkedin"
              name="linkedin"
              type="url"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="https://www.linkedin.com/in/username"
            />
          </div>

          <div className="profile-setup__field">
            <label htmlFor="x">X profile URL</label>
            <input
              id="x"
              name="x"
              type="url"
              value={form.x}
              onChange={handleChange}
              placeholder="https://x.com/username"
            />
          </div>

          <div className="profile-setup__actions">
            <button
              type="button"
              className="profile-setup__secondary"
              onClick={() => navigate("/explore")}
            >
              Do this later
            </button>

            <button
              type="submit"
              className="profile-setup__primary"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
