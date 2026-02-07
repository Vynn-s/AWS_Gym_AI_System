import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
            GymSight by Jervin
            <span className="ml-2 text-base font-medium text-zinc-500">
              (Live App)
            </span>
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            A cloud-powered attendance system with AI insights.
          </p>
        </div>

        {/* Navigation cards */}
        <div className="grid gap-4">
          <Link
            href="/checkin"
            className="group rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-6 shadow-sm shadow-zinc-950/40 transition-colors duration-150 hover:border-zinc-600 hover:bg-zinc-800"
          >
            <h2 className="text-lg font-semibold text-zinc-100 group-hover:text-white">
              Member Check-In
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Scan your QR code or enter your Member ID.
            </p>
          </Link>

          <Link
            href="/admin"
            className="group rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-6 shadow-sm shadow-zinc-950/40 transition-colors duration-150 hover:border-zinc-600 hover:bg-zinc-800"
          >
            <h2 className="text-lg font-semibold text-zinc-100 group-hover:text-white">
              Admin Dashboard
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              View attendance stats and AI-generated insights.
            </p>
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-xs text-zinc-600">
          Built with Next.js, Tailwind CSS &amp; Supabase, and powered by AWS Bedrock generative AI.
        </p>
      </div>
    </main>
  );
}
