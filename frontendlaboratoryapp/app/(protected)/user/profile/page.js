"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/lib/AuthContext";
import { updateProfile } from "firebase/auth";
import { db } from "@/app/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function ProfilePage() {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [addressLoading, setAddressLoading] = useState(true);

  if (!user) {
    return null;
  }

  const initialDisplayName = user.displayName || "";
  const initialPhotoURL = user.photoURL || "";

  useEffect(() => {
    const loadAddress = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          const address = data.address || {};
          setCity(address.city || "");
          setStreet(address.street || "");
          setZipCode(address.zipCode || "");
        } else {
          setCity("");
          setStreet("");
          setZipCode("");
        }
      } catch (err) {
        console.error(err);
        setError("Nie udało się pobrać adresu użytkownika.");
      } finally {
        setAddressLoading(false);
      }
    };

    loadAddress();
  }, [user, db]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const form = e.currentTarget;
    const displayName = form.displayName.value;
    const photoURL = form.photoURL.value;

    try {
      await updateProfile(user, { displayName, photoURL });

      await setDoc(
        doc(db, "users", user.uid),
        {
          address: {
            city,
            street,
            zipCode,
          },
        },
        { merge: true }
      );

      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Nie udało się zaktualizować profilu lub adresu.");
    }
  };

  const firstLetter =
    user.displayName?.[0] || user.email?.[0] || "U";

  const inputsDisabled = addressLoading;

  return (
    <div className="flex min-h-[60vh] items-start justify-center">
      <div className="w-full max-w-xl">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-[0_18px_55px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-x-16 -top-32 h-40 rounded-full bg-gradient-to-b from-sky-500/40 via-indigo-500/25 to-transparent blur-3xl" />

          <div className="relative p-6 sm:p-7">
            {/* Header z avatar + email */}
            <div className="mb-6 flex items-center gap-4">
              {initialPhotoURL ? (
                <img
                  src={initialPhotoURL}
                  alt="Profile avatar"
                  className="h-16 w-16 rounded-2xl border border-white/20 object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-tr from-sky-500 via-indigo-500 to-violet-500 text-xl font-semibold text-white shadow-[0_10px_30px_rgba(56,189,248,0.7)]">
                  {firstLetter.toUpperCase()}
                </div>
              )}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Profile
                </p>
                <p className="text-lg font-semibold text-slate-50">
                  {user.displayName || "Unnamed user"}
                </p>
                <p className="text-sm text-slate-400">{user.email}</p>
              </div>
            </div>

            {/* Alerty */}
            {error && (
              <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                {success}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
              {/* Display name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="displayName"
                  className="block text-xs font-medium uppercase tracking-wide text-slate-400"
                >
                  Display name
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  defaultValue={initialDisplayName}
                  className="block w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-50 placeholder-slate-500 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                  placeholder="Your name"
                />
              </div>

              {/* Email (read-only) */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium uppercase tracking-wide text-slate-400"
                >
                  Email (read-only)
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={user.email || ""}
                  readOnly
                  className="block w-full cursor-not-allowed rounded-2xl border border-slate-800 bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-500"
                />
              </div>

              {/* Photo URL */}
              <div className="space-y-1.5">
                <label
                  htmlFor="photoURL"
                  className="block text-xs font-medium uppercase tracking-wide text-slate-400"
                >
                  Profile photo URL
                </label>
                <input
                  id="photoURL"
                  name="photoURL"
                  type="url"
                  defaultValue={initialPhotoURL}
                  className="block w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-50 placeholder-slate-500 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                  placeholder="https://..."
                />
              </div>

              {/* 🔹 Adres – Zadanie 1 + 4 */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5 sm:col-span-2">
                  <label
                    htmlFor="street"
                    className="block text-xs font-medium uppercase tracking-wide text-slate-400"
                  >
                    Street
                  </label>
                  <input
                    id="street"
                    name="street"
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    disabled={inputsDisabled}
                    className="block w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-50 placeholder-slate-500 shadow-sm disabled:opacity-50 disabled:cursor-wait focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                    placeholder="Street and number"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="zipCode"
                    className="block text-xs font-medium uppercase tracking-wide text-slate-400"
                  >
                    Zip code
                  </label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    disabled={inputsDisabled}
                    className="block w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-50 placeholder-slate-500 shadow-sm disabled:opacity-50 disabled:cursor-wait focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                    placeholder="00-000"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="city"
                  className="block text-xs font-medium uppercase tracking-wide text-slate-400"
                >
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={inputsDisabled}
                  className="block w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-50 placeholder-slate-500 shadow-sm disabled:opacity-50 disabled:cursor-wait focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                  placeholder="Your city"
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_rgba(56,189,248,0.55)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-sky-400/70 focus:ring-offset-2 focus:ring-offset-slate-950"
                disabled={addressLoading}
              >
                {addressLoading ? "Loading address..." : "Save changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
