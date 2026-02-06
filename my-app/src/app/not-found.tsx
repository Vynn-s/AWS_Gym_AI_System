import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-lg shadow-zinc-950/40">
        <p className="text-5xl font-bold text-zinc-600">404</p>

        <h1 className="mt-4 text-xl font-semibold tracking-tight text-zinc-100">
          Page not found
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-100 shadow-sm shadow-zinc-900/20 transition-colors duration-150 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
