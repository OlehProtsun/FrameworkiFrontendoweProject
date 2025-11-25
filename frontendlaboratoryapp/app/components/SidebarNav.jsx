"use client";

import { useAuth } from "@/app/lib/AuthContext";
import Link from "next/link";

// Якщо в тебе вже є окремий NavItem – можеш імпортувати його.
// Тут я роблю спрощену версію, дуже схожу на те, що ти вже маєш.
function NavItem({ href, label, children }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-900/70 hover:text-slate-50 transition"
    >
      {children && (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-xl bg-slate-900/80 text-slate-400 group-hover:bg-sky-500/20 group-hover:text-sky-300">
          {children}
        </span>
      )}
      <span className="truncate">{label}</span>
    </Link>
  );
}

export default function SidebarNav() {
  const { user, loading } = useAuth();

  return (
    <nav className="space-y-1">
      {/* завжди доступні пункти */}
      <NavItem href="/" label="Dashboard">
        {/* будь-яка svg-іконка */}
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
          <path
            d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5.5v-5h-3V21H5a1 1 0 0 1-1-1Z"
            fill="currentColor"
          />
        </svg>
      </NavItem>

      <NavItem href="/wordsearch" label="Wordsearch">
        {/* твоя svg для гри */}
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-4 w-4"
        >
          <rect
            x="3.5"
            y="3.5"
            width="13"
            height="13"
            rx="2"
            ry="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M8.5 3.5v13M13 3.5v13M3.5 8.5h13M3.5 13h13"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.7"
          />
          <circle
            cx="18.5"
            cy="18.5"
            r="2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M20 20.5 21.5 22"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </NavItem>

      {/* якщо юзер ще вантажиться – нічого не ховаємо/показуємо */}
      {loading && (
        <div className="pt-2 text-[10px] text-slate-500">
          Checking session...
        </div>
      )}

      {/* коли користувач НЕ залогінений → показуємо Sign in / Register */}
      {!loading && !user && (
        <>
          <div className="pt-3 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Account
          </div>
          <NavItem href="/user/signin" label="Sign in">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
              <path
                d="M12 3a4 4 0 1 1-4 4 4 4 0 0 1 4-4Zm0 10c4.418 0 8 2.015 8 4.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-1.5C4 15.015 7.582 13 12 13Z"
                fill="currentColor"
              />
            </svg>
          </NavItem>
          <NavItem href="/user/register" label="Register">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
              <path
                d="M12 3a4 4 0 1 1-4 4 4 4 0 0 1 4-4Z"
                fill="currentColor"
              />
              <path
                d="M6 15.5C6.842 13.97 8.9 13 12 13c.322 0 .637.014.943.04A6 6 0 0 0 13 15a5.97 5.97 0 0 0 .35 2H5v-1.5c0-.353.083-.693.243-1Z"
                fill="currentColor"
                opacity="0.85"
              />
              <path
                d="M17 14a4 4 0 1 1-4 4 4.002 4.002 0 0 1 4-4Zm0 1.25a.75.75 0 0 0-.75.75v1.25H15a.75.75 0 0 0 0 1.5h1.25V21a.75.75 0 0 0 1.5 0v-1.25H19a.75.75 0 0 0 0-1.5h-1.25V16a.75.75 0 0 0-.75-.75Z"
                fill="currentColor"
              />
            </svg>
          </NavItem>
        </>
      )}

      {/* коли юзер залогінений → замість Sign in / Register інші */}
      {!loading && user && (
        <>
          <div className="pt-3 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Account
          </div>

          <NavItem href="/user/profile" label="Profile">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
              <path
                d="M12 4a4 4 0 1 1-4 4 4 4 0 0 1 4-4Z"
                fill="currentColor"
              />
              <path
                d="M6 18.5C6.842 16.97 8.9 16 12 16s5.158.97 6 2.5V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1Z"
                fill="currentColor"
                opacity="0.85"
              />
            </svg>
          </NavItem>

          <NavItem href="/user/changepassword" label="Change password">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
              <path
                d="M17 10h-1V8a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2ZM10 8a2 2 0 0 1 4 0v2h-4Zm2 9.75a1.25 1.25 0 1 1 1.25-1.25A1.25 1.25 0 0 1 12 17.75Z"
                fill="currentColor"
              />
            </svg>
          </NavItem>

          <NavItem href="/user/signout" label="Sign out">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
              <path
                d="M10 5a1 1 0 0 1 1-1h7.25A1.75 1.75 0 0 1 20 5.75v12.5A1.75 1.75 0 0 1 18.25 20H11a1 1 0 0 1 0-2h7V6h-7a1 1 0 0 1-1-1Z"
                fill="currentColor"
              />
              <path
                d="M5.22 11.47a.75.75 0 0 0 0 1.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L7.81 12.5H14a.75.75 0 0 0 0-1.5H7.81l1.19-1.19a.75.75 0 1 0-1.06-1.06Z"
                fill="currentColor"
              />
            </svg>
          </NavItem>
        </>
      )}
    </nav>
  );
}
