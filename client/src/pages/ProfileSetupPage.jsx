import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { uploadAvatar, uploadResume } from "../services/avatarService";
import "./ProfileSetupPage.css";

const emptyProfile = {
  name: "",
  profileType: "developer",
  title: "",
  bio: "",
  skills: "",
  interests: "",
  phone: "",
  location: "",
  website: "",
  portfolio: "",
  github: "",
  linkedin: "",
  x: "",
};

function profileToForm(user) {
  return {
    ...emptyProfile,
    name: user?.name || "",
    profileType: user?.profileType || "developer",
    title: user?.title || "",
    bio: user?.bio || "",
    skills: (user?.skills || []).join(", "),
    interests: (user?.interests || []).join(", "),
    phone: user?.contact?.phone || "",
    location: user?.contact?.location || "",
    website: user?.links?.website || user?.contact?.website || "",
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

const individualTypes = ["developer", "designer", "student", "freelancer"];

const typeLabels = {
  developer: "Developer",
  designer: "Designer",
  company: "Company / Startup",
  student: "Student",
  freelancer: "Freelancer",
  other: "Other",
};

export default function ProfileSetupPage() {
  const { user, loading, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(() =>
    user ? profileToForm(user) : emptyProfile,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || "");
  const [resumeFile, setResumeFile] = useState(null);

  const isIndividual = individualTypes.includes(form.profileType);
  const isCompany = form.profileType === "company";

  useEffect(() => {
    if (!user) return;

    // Synchronise the form when the authenticated user finishes loading.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(profileToForm(user));
    setAvatarPreview(user.avatarUrl || "");
  }, [user]);

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG or WebP profile image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile images must be 5MB or smaller.");
      event.target.value = "";
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError("");
  }

  function handleResumeChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Your CV must be a PDF, DOC or DOCX file.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Your CV must be 10MB or smaller.");
      event.target.value = "";
      return;
    }

    setResumeFile(file);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const name = form.name.trim();

    if (name.length < 2 || name.length > 80) {
      setError("Your name must contain between 2 and 80 characters.");
      return;
    }

    if (form.profileType === "other" && !form.title.trim()) {
      setError("Please specify your professional title.");
      return;
    }

    if (isIndividual && splitList(form.skills).length === 0) {
      setError("Please add your skills.");
      return;
    }

    if (isIndividual && splitList(form.interests).length === 0) {
      setError("Please add your interests.");
      return;
    }

    if (isCompany && !form.website.trim()) {
      setError("Please add your company or startup website.");
      return;
    }

    setSaving(true);

    try {
      const avatarUrl = avatarFile
        ? await uploadAvatar(avatarFile)
        : user.avatarUrl || "";

      const resumeUrl = resumeFile
        ? await uploadResume(resumeFile)
        : user.resumeUrl || "";

      const profileData = {
        name,
        profileType: form.profileType,
        title:
          form.profileType === "other"
            ? form.title.trim()
            : typeLabels[form.profileType],
        bio: form.bio.trim(),
        skills: isIndividual ? splitList(form.skills) : [],
        interests: isIndividual ? splitList(form.interests) : [],
        contact: {
          phone: form.phone.trim(),
          location: form.location.trim(),
        },
        links: {
          portfolio: isIndividual ? form.portfolio.trim() : "",
          website: isCompany ? form.website.trim() : "",
          github: isCompany || isIndividual ? form.github.trim() : "",
          linkedin: isIndividual ? form.linkedin.trim() : "",
          x: isIndividual ? form.x.trim() : "",
        },
        avatarUrl,
        resumeUrl,
        profileCompleted: true,
      };

      await updateProfile(profileData);
      navigate("/profile", { replace: true });
    } catch (saveError) {
      setError(saveError.message || "Unable to save your profile.");
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
            Choose your professional category and add information relevant to
            your profile.
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

        <form onSubmit={handleSubmit}>
          <div className="profile-setup__field">
            <label htmlFor="avatar">Profile image</label>
            <div className="profile-setup__avatar">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profile preview" />
              ) : (
                <span>No image selected</span>
              )}
            </div>
            <input
              id="avatar"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleAvatarChange}
            />
            <small>JPG, PNG or WebP. Maximum 5MB.</small>
          </div>

          <div className="profile-setup__field">
            <label htmlFor="name">Full name *</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={80}
            />
          </div>

          <div className="profile-setup__field">
            <label htmlFor="profileType">Professional category *</label>
            <select
              id="profileType"
              name="profileType"
              value={form.profileType}
              onChange={handleChange}
              required
            >
              {Object.entries(typeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {form.profileType === "other" && (
            <div className="profile-setup__field">
              <label htmlFor="title">Specify your professional title *</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                maxLength={100}
                placeholder="e.g. Product Manager"
                required
              />
            </div>
          )}

          <div className="profile-setup__field">
            <label htmlFor="bio">About you</label>
            <textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              maxLength={500}
              rows={5}
              placeholder="Tell other people about yourself or your organisation..."
            />
          </div>

          {isIndividual && (
            <>
              <div className="profile-setup__divider">
                <h2>Skills and interests</h2>
                <p>These help project owners discover your profile.</p>
              </div>

              <div className="profile-setup__field">
                <label htmlFor="skills">Skills *</label>
                <input
                  id="skills"
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="JavaScript, React, Node.js"
                  required
                />
                <small>Separate skills with commas.</small>
              </div>

              <div className="profile-setup__field">
                <label htmlFor="interests">Interests *</label>
                <input
                  id="interests"
                  name="interests"
                  value={form.interests}
                  onChange={handleChange}
                  placeholder="Open source, Web development"
                  required
                />
                <small>Separate interests with commas.</small>
              </div>
            </>
          )}

          <div className="profile-setup__divider">
            <h2>Contact information</h2>
            <p>Share the best way to reach you.</p>
          </div>

          <div className="profile-setup__field">
            <label htmlFor="phone">Phone / WhatsApp number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+234..."
            />
          </div>

          <div className="profile-setup__field">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="City, Country"
            />
          </div>

          <div className="profile-setup__divider">
            <h2>Professional links</h2>
          </div>

          {isCompany ? (
            <>
              <div className="profile-setup__field">
                <label htmlFor="website">Company website *</label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://yourcompany.com"
                  required
                />
              </div>

              <div className="profile-setup__field">
                <label htmlFor="github">GitHub URL (optional)</label>
                <input
                  id="github"
                  name="github"
                  type="url"
                  value={form.github}
                  onChange={handleChange}
                  placeholder="https://github.com/yourcompany"
                />
              </div>
            </>
          ) : isIndividual ? (
            <>
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
            </>
          ) : null}

          <div className="profile-setup__divider">
            <h2>Resume / CV</h2>
            <p>
              Optional. Upload a CV to help project owners understand your
              experience.
            </p>
          </div>

          <div className="profile-setup__field">
            <label htmlFor="resume">Upload CV</label>
            <input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
            />
            <small>PDF, DOC or DOCX. Maximum 10MB.</small>
            {user.resumeUrl && !resumeFile && (
              <a href={user.resumeUrl} target="_blank" rel="noreferrer">
                View current CV
              </a>
            )}
            {resumeFile && <small>Selected: {resumeFile.name}</small>}
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
