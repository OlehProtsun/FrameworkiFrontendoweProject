"use client";

import { useState } from "react";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { useAuth } from "@/app/lib/AuthContext";

export default function ChangePasswordPage() {
  const { user } = useAuth();
  const auth = getAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password should be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      setError("No authenticated user. Please sign in again.");
      return;
    }

    setLoading(true);

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );

      await reauthenticateWithCredential(currentUser, credential);

      await updatePassword(currentUser, newPassword);

      setSuccess("Your password has been updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);

      if (err.code === "auth/wrong-password") {
        setError("Current password is incorrect.");
      } else if (err.code === "auth/weak-password") {
        setError("New password is too weak.");
      } else if (err.code === "auth/too-many-requests") {
        setError(
          "Too many attempts. Please try again later or reset your password via email."
        );
      } else {
        setError("Something went wrong while changing the password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-slate-50">
          Change password
        </h1>
        <p className="text-xs text-slate-400">
          Update your account password. You&apos;ll need to enter your current
          password for security reasons.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.9)]">
        {/* Alerts */}
        {error && (
          <div className="mb-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-100">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100">
            {success}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* current password */}
          <div className="space-y-1.5">
            <label
              htmlFor="currentPassword"
              className="text-xs font-medium text-slate-200"
            >
              Current password
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="block w-full rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 outline-none ring-0 transition focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
              placeholder="Enter your current password"
            />
          </div>

          {/* new password */}
          <div className="space-y-1.5">
            <label
              htmlFor="newPassword"
              className="text-xs font-medium text-slate-200"
            >
              New password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 outline-none ring-0 transition focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
              placeholder="Choose a new password"
            />
            <p className="text-[10px] text-slate-500">
              Minimum 6 characters. Use a mix of letters, numbers and symbols.
            </p>
          </div>

          {/* confirm password */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-xs font-medium text-slate-200"
            >
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 outline-none ring-0 transition focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
              placeholder="Repeat the new password"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-4 py-2 text-sm font-medium text-white shadow-[0_10px_30px_rgba(56,189,248,0.55)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-sky-400/70 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Updating password..." : "Change password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
