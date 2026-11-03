import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  UserRound,
  Sun,
  Moon,
  Monitor,
  Bell,
  Check,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "./SettingsPage.css";

// const NOTIFICATIONS_KEY = "skillbridge-notifications";

export default function SettingsPage() {
  const { user, logout, deleteAccount } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(
    () => localStorage.getItem("skillbridge-notifications") === "true",
  );

  const [loggingOut, setLoggingOut] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function handleThemeChange(value) {
    setTheme(value);
    setSaved(true);
  }

  function handleNotificationChange(enabled) {
    setNotifications(enabled);
    localStorage.setItem("skillbridge-notifications", String(enabled));
    setSaved(true);
  }

  async function handleLogout() {
    try {
      setLoggingOut(true);
      setError("");
      await logout();
      navigate("/", { replace: true });
    } catch {
      setError("Unable to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  async function handleDeleteAccount() {
    if (confirmationText.trim() !== "DELETE") return;

    try {
      setDeleting(true);
      setError("");

      await deleteAccount();

      localStorage.removeItem("skillbridge-notifications");
      setShowDeleteDialog(false);
      navigate("/", { replace: true });
    } catch (deleteError) {
      setError(
        deleteError.message ||
          "Unable to delete your account. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  }
  function closeDeleteDialog() {
    if (deleting) return;

    setShowDeleteDialog(false);
    setConfirmationText("");
    setError("");
  }

  return (
    <main className="settings-page container">
      <header className="settings-page__header">
        <p className="settings-page__eyebrow">ACCOUNT PREFERENCES</p>
        <h1>Settings</h1>
        <p>Personalise your SkillBridge experience.</p>
      </header>

      <section className="settings-page__card">
        <div className="settings-page__account">
          <div className="settings-page__avatar">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" />
            ) : (
              <UserRound size={26} />
            )}
          </div>

          <div className="settings-page__identity">
            <h2>{user?.name || "SkillBridge member"}</h2>
            <p>{user?.email || "Account details"}</p>
          </div>
        </div>

        <section className="settings-section">
          <div className="settings-section__heading">
            <div className="settings-section__icon">
              <Sun size={20} />
            </div>

            <div>
              <h3>Appearance</h3>
              <p>Choose how SkillBridge looks on your device.</p>
            </div>
          </div>

          <div className="settings-theme-options">
            <button
              type="button"
              className={`settings-theme-option ${theme === "light" ? "is-selected" : ""}`}
              aria-pressed={theme === "light"}
              onClick={() => handleThemeChange("light")}
            >
              <Sun size={21} />
              <span>Light</span>
              {theme === "light" && <Check size={17} />}
            </button>

            <button
              type="button"
              className={`settings-theme-option ${theme === "dark" ? "is-selected" : ""}`}
              aria-pressed={theme === "dark"}
              onClick={() => handleThemeChange("dark")}
            >
              <Moon size={21} />
              <span>Dark</span>
              {theme === "dark" && <Check size={17} />}
            </button>

            <button
              type="button"
              className={`settings-theme-option ${theme === "system" ? "is-selected" : ""}`}
              aria-pressed={theme === "system"}
              onClick={() => handleThemeChange("system")}
            >
              <Monitor size={21} />
              <span>System</span>
              {theme === "system" && <Check size={17} />}
            </button>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section__heading">
            <div className="settings-section__icon">
              <Bell size={20} />
            </div>

            <div>
              <h3>Notifications</h3>
              <p>
                Choose whether you want to enable SkillBridge notifications.
              </p>
            </div>
          </div>

          <label className="settings-toggle">
            <span>
              <strong>
                {notifications
                  ? "Notifications enabled"
                  : "Notifications disabled"}
              </strong>

              <small>
                {notifications
                  ? "Your notification preference is turned on."
                  : "Turn this on to enable your notification preference."}
              </small>
            </span>

            <input
              type="checkbox"
              checked={notifications}
              onChange={(event) =>
                handleNotificationChange(event.target.checked)
              }
              aria-label="Enable notifications"
            />

            <span className="settings-toggle__track" aria-hidden="true" />
          </label>
        </section>

        {saved && (
          <p className="settings-page__saved" role="status">
            <Check size={15} />
            Preference saved on this device.
          </p>
        )}

        <div className="settings-page__account-actions">
          {/* LOG OUT */}
          <section className="settings-page__logout">
            <div className="settings-page__action-description">
              <h3>Log out</h3>
              <p>Sign out of your SkillBridge account on this device.</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut || deleting}
            >
              <LogOut size={17} />
              {loggingOut ? "Logging out..." : "Log out"}
            </button>
          </section>

          {/* DELETE ACCOUNT */}
          <section className="settings-page__delete">
            <div className="settings-page__action-description">
              <h3>Delete account</h3>
              <p>
                Permanently delete your SkillBridge account, profile and
                associated account data. This action cannot be undone.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setError("");
                setConfirmationText("");
                setShowDeleteDialog(true);
              }}
              disabled={loggingOut || deleting}
            >
              <Trash2 size={17} />
              Delete Account
            </button>
          </section>

          {error && (
            <p className="settings-page__action-error" role="alert">
              {error}
            </p>
          )}
        </div>
      </section>

      {showDeleteDialog && (
        <div
          className="settings-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteDialog();
            }
          }}
        >
          <section
            className="settings-delete-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
          >
            <button
              type="button"
              className="settings-dialog-close"
              onClick={closeDeleteDialog}
              disabled={deleting}
              aria-label="Close confirmation"
            >
              <X size={20} />
            </button>

            <div className="settings-delete-dialog__icon">
              <AlertTriangle size={25} />
            </div>

            <h2 id="delete-dialog-title">Delete your account?</h2>

            <p>
              You are about to permanently delete your SkillBridge account. Your
              owned projects and associated join requests will also be deleted.
              You will be removed from projects owned by other users.
            </p>

            <label
              className="settings-delete-dialog__label"
              htmlFor="delete-confirmation"
            >
              Type <strong>DELETE</strong> to confirm.
            </label>

            <input
              id="delete-confirmation"
              type="text"
              value={confirmationText}
              onChange={(event) => setConfirmationText(event.target.value)}
              placeholder="Type DELETE"
              autoComplete="off"
              disabled={deleting}
            />

            {error && (
              <p className="settings-delete-dialog__error" role="alert">
                {error}
              </p>
            )}

            <div className="settings-delete-dialog__actions">
              <button
                type="button"
                className="settings-delete-cancel"
                onClick={closeDeleteDialog}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="settings-delete-confirm"
                onClick={handleDeleteAccount}
                disabled={deleting || confirmationText.trim() !== "DELETE"}
              >
                <Trash2 size={16} />
                {deleting ? "Deleting..." : "Permanently delete"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
