"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/AuthContext";

export default function HeaderAuthBar() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-2xl bg-slate-800/60 animate-pulse" />
        <div className="h-7 w-24 rounded-xl bg-slate-800/60 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Link
          href="/user/register"
          className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-slate-100 shadow-sm hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-sky-500/60 focus:ring-offset-1 focus:ring-offset-slate-950"
        >
          Register
        </Link>
        <Link
          href="/user/signin"
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-3 py-1.5 text-xs font-medium text-white shadow-[0_8px_24px_rgba(56,189,248,0.55)] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-sky-400/70 focus:ring-offset-1 focus:ring-offset-slate-950"
        >
          Sign in
        </Link>
      </>
    );
  }

  const initial =
    (user.displayName?.[0] || user.email?.[0] || "U").toUpperCase();

  return (
    <>
      {/* Маленький бейдж профілю */}
        <button
        type="button"
        onClick={() => router.push("/user/profile")}
        className="hidden sm:inline-flex items-center gap-1.5 rounded-2xl border border-white/15 bg-white/[0.03] pl-1.5 pr-2.5 py-1.5 text-xs text-slate-100 hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-sky-500/60 focus:ring-offset-1 focus:ring-offset-slate-950"
        >
        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-violet-500 text-[0.75rem] font-semibold text-white overflow-hidden">
            {user.photoURL ? (
            <img
                src={user.photoURL}
                alt="User avatar"
                className="h-full w-full object-cover"
            />
            ) : (
            initial
            )}
        </div>
        <div className="flex flex-col items-start leading-tight">
            <span className="max-w-[110px] truncate text-[0.7rem] font-medium">
            {user.displayName || "User"}
            </span>
            <span className="max-w-[140px] truncate text-[0.65rem] text-slate-400">
            {user.email}
            </span>
        </div>
        </button>

      {/* Кнопка Sign out */}
      <Link
        href="/user/signout"
        className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400 px-3 py-1.5 text-xs font-medium text-slate-950 shadow-[0_6px_20px_rgba(248,113,113,0.6)] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-rose-400/70 focus:ring-offset-1 focus:ring-offset-slate-950"
      >
        Sign out
      </Link>
    </>
  );
}
