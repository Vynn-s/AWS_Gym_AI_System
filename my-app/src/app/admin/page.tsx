"use client";

import React from "react";
import StatCard from "@/components/ui/StatCard";
import Button from "@/components/ui/Button";

// ── Mock data ────────────────────────────────────────────────────────────────
// TODO: Replace with real data fetched from Supabase
const mockAttendance = [
  { date: "2026-02-06", checkins: 47 },
  { date: "2026-02-05", checkins: 52 },
  { date: "2026-02-04", checkins: 38 },
  { date: "2026-02-03", checkins: 61 },
  { date: "2026-02-02", checkins: 55 },
  { date: "2026-02-01", checkins: 43 },
  { date: "2026-01-31", checkins: 29 },
];

const todayCheckins = mockAttendance[0].checkins;
const weekCheckins = mockAttendance.reduce((sum, d) => sum + d.checkins, 0);

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* ── Page header ──────────────────────────────────────────────── */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Overview of gym activity and AI insights.
          </p>
        </div>

        {/* ── Stats grid ───────────────────────────────────────────────── */}
        {/* TODO: Fetch real stats from Supabase */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Check-ins Today"
            value={todayCheckins}
            subtitle="Updated just now"
          />
          <StatCard
            title="Check-ins This Week"
            value={weekCheckins}
            subtitle="Last 7 days"
          />
          <StatCard
            title="Peak Hour"
            value="6 – 7 PM"
            subtitle="Placeholder"
          />
          <StatCard
            title="Busiest Day"
            value="Monday"
            subtitle="Placeholder"
          />
        </section>

        {/* ── Attendance Summary ────────────────────────────────────────── */}
        {/* TODO: Replace mock data with Supabase query */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-zinc-100">
            Attendance Summary
          </h2>

          <div className="overflow-hidden rounded-xl border border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900 text-zinc-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium text-right">Check-ins</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {mockAttendance.map((row) => (
                  <tr
                    key={row.date}
                    className="bg-zinc-950 transition-colors hover:bg-zinc-900"
                  >
                    <td className="px-5 py-3 text-zinc-300">{row.date}</td>
                    <td className="px-5 py-3 text-right text-zinc-100 font-medium">
                      {row.checkins}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── AI Insights ──────────────────────────────────────────────── */}
        {/* TODO: Integrate AWS Bedrock / OpenAI for real AI-generated insights */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-semibold text-zinc-100">
            AI-Generated Insights
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Once connected, this section will display AI-powered analysis of
            attendance trends, predicted peak hours, member retention patterns,
            and actionable recommendations to optimise gym operations.
          </p>

          <Button disabled className="mt-5">
            Generate Insights — Coming soon
          </Button>
        </section>
      </div>
    </main>
  );
}
