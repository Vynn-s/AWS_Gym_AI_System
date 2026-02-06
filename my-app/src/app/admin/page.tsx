"use client";

import React, { useEffect, useState } from "react";
import StatCard from "@/components/ui/StatCard";
import Button from "@/components/ui/Button";

// ── Types for API responses ──────────────────────────────────────────────────
interface StatsData {
  totalToday: number;
  totalWeek: number;
  peakHour: string;
  busiestDay: string;
  lastUpdated: string;
}

interface RecentCheckin {
  memberId: string;
  memberName: string | null;
  checkedInAt: string;
}

export default function AdminPage() {
  // ── Stats state ──────────────────────────────────────────────────────────
  const [stats, setStats] = useState<StatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  // ── Recent check-ins state ───────────────────────────────────────────────
  const [recent, setRecent] = useState<RecentCheckin[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [recentError, setRecentError] = useState("");

  // ── Fetch on mount ───────────────────────────────────────────────────────
  useEffect(() => {
    // Fetch stats
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((json) => {
        if (json.ok) {
          setStats(json);
        } else {
          setStatsError(json.error ?? "Failed to load stats.");
        }
      })
      .catch(() => setStatsError("Network error – could not reach the server."))
      .finally(() => setStatsLoading(false));

    // Fetch recent check-ins
    fetch("/api/admin/recent")
      .then((res) => res.json())
      .then((json) => {
        if (json.ok) {
          setRecent(json.data);
        } else {
          setRecentError(json.error ?? "Failed to load recent check-ins.");
        }
      })
      .catch(() => setRecentError("Network error – could not reach the server."))
      .finally(() => setRecentLoading(false));
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────
  function formatLastUpdated(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

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
          <p className="mt-2 text-xs text-zinc-600">
            {statsLoading
              ? "Loading…"
              : stats
                ? `Last updated: ${formatLastUpdated(stats.lastUpdated)}`
                : "—"}
          </p>
        </div>

        {/* ── Stats grid ───────────────────────────────────────────────── */}
        {statsError && (
          <p className="rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-400">
            {statsError}
          </p>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Check-ins Today"
            value={statsLoading ? "…" : (stats?.totalToday ?? 0)}
            subtitle="Updated just now"
          />
          <StatCard
            title="Check-ins This Week"
            value={statsLoading ? "…" : (stats?.totalWeek ?? 0)}
            subtitle="Last 7 days"
          />
          <StatCard
            title="Peak Hour"
            value={statsLoading ? "…" : (stats?.peakHour ?? "—")}
            subtitle="Based on last 7 days"
          />
          <StatCard
            title="Busiest Day"
            value={statsLoading ? "…" : (stats?.busiestDay ?? "—")}
            subtitle="Based on last 30 days"
          />
        </section>

        {/* ── Attendance History ────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-zinc-100">
            Attendance History
          </h2>

          {recentError && (
            <p className="mb-3 rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-400">
              {recentError}
            </p>
          )}

          {recentLoading ? (
            <p className="text-sm text-zinc-500">Loading recent check-ins…</p>
          ) : recent.length === 0 ? (
            <p className="text-sm text-zinc-500">No check-ins recorded yet.</p>
          ) : (
            <div className="overflow-x-auto overflow-hidden rounded-xl border border-zinc-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900 text-zinc-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">Member ID</th>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium text-right">Checked In At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {recent.map((row, i) => (
                    <tr
                      key={`${row.memberId}-${row.checkedInAt}-${i}`}
                      className="bg-zinc-950 transition-colors hover:bg-zinc-900"
                    >
                      <td className="px-5 py-3 font-mono text-zinc-300">
                        {row.memberId}
                      </td>
                      <td className="px-5 py-3 text-zinc-300">
                        {row.memberName ?? "—"}
                      </td>
                      <td className="px-5 py-3 text-right text-zinc-100 font-medium">
                        {new Date(row.checkedInAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

          <div className="mt-5 flex items-center gap-3">
            <Button disabled>
              Generate Insights
            </Button>
            <span className="text-xs text-zinc-600">
              Coming soon — requires AWS Bedrock integration
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
