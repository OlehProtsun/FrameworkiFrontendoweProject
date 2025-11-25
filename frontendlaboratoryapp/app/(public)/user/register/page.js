"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useAuth } from "@/app/lib/AuthContext";

export default function RegisterPage() {
  const { user } = useAuth();
  const auth = getAuth();
  const router = useRouter();

  const [registerError, setRegisterError] = useState("");

  if (user) {
    return null;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setRegisterError("");

    const form = e.currentTarget;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      setRegisterError("Hasła nie są takie same.");
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("User registered!", result.user);

      await sendEmailVerification(auth.currentUser);
      console.log("Email verification sent!");

      router.push("/user/verify");
    } catch (error) {
      console.dir(error);

      if (error.code === "auth/email-already-in-use") {
        setRegisterError(
          "Konto z tym adresem email już istnieje. Użyj innego adresu lub zaloguj się."
        );
      } else {
        setRegisterError(error.message);
      }
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-[0_18px_55px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-x-12 -top-32 h-40 rounded-full bg-gradient-to-b from-emerald-400/40 via-sky-500/25 to-transparent blur-3xl" />

          <div className="relative p-6 sm:p-7">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-400 via-sky-500 to-indigo-500 shadow-[0_12px_32px_rgba(45,212,191,0.7)]">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5 text-white"
                >
                  <path
                    d="M12 3a4 4 0 1 1-4 4 4 4 0 0 1 4-4Zm0 10c3.866 0 7 1.79 7 4v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-1c0-2.21 3.134-4 7-4Z"
                    fill="currentColor"
                  />
                  <path
                    d="M19 5h2v2h-2v2h-2V7h-2V5h2V3h2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
                Create account
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Sign up with your email and password.
              </p>
            </div>

            {/* Alert błędu rejestracji */}
            {registerError && (
              <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {registerError}
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
                  className="block w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-50 placeholder-slate-500 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
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
                  className="block w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-50 placeholder-slate-500 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-medium uppercase tracking-wide text-slate-400"
                >
                  Repeat password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="block w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-50 placeholder-slate-500 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-400 via-sky-500 to-indigo-500 px-4 py-2.5 text-sm font-medium text-slate-950 shadow-[0_8px_24px_rgba(45,212,191,0.55)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-emerald-300/80 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Create account
              </button>
            </form>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <a
            href="/user/signin"
            className="font-medium text-slate-50 underline-offset-4 hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
