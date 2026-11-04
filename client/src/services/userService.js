const API_URL = import.meta.env.VITE_API_URL || "/api";

export async function deleteMyAccount() {
  let response;

  try {
    response = await fetch(`${API_URL}/users/me`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    throw new Error(
      navigator.onLine === false
        ? "You appear to be offline. Reconnect and try again."
        : "Unable to connect to SkillBridge. Please try again.",
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.error?.message || data.message || "Unable to delete your account.",
    );

    error.status = response.status;
    error.code = data.error?.code;

    throw error;
  }

  return data;
}

export async function getPublicUser(userId) {
  if (!userId) {
    throw new Error("A user ID is required.");
  }

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const response = await fetch(
    `${apiUrl}/users/${encodeURIComponent(userId)}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Unable to load this user's profile.");
  }

  return data.user || data;
}