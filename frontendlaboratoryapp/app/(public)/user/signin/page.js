import { Suspense } from "react";
import SignInPageClient from "./SignInClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-slate-300">
          Loading sign in…
        </div>
      }
    >
      <SignInPageClient />
    </Suspense>
  );
}
