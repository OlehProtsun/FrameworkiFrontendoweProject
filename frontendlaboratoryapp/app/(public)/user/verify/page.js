"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/lib/AuthContext";
import { getAuth, signOut } from "firebase/auth";

export default function VerifyEmailPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");

  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user, email]);

  useEffect(() => {
    const auth = getAuth();
    signOut(auth).catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-[0_18px_55px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-x-12 -top-32 h-40 rounded-full bg-gradient-to-b from-sky-400/45 via-indigo-500/30 to-transparent blur-3xl" />

          <div className="relative p-6 sm:p-7">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-violet-500 shadow-[0_12px_32px_rgba(56,189,248,0.7)]">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5 text-white"
                >
                  <path
                    d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v.5l-8 5-8-5Z"
                    fill="currentColor"
                  />
                  <path
                    d="M4 10.3V17a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-6.7l-7.4 4.6a1.5 1.5 0 0 1-1.6 0Z"
                    fill="currentColor"
                    opacity="0.85"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
                Verify your email
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                We&apos;ve sent a verification link to{" "}
                <span className="font-medium text-slate-100">
                  {email || "your email address"}
                </span>
                . Click the link in the message to activate your account.
              </p>
            </div>

            <p className="text-xs text-slate-500">
              After verifying your email you can safely close this page and log
              in again using the same address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
