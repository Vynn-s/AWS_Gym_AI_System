 import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

/**
 * GET /api/admin/recent
 * Returns the most recent check-ins (default: last 30).
 * Each row includes member_id, checked_in_at, and the member's name if available.
 */
export async function GET() {
  try {
    const supabase = getSupabaseServer();

    // Try fetching with the member name via a foreign-key join.
    // If the "name" column doesn't exist on members, fall back to member_id only.
    const { data, error } = await supabase
      .from("checkins")
      .select("member_id, checked_in_at, members(name)")
      .order("checked_in_at", { ascending: false })
      .limit(30);

    if (error) {
      // Fallback: the join failed (e.g. "name" column doesn't exist).
      const { data: fallback, error: fbErr } = await supabase
        .from("checkins")
        .select("member_id, checked_in_at")
        .order("checked_in_at", { ascending: false })
        .limit(30);

      if (fbErr) {
        return NextResponse.json(
          { ok: false, error: "Failed to load recent check-ins." },
          { status: 500 },
        );
      }

      const rows = (fallback ?? []).map((r) => ({
        memberId: r.member_id,
        memberName: null as string | null,
        checkedInAt: r.checked_in_at,
      }));

      return NextResponse.json({ ok: true, data: rows });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = (data ?? []).map((r: any) => ({
      memberId: r.member_id,
      memberName: r.members?.name ?? null,
      checkedInAt: r.checked_in_at,
    }));

    return NextResponse.json({ ok: true, data: rows });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 },
    );
  }
}
