import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

function startOfTodayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function daysAgoISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function formatHourLabel(hour24: number) {
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const h12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${h12} ${suffix}`;
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export async function GET() {
  try {
    const supabase = getSupabaseServer();

    // ---- Counts ----
    const todayStart = startOfTodayISO();
    const weekStart = daysAgoISO(7);

    // total today
    const { count: totalToday, error: todayErr } = await supabase
      .from("checkins")
      .select("id", { head: true, count: "exact" })
      .gte("checked_in_at", todayStart);

    if (todayErr) {
      return NextResponse.json({ ok: false, error: "Failed to load today count." }, { status: 500 });
    }

    // total last 7 days
    const { count: totalWeek, error: weekErr } = await supabase
      .from("checkins")
      .select("id", { head: true, count: "exact" })
      .gte("checked_in_at", weekStart);

    if (weekErr) {
      return NextResponse.json({ ok: false, error: "Failed to load week count." }, { status: 500 });
    }

    // ---- Peak Hour (last 7 days) ----
    // We fetch recent checkins and aggregate in JS (simple + beginner-friendly)
    const { data: weekRows, error: weekRowsErr } = await supabase
      .from("checkins")
      .select("checked_in_at")
      .gte("checked_in_at", weekStart)
      .order("checked_in_at", { ascending: true });

    if (weekRowsErr) {
      return NextResponse.json({ ok: false, error: "Failed to load checkins for peak hour." }, { status: 500 });
    }

    const hourCounts = new Array(24).fill(0);
    for (const row of weekRows ?? []) {
      const dt = new Date(row.checked_in_at);
      const hour = dt.getHours();
      hourCounts[hour] += 1;
    }
    let peakHour = "—";
    if ((weekRows?.length ?? 0) > 0) {
      let bestHour = 0;
      for (let h = 1; h < 24; h++) {
        if (hourCounts[h] > hourCounts[bestHour]) bestHour = h;
      }
      peakHour = formatHourLabel(bestHour);
    }

    // ---- Busiest Day (last 30 days) ----
    const monthStart = daysAgoISO(30);
    const { data: monthRows, error: monthErr } = await supabase
      .from("checkins")
      .select("checked_in_at")
      .gte("checked_in_at", monthStart)
      .order("checked_in_at", { ascending: true });

    if (monthErr) {
      return NextResponse.json({ ok: false, error: "Failed to load checkins for busiest day." }, { status: 500 });
    }

    const dayCounts = new Array(7).fill(0);
    for (const row of monthRows ?? []) {
      const dt = new Date(row.checked_in_at);
      const dow = dt.getDay(); // 0=Sun..6=Sat
      dayCounts[dow] += 1;
    }

    let busiestDay = "—";
    if ((monthRows?.length ?? 0) > 0) {
      let bestDay = 0;
      for (let d = 1; d < 7; d++) {
        if (dayCounts[d] > dayCounts[bestDay]) bestDay = d;
      }
      busiestDay = WEEKDAYS[bestDay];
    }

    return NextResponse.json({
      ok: true,
      totalToday: totalToday ?? 0,
      totalWeek: totalWeek ?? 0,
      peakHour,
      busiestDay,
      lastUpdated: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Unexpected server error." }, { status: 500 });
  }
}

// TODO (later): add caching and rate-limiting if this endpoint is exposed publicly.
