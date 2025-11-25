"use client";

import { signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const router = useRouter();
  const auth = getAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-height-[60vh] items-center justify-center">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-[0_18px_55px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-x-10 -top-28 h-36 rounded-full bg-gradient-to-b from-rose-400/50 via-rose-500/25 to-transparent blur-3xl" />

          <div className="relative p-6 sm:p-7">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 via-rose-400 to-amber-400 shadow-[0_12px_32px_rgba(248,113,113,0.7)]">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5 text-white"
                >
                  <path
                    d="M10 5a1 1 0 0 1 1-1h7.5a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-.5.5H11a1 1 0 0 1-1-1z"
                    fill="currentColor"
                    opacity="0.7"
                  />
                  <path
                    d="M5.3 12.7 8 15.4a1 1 0 0 0 1.4-1.4L8.4 13H14a1 1 0 0 0 0-2H8.4l1-1A1 1 0 1 0 8 8.6l-2.7 2.7a1 1 0 0 0 0 1.4Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
                Sign out
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Are you sure you want to log out from your account?
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400 px-4 py-2.5 text-sm font-medium text-slate-950 shadow-[0_8px_24px_rgba(248,113,113,0.6)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-rose-400/70 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Log out
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-200 shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-600/70 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
