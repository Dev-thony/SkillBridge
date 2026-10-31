import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  clearSessionMarker,
  getCurrentUser,
  hasKnownSession,
  loginUser,
  logoutUser,
  registerUser,
  updateOwnProfile,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => hasKnownSession());

  const refreshUser = useCallback(async () => {
    try {
      const response = await getCurrentUser();

      const currentUser = response.data.user;

      setUser(currentUser);

      return currentUser;
    } catch (error) {
      setUser(null);

      if (error.status !== 401) {
        console.error("Failed to restore authentication:", error);
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasKnownSession()) {
      return;
    }
    // Restore auth state during bootstrap. This intentionally updates state
    // after the user session is checked, and the lint rule is suppressed here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (credentials) => {
    const response = await loginUser(credentials);

    const authenticatedUser = response.data.user;

    setUser(authenticatedUser);

    return authenticatedUser;
  }, []);

  const register = useCallback(async (userData) => {
    const response = await registerUser(userData);

    const authenticatedUser = response.data.user;

    setUser(authenticatedUser);

    return authenticatedUser;
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    const response = await updateOwnProfile(profileData);

    const updatedUser = response.data.user;

    setUser(updatedUser);

    return updatedUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      clearSessionMarker();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
      updateProfile,
    }),
    [user, loading, login, register, logout, refreshUser, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
