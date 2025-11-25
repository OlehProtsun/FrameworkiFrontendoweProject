import "./globals.css";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "./lib/AuthContext";
import HeaderAuthBar from "./components/HeaderAuthBar";


const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata = {
  title: "Frontend Laboratory App",
  description: "Next.js + Firebase lab",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950`}
      >
        <AuthProvider>
          <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
            <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-10">
              {/* SIDEBAR */}
              <aside className="order-2 lg:order-1 lg:w-72">
                <div className="sticky top-6 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_22px_80px_rgba(15,23,42,0.85)] backdrop-blur-2xl">
                  {/* Brand */}
                  <div className="mb-6 flex items-center gap-3">
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-violet-500 shadow-[0_12px_35px_rgba(56,189,248,0.55)]">
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-5 w-5 text-white"
                      >
                        <path
                          d="M5 7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v10.5a.5.5 0 0 1-.8.4L15 15.5l-3.2 2.4a.5.5 0 0 1-.6 0L8 15.5l-3.2 2.4a.5.5 0 0 1-.8-.4z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-50">
                        Frontend Laboratory
                      </p>
                      <p className="text-xs text-slate-400">
                        Next.js · Firebase · Preline
                      </p>
                    </div>
                  </div>

                  {/* Nav */}
                  <nav className="space-y-6 text-sm">
                    <div>
                      <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Public
                      </p>
                      <div className="space-y-1.5">
                        <NavItem href="/" label="Home">
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="h-4 w-4"
                          >
                            <path
                              d="M4 11.5 12 4l8 7.5V19a1 1 0 0 1-1 1h-4.5a.5.5 0 0 1-.5-.5v-4h-4v4a.5.5 0 0 1-.5.5H5a1 1 0 0 1-1-1z"
                              fill="currentColor"
                            />
                          </svg>
                        </NavItem>

                        <NavItem href="/user/signin" label="Sign in">
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="h-4 w-4"
                          >
                            <path
                              d="M11 5a1 1 0 0 1 1-1h6.5a.5.5 0 0 1 .5.5v14a.5.5 0 0 1-.5.5H12a1 1 0 0 1-1-1z"
                              fill="currentColor"
                              opacity="0.6"
                            />
                            <path
                              d="M4.7 12.7a1 1 0 0 1 0-1.4l3-3a1 1 0 1 1 1.4 1.4L8.4 11H14a1 1 0 0 1 0 2H8.4l.7.7a1 1 0 0 1-1.4 1.4z"
                              fill="currentColor"
                            />
                          </svg>
                        </NavItem>

                        <NavItem href="/user/register" label="Register">
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="h-4 w-4"
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
                        </NavItem>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Protected
                      </p>
                      <div className="space-y-1.5">
                        <NavItem href="/user/profile" label="Profile">
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="h-4 w-4"
                          >
                            <path
                              d="M12 4a4 4 0 1 1-4 4 4 4 0 0 1 4-4Zm0 9c4.418 0 8 2.015 8 4.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-1.5C4 15.015 7.582 13 12 13Z"
                              fill="currentColor"
                            />
                          </svg>
                        </NavItem>

                        <NavItem
                          href="/user/changepassword"
                          label="Change password"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="h-4 w-4"
                          >
                            <path
                              d="M7 10V8a5 5 0 0 1 10 0v2h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Zm2 0h6V8a3 3 0 0 0-6 0Z"
                              fill="currentColor"
                            />
                          </svg>
                        </NavItem>

                        <NavItem href="/user/signout" label="Sign out" danger>
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="h-4 w-4"
                          >
                            <path
                              d="M10 5a1 1 0 0 1 1-1h7.5a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-.5.5H11a1 1 0 0 1-1-1z"
                              fill="currentColor"
                              opacity="0.6"
                            />
                            <path
                              d="M5.3 12.7 8 15.4a1 1 0 0 0 1.4-1.4L8.4 13H14a1 1 0 0 0 0-2H8.4l1-1a1 1 0 1 0-1.4-1.4l-2.7 2.7a1 1 0 0 0 0 1.4Z"
                              fill="currentColor"
                            />
                          </svg>
                        </NavItem>
                      </div>
                    </div>
                  </nav>

                  <p className="mt-4 text-[11px] text-slate-500">
                    © {new Date().getFullYear()} FrontendLaboratoryApp
                  </p>
                </div>
              </aside>

              {/* MAIN CARD */}
              <div className="order-1 flex-1 lg:order-2">
                <div className="flex min-h-[calc(100vh-3rem)] flex-col rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_22px_80px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
                  {/* Top bar */}
                  <header className="border-b border-white/10">
                    <div className="flex h-16 items-center justify-between px-5 sm:px-7">
                      <div className="flex items-center gap-2 lg:hidden">
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-violet-500">
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="h-4 w-4 text-white"
                          >
                            <path
                              d="M5 7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v10.5a.5.5 0 0 1-.8.4L15 15.5l-3.2 2.4a.5.5 0 0 1-.6 0L8 15.5l-3.2 2.4a.5.5 0 0 1-.8-.4z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-slate-50">
                          Frontend Lab
                        </span>
                      </div>

                      <div className="ml-auto flex items-center gap-2">
                         <HeaderAuthBar />
                      </div>
                    </div>
                  </header>

                  {/* Content */}
                  <section className="flex-1">
                    <div className="h-full px-5 py-7 sm:px-7 sm:py-8">
                      {children}
                    </div>
                  </section>

                  {/* Footer */}
                  <footer className="border-t border-white/10 px-5 py-3 text-xs text-slate-400 sm:px-7">
                    <span className="text-slate-500">
                      Built with Next.js 14 · Tailwind CSS · Firebase
                    </span>
                  </footer>
                </div>
              </div>
            </div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

/**
 * Reusable nav item component (inline in same file)
 */
function NavItem({ href, label, children, danger }) {
  const base =
    "group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors";
  const color = danger
    ? "text-rose-200 hover:bg-rose-500/10 hover:text-rose-50"
    : "text-slate-200 hover:bg-white/[0.06] hover:text-white";

  const iconWrapper = danger
    ? "flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-400/30 text-rose-300 group-hover:bg-rose-500/20 group-hover:text-rose-100"
    : "flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 group-hover:bg-white/[0.08] group-hover:text-white";

  return (
    <Link href={href} className={`${base} ${color}`}>
      <span className={iconWrapper}>{children}</span>
      <span className="text-sm">{label}</span>
    </Link>
  );
}
