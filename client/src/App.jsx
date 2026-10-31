import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
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

function NotFoundPage() {
  return (
    <main className="container" style={{ paddingBlock: "64px" }}>
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/explore">Explore projects</a>
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
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/projects/new" element={<CreateProjectPage />} />
            <Route path="/dashboard" element={<OwnerDashboardPage />} />
            <Route path="/applications" element={<ApplicantDashboardPage />} />
            <Route path="/profile/setup" element={<ProfileSetupPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
