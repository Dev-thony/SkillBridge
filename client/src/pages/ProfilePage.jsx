import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <main className="container" style={{ paddingBlock: "48px" }}>
      <section
        style={{
          maxWidth: "760px",
          marginInline: "auto",
          padding: "32px",
          border: "1px solid var(--color-border, #e5e7eb)",
          borderRadius: "16px",
        }}
      >
        <h1>{user.name}</h1>

        {user.title && <h2>{user.title}</h2>}

        <p>{user.bio || "This user has not added a bio yet."}</p>

        <h3>Skills</h3>
        {user.skills?.length ? (
          <ul>
            {user.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        ) : (
          <p>No skills added yet.</p>
        )}

        <h3>Interests</h3>
        {user.interests?.length ? (
          <ul>
            {user.interests.map((interest) => (
              <li key={interest}>{interest}</li>
            ))}
          </ul>
        ) : (
          <p>No interests added yet.</p>
        )}

        <h3>Links</h3>
        <ul>
          {Object.entries(user.links || {})
            .filter(([, url]) => Boolean(url))
            .map(([label, url]) => (
              <li key={label}>
                <a href={url} target="_blank" rel="noreferrer">
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                </a>
              </li>
            ))}
        </ul>

        <Link to="/profile/setup">Edit profile</Link>
      </section>
    </main>
  );
}
