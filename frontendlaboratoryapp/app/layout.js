import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "./lib/AuthContext";
import HeaderAuthBar from "./components/HeaderAuthBar";
import SidebarNav from "./components/SidebarNav";

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

                  {/* Nav – тепер усередині SidebarNav логіка user / guest */}
                  <SidebarNav />

                  <p className="mt-4 text-[11px] text-slate-500">
                    © {new Date().getFullYear()} Oleh Protsun №15373
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
