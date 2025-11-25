// app/not-found.js
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">404 – Strona nie istnieje</h1>
      <p>Nie znaleziono żądanej ścieżki.</p>
      <Link
        href="/"
        className="px-4 py-2 border rounded hover:bg-gray-100"
      >
        Wróć na stronę główną
      </Link>
    </div>
  );
}
