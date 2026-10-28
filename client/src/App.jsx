import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import LandingPage from "./pages/LandingPage";
import ExplorePage from "./pages/ExplorePage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";

function PlaceholderPage({ title }) {
  return (
    <main className="container" style={{ paddingBlock: "64px" }}>
      <h1>{title}</h1>
      <p>This screen will be implemented in a later milestone.</p>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/explore" element={<ExplorePage />} />

        <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />

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
