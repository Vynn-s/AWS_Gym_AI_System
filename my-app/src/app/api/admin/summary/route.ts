import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

function daysAgoISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function toDateKey(d: Date) {
  // YYYY-MM-DD (local time)
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function GET() {
  try {
    const supabase = getSupabaseServer();
    const start = daysAgoISO(14);

    const { data, error } = await supabase
      .from("checkins")
      .select("checked_in_at")
      .gte("checked_in_at", start)
      .order("checked_in_at", { ascending: true });

    if (error) {
      return NextResponse.json({ ok: false, error: "Failed to load summary data." }, { status: 500 });
    }

    const map = new Map<string, number>();
    for (const row of data ?? []) {
      const key = toDateKey(new Date(row.checked_in_at));
      map.set(key, (map.get(key) ?? 0) + 1);
    }

    // Fill missing days with 0 (nice for charts/tables)
    const out: { date: string; checkins: number }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = toDateKey(d);
      out.push({ date: key, checkins: map.get(key) ?? 0 });
    }

    return NextResponse.json({ ok: true, data: out });
  } catch {
    return NextResponse.json({ ok: false, error: "Unexpected server error." }, { status: 500 });
  }
}
