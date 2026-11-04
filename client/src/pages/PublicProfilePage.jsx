import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, UserRound } from "lucide-react";
import { getPublicUser } from "../services/userService";
import "./PublicProfilePage.css";

export default function PublicProfilePage() {
  const { userId } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        setLoading(true);
        const result = await getPublicUser(userId);

        if (active) setProfile(result);
      } catch (loadError) {
        if (active) {
          setError(loadError.message || "Unable to load this profile.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, [userId]);

  if (loading) return <main className="container">Loading profile...</main>;

  if (error || !profile) {
    return (
      <main className="container">
        <h1>Profile unavailable</h1>
        <p role="alert">{error || "This profile could not be found."}</p>
        <Link to="/explore">Back to projects</Link>
      </main>
    );
  }

  const links = Object.entries(profile.links || {}).filter(
    ([, value]) => typeof value === "string" && value.trim(),
  );

  return (
    <main className="public-profile-page container">
      <Link to="/dashboard">
        <ArrowLeft size={16} /> Back
      </Link>

      <section className="public-profile-card">
        <div className="public-profile-card__identity">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.name} />
          ) : (
            <UserRound size={48} />
          )}

          <div>
            <h1>{profile.name}</h1>
            <p>{profile.title || "SkillBridge member"}</p>
          </div>
        </div>

        <h2>About</h2>
        <p>{profile.bio || "No biography has been added."}</p>

        {(profile.contact?.phone || profile.contact?.location) && (
          <>
            <h2>Contact information</h2>

            {profile.contact.phone && (
              <p>Phone / WhatsApp: {profile.contact.phone}</p>
            )}

            {profile.contact.location && (
              <p>Location: {profile.contact.location}</p>
            )}
          </>
        )}

        {profile.skills?.length > 0 && (
          <>
            <h2>Skills</h2>
            <div className="public-profile-tags">
              {profile.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </>
        )}

        {profile.interests?.length > 0 && (
          <>
            <h2>Interests</h2>
            <div className="public-profile-tags">
              {profile.interests.map((interest) => (
                <span key={interest}>{interest}</span>
              ))}
            </div>
          </>
        )}

        {links.length > 0 && (
          <>
            <h2>Professional links</h2>
            {links.map(([key, url]) => (
              <a key={key} href={url} target="_blank" rel="noopener noreferrer">
                {key} <ExternalLink size={14} />
              </a>
            ))}
          </>
        )}

        {profile.resumeUrl && (
          <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
            View resume / CV <ExternalLink size={14} />
          </a>
        )}
      </section>
    </main>
  );
}
