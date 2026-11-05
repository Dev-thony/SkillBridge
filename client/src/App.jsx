import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";
import ExplorePage from "./pages/ExplorePage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import ProfilePage from "./pages/ProfilePage";
import CreateProjectPage from "./pages/CreateProjectPage";
import OwnerDashboardPage from "./pages/OwnerDashboardPage";
import ApplicantDashboardPage from "./pages/ApplicantDashboardPage";
import SettingsPage from "./pages/SettingsPage";
import PublicProfilePage from "./pages/PublicProfilePage";
import "./styles/not-found.css";

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <span className="not-found-code">404</span>

        <h1>Oops! Page not found.</h1>

        <p>
          The page you're looking for may have been moved, removed, or doesn't
          exist.
        </p>

        <div className="not-found-actions">
          <Link to="/explore" className="not-found-primary">
            Explore projects
          </Link>

          <Link to="/" className="not-found-secondary">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
          <Route path="/users/:userId" element={<PublicProfilePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/projects/new" element={<CreateProjectPage />} />
            <Route
              path="/projects/:projectId/edit"
              element={<CreateProjectPage />}
            />
            <Route path="/dashboard" element={<OwnerDashboardPage />} />
            <Route path="/applications" element={<ApplicantDashboardPage />} />
            <Route path="/profile/setup" element={<ProfileSetupPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
