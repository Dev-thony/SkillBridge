import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";

function PlaceholderPage({ title }) {
  return (
    <main className="container" style={{ paddingBlock: "64px" }}>
      <h1>{title}</h1>
      <p>This screen will be implemented in a later milestone.</p>
    </main>
  );
}

function LandingPage() {
  return (
    <main className="container" style={{ paddingBlock: "64px" }}>
      <p
        style={{
          color: "var(--color-brand)",
          fontSize: "var(--text-sm)",
          fontWeight: 650,
        }}
      >
        A collaboration hub for builders
      </p>

      <h1
        style={{
          maxWidth: "760px",
          fontSize: "var(--text-hero)",
          marginBottom: "24px",
        }}
      >
        Build projects together. Gain real-world experience.
      </h1>

      <p style={{ maxWidth: "600px", color: "var(--color-text-secondary)" }}>
        Find collaborators, contribute your skills, and turn ideas into projects
        you can share with the world.
      </p>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/explore"
          element={<PlaceholderPage title="Explore Projects" />}
        />
        <Route path="/login" element={<PlaceholderPage title="Log in" />} />
        <Route
          path="/register"
          element={<PlaceholderPage title="Create your profile" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
