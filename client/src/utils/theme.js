export const THEME_KEY = "skillbridge-theme";

export function applyTheme(selectedTheme) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const activeTheme =
    selectedTheme === "system"
      ? prefersDark
        ? "dark"
        : "light"
      : selectedTheme;

  document.documentElement.dataset.theme = activeTheme;
}

export function initializeTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "system";

  applyTheme(savedTheme);

  const media = window.matchMedia("(prefers-color-scheme: dark)");

  media.addEventListener("change", () => {
    if (localStorage.getItem(THEME_KEY) === "system") {
      applyTheme("system");
    }
  });
}
