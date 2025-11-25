"use client";

import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  getAuth,
} from "firebase/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPageClient() {
  const auth = getAuth();
  const params = useSearchParams();
  const router = useRouter();
  const returnUrl = params.get("returnUrl");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const email = e.target["email"].value;
    const password = e.target["password"].value;
    setError("");

    try {
      await setPersistence(auth, browserSessionPersistence);
      const credentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const loggedUser = credentials.user;

      if (!loggedUser.emailVerified) {
        router.push("/user/verify");
        return;
      }

      if (returnUrl) {
        router.push(returnUrl);
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      setError("Nieprawidłowy email lub hasło.");
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-[0_18px_55px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-x-12 -top-32 h-40 rounded-full bg-gradient-to-b from-sky-500/40 via-indigo-500/25 to-transparent blur-3xl" />

          <div className="relative p-6 sm:p-7">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-violet-500 shadow-[0_12px_32px_rgba(56,189,248,0.7)]">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5 text-white"
                >
                  <path
                    d="M11 5a1 1 0 0 1 1-1h6.5a.5.5 0 0 1 .5.5v14a.5.5 0 0 1-.5.5H12a1 1 0 0 1-1-1z"
                    fill="currentColor"
                    opacity="0.7"
                  />
                  <path
                    d="M4.7 12.7a1 1 0 0 1 0-1.4l3-3a1 1 0 1 1 1.4 1.4L8.4 11H14a1 1 0 0 1 0 2H8.4l.7.7a1 1 0 1 1-1.4 1.4z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
                Sign in
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Log in using the email and password you registered with.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium uppercase tracking-wide text-slate-400"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-50 placeholder-slate-500 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium uppercase tracking-wide text-slate-400"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-50 placeholder-slate-500 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_rgba(56,189,248,0.55)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-sky-400/70 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <a
            href="/user/register"
            className="font-medium text-slate-50 underline-offset-4 hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
