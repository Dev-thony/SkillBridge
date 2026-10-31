import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";
import ExplorePage from "./pages/ExplorePage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

function PlaceholderPage({ title }) {
  return (
    <main className="container" style={{ paddingBlock: "64px" }}>
      <h1>{title}</h1>
      <p>This screen will be implemented in a later milestone.</p>
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
            <Route
              path="/profile/setup"
              element={<PlaceholderPage title="Complete your profile" />}
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
