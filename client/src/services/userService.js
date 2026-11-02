export async function deleteMyAccount() {
  const API_URL = import.meta.env.VITE_API_URL || "/api";

  const response = await fetch(`${API_URL}/users/me`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

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
