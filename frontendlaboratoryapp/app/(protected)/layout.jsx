"use client";

import { useAuth } from "../lib/AuthContext";
import { useLayoutEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useLayoutEffect(() => {
    if (!loading && !user) {
      const encoded = encodeURIComponent(pathname);
      router.push(`/user/signin?returnUrl=${encoded}`);
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return <>{children}</>;
}
