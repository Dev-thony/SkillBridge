import { Link } from "react-router-dom";
import {
  UserRound,
  Pencil,
  Settings,
  BriefcaseBusiness,
  Code2,
  Heart,
  // Globe,
  // Github,
  // Linkedin,
  // ExternalLink,
  ArrowUpRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "./ProfilePage.css";

// const socialIcons = {
//   portfolio: Globe,
//   github: Github,
//   linkedin: Linkedin,
//   x: ExternalLink,
// };

const socialLabels = {
  portfolio: "Portfolio",
  website: "Company website",
  github: "GitHub",
  linkedin: "LinkedIn",
  x: "X / Twitter",
};

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function normalizeUrl(url) {
  const trimmedUrl = url.trim();

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  return `https://${trimmedUrl}`;
}

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const links = Object.entries(user.links || {}).filter(
    ([, url]) => typeof url === "string" && url.trim(),
  );

  return (
    <main className="profile-page">
      <div className="profile-page__container">
        <header className="profile-page__header">
          <div>
            <p className="profile-page__eyebrow">YOUR ACCOUNT</p>
            <h1>My Profile</h1>
            <p>Manage your identity and showcase your skills.</p>
          </div>

          <Link to="/profile/setup" className="profile-page__edit-button">
            <Pencil size={17} />
            Edit Profile
          </Link>
        </header>

        <section className="profile-card">
          <div className="profile-card__cover">
            <div className="profile-card__cover-pattern" />
          </div>

          <div className="profile-card__identity">
            <div className="profile-card__avatar">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={`${user.name}'s avatar`} />
              ) : (
                <span>{getInitials(user.name) || <UserRound size={34} />}</span>
              )}
            </div>

            <div className="profile-card__identity-info">
              <h2>{user.name}</h2>

              {user.title ? (
                <p className="profile-card__title">{user.title}</p>
              ) : (
                <p className="profile-card__title">SkillBridge member</p>
              )}

              <span className="profile-card__status">
                <span />
                Member profile
              </span>
            </div>

            <Link to="/settings" className="profile-card__settings-button">
              <Settings size={17} />
              Account Settings
            </Link>
          </div>

          <div className="profile-card__content">
            <section className="profile-section">
              <div className="profile-section__heading">
                <div className="profile-section__icon">
                  <UserRound size={19} />
                </div>
                <h3>About me</h3>
              </div>

              <p className="profile-section__description">
                {user.bio ||
                  "You haven't added a bio yet. Tell other builders about yourself and what you enjoy creating."}
              </p>
            </section>

            <section className="profile-section">
              <div className="profile-section__heading">
                <div className="profile-section__icon">
                  <Code2 size={19} />
                </div>
                <h3>Skills</h3>
                <span className="profile-section__count">
                  {user.skills?.length || 0}
                </span>
              </div>

              {user.skills?.length ? (
                <div className="profile-tags">
                  {user.skills.map((skill) => (
                    <span className="profile-tag" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="profile-section__empty">
                  No skills added yet. Add your skills to help teams discover
                  you.
                </p>
              )}
            </section>

            <section className="profile-section">
              <div className="profile-section__heading">
                <div className="profile-section__icon">
                  <Heart size={19} />
                </div>
                <h3>Interests</h3>
                <span className="profile-section__count">
                  {user.interests?.length || 0}
                </span>
              </div>

              {user.interests?.length ? (
                <div className="profile-tags profile-tags--interests">
                  {user.interests.map((interest) => (
                    <span className="profile-tag" key={interest}>
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="profile-section__empty">
                  No interests added yet. Share the areas you're passionate
                  about.
                </p>
              )}
            </section>

            {(user.contact?.phone || user.contact?.location) && (
              <section className="profile-section">
                <div className="profile-section__heading">
                  <div className="profile-section__icon">
                    <UserRound size={19} />
                  </div>
                  <h3>Contact information</h3>
                </div>

                {user.contact?.phone && (
                  <p>Phone / WhatsApp: {user.contact.phone}</p>
                )}

                {user.contact?.location && (
                  <p>Location: {user.contact.location}</p>
                )}
              </section>
            )}

            <section className="profile-section">
              <div className="profile-section__heading">
                <div className="profile-section__icon">
                  <BriefcaseBusiness size={19} />
                </div>
                <h3>Professional links</h3>
                <span className="profile-section__count">{links.length}</span>
              </div>

              {links.length ? (
                <div className="profile-links">
                  {links.map(([key, url]) => {
                    // const Icon = socialIcons[key] || Globe;

                    return (
                      <a
                        key={key}
                        href={normalizeUrl(url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="profile-link"
                      >
                        <span className="profile-link__icon">
                          {/* <Icon size={19} /> */}
                        </span>

                        <span className="profile-link__label">
                          {socialLabels[key] || key}
                        </span>

                        <ArrowUpRight size={16} />
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p className="profile-section__empty">
                  No professional links added yet. Connect your portfolio or
                  social profiles.
                </p>
              )}
            </section>

            {user.resumeUrl && (
              <section className="profile-section">
                <div className="profile-section__heading">
                  <h3>Resume / CV</h3>
                </div>

                <a
                  href={user.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-link"
                >
                  View my resume / CV
                  <ArrowUpRight size={16} />
                </a>
              </section>
            )}
          </div>

          <footer className="profile-card__footer">
            <div>
              <strong>Keep your profile up to date</strong>
              <p>
                A complete profile helps other builders understand what you
                bring to a team.
              </p>
            </div>

            <Link to="/profile/setup" className="profile-card__footer-link">
              Complete profile
              <ArrowUpRight size={16} />
            </Link>
          </footer>
        </section>

        <section className="profile-page__settings-card">
          <div className="profile-page__settings-icon">
            <Settings size={22} />
          </div>

          <div className="profile-page__settings-info">
            <h3>Account settings</h3>
            <p>
              Manage your appearance preferences, notifications and account.
            </p>
          </div>

          <Link to="/settings" aria-label="Open account settings">
            <ArrowUpRight size={20} />
          </Link>
        </section>
      </div>
    </main>
  );
}
