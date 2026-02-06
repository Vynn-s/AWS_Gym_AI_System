import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseServer();
    const body = await req.json();
    const memberId = String(body?.memberId ?? "").trim();

    if (!memberId) {
      return NextResponse.json(
        { ok: false, error: "Member ID is required." },
        { status: 400 }
      );
    }

    // 1) Verify member exists
    const { data: member, error: memberError } = await supabase
      .from("members")
      .select("member_id, full_name")
      .eq("member_id", memberId)
      .single();

    if (memberError || !member) {
      return NextResponse.json(
        { ok: false, error: "Member ID not found." },
        { status: 404 }
      );
    }

    // 2) Check for recent check-in (1-minute cooldown)
    const oneMinAgo = new Date(Date.now() - 1 * 60 * 1000).toISOString();

    const { data: recentCheckin, error: recentError } = await supabase
      .from("checkins")
      .select("checked_in_at")
      .eq("member_id", memberId)
      .gte("checked_in_at", oneMinAgo)
      .order("checked_in_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recentError) {
      return NextResponse.json(
        { ok: false, error: "Failed to verify check-in cooldown." },
        { status: 500 }
      );
    }

    if (recentCheckin) {
      const lastTime = new Date(recentCheckin.checked_in_at).getTime();
      const remainingSec = Math.ceil((lastTime + 1 * 60 * 1000 - Date.now()) / 1000);
      const mins = Math.floor(remainingSec / 60);
      const secs = remainingSec % 60;
      const wait = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

      return NextResponse.json(
        { ok: false, error: `Already checked in recently. Please wait ${wait} before checking in again.` },
        { status: 429 }
      );
    }

    // 3) Insert check-in record
    const { error: insertError } = await supabase.from("checkins").insert({
      member_id: memberId,
      // checked_in_at defaults to now() in DB
    });

    if (insertError) {
      return NextResponse.json(
        { ok: false, error: "Failed to record check-in." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, memberName: member.full_name ?? null });
  } catch (err) {
    console.error("[/api/checkin] Unhandled error:", err);
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }
}

// TODO (later): add rate limiting to prevent spam (public endpoint)
