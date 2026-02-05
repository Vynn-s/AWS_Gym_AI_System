import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="rounded-2xl border p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Next + Tailwind is working ✅</h1>
        <p className="mt-2 text-gray-600">Ready to connect Supabase.</p>
      </div>
    </main>
  );
}
