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

  // ── Insights state ───────────────────────────────────────────────────────
  const [insights, setInsights] = useState("");
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState("");

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

  // ── Generate Insights handler ────────────────────────────────────────────
  async function handleGenerateInsights() {
    try {
      setInsightsLoading(true);
      setInsightsError("");
      setInsights("");

      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        setInsightsError(data.error ?? "Failed to generate insights.");
        return;
      }

      setInsights(data.insights ?? "");
    } catch {
      setInsightsError("Network error. Please try again.");
    } finally {
      setInsightsLoading(false);
    }
  }

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
            <div className="dark-scrollbar max-h-[480px] overflow-y-auto overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-zinc-900 text-zinc-400">
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
        {/* TODO: Add caching/cooldown to prevent excessive API calls */}
        {/* TODO: Save generated insights to Supabase for historical reference */}
        {/* TODO: Add citations linking insights back to source data */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm shadow-zinc-900/40">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-100">
              AI-Generated Insights
            </h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                insights
                  ? "bg-emerald-900/40 text-emerald-400 border border-emerald-800"
                  : "bg-zinc-800 text-zinc-400 border border-zinc-700"
              }`}
            >
              {insights ? "Live" : "Ready"}
            </span>
          </div>

          {/* Helper text */}
          <p className="mt-1.5 text-xs text-zinc-500">
            Generates quick trends from the last 14 days of attendance.
          </p>

          {/* Generate button + tip */}
          <div className="mt-5">
            <Button
              onClick={handleGenerateInsights}
              disabled={insightsLoading}
              isLoading={insightsLoading}
            >
              {insightsLoading ? "Generating…" : "Generate Insights"}
            </Button>
            <p className="mt-2 text-xs text-zinc-600">
              Tip: Click once per update to reduce costs.
            </p>
          </div>

          {/* Error state */}
          {insightsError && (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-900/20 border border-red-900/40 px-4 py-3">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-sm text-red-400">{insightsError}</p>
            </div>
          )}

          {/* Loading skeleton */}
          {insightsLoading && (
            <div className="mt-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-xl bg-zinc-800"
                  style={{ width: `${85 - i * 5}%` }}
                />
              ))}
            </div>
          )}

          {/* Empty state (before first generation) */}
          {!insights && !insightsLoading && !insightsError && (
            <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-800/40 py-10 text-center">
              <svg
                className="mb-3 h-8 w-8 text-zinc-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                />
              </svg>
              <p className="text-sm text-zinc-400">
                No insights yet.
              </p>
              <p className="mt-1 text-xs text-zinc-600">
                Click <span className="text-zinc-400">Generate Insights</span>{" "}
                to analyze recent attendance.
              </p>
            </div>
          )}

          {/* Insights list */}
          {insights && !insightsLoading && (
            <ul className="mt-4 space-y-2">
              {insights
                .split("\n")
                .map((line) => line.replace(/^-\s*/, "").trim())
                .filter(Boolean)
                .map((bullet, i) => {
                  const isLimitation =
                    /\blimit(ed|ation)?\b/i.test(bullet) ||
                    /\binsufficient\b/i.test(bullet) ||
                    /\bcaution\b/i.test(bullet);

                  return (
                    <li
                      key={i}
                      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed ${
                        isLimitation
                          ? "border-amber-800/50 bg-amber-900/20 text-amber-300"
                          : "border-zinc-700/60 bg-zinc-800/60 text-zinc-300"
                      }`}
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          isLimitation ? "bg-amber-400" : "bg-emerald-400"
                        }`}
                      />
                      {bullet}
                    </li>
                  );
                })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
