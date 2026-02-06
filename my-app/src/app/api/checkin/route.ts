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
      .select("member_id")
      .eq("member_id", memberId)
      .single();

    if (memberError || !member) {
      return NextResponse.json(
        { ok: false, error: "Member ID not found." },
        { status: 404 }
      );
    }

    // 2) Insert check-in record
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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/checkin] Unhandled error:", err);
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }
}

// TODO (later): add rate limiting to prevent spam (public endpoint)
