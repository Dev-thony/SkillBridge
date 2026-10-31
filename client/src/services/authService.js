const API_URL = import.meta.env.VITE_API_URL || "/api";

const SESSION_MARKER = "skillbridge_has_session";

export function hasKnownSession() {
  return localStorage.getItem(SESSION_MARKER) === "true";
}

function markSessionActive() {
  localStorage.setItem(SESSION_MARKER, "true");
}

export function clearSessionMarker() {
  localStorage.removeItem(SESSION_MARKER);
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.error?.message || data.message || "Request failed",
    );

    error.status = response.status;
    error.code = data.error?.code;

    throw error;
  }

  return data;
}

export async function registerUser(userData) {
  const response = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

  markSessionActive();
  return response;
}

export async function loginUser(credentials) {
  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  markSessionActive();
  return response;
}

export async function logoutUser() {
  try {
    return await apiRequest("/auth/logout", {
      method: "POST",
    });
  } finally {
    clearSessionMarker();
  }
}

export async function getCurrentUser() {
  try {
    return await apiRequest("/auth/me");
  } catch (error) {
    if (error.status === 401) {
      clearSessionMarker();
    }

    throw error;
  }
}

export function updateOwnProfile(profileData) {
  return apiRequest("/users/me", {
    method: "PATCH",
    body: JSON.stringify(profileData),
  });
}

export function getPublicUser(userId) {
  return apiRequest(`/users/${encodeURIComponent(userId)}`);
}
