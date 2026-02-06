import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

function daysAgoISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function toDateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatHourLabel(hour24: number) {
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const h12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${h12} ${suffix}`;
}

export async function POST() {
  try {
    const region = process.env.AWS_REGION;
    const modelId = process.env.BEDROCK_MODEL_ID;

    if (!region || !modelId) {
      return NextResponse.json({ ok: false, error: "Missing AWS env vars." }, { status: 500 });
    }

    // 1) Pull last 14 days of checkins
    const supabase = getSupabaseServer();
    const start = daysAgoISO(14);
    const { data, error } = await supabase
      .from("checkins")
      .select("checked_in_at")
      .gte("checked_in_at", start)
      .order("checked_in_at", { ascending: true });

    if (error) {
      return NextResponse.json({ ok: false, error: "Failed to load attendance data." }, { status: 500 });
    }

    const rows = data ?? [];
    if (rows.length === 0) {
      return NextResponse.json({
        ok: true,
        insights:
          "No recent check-in data found yet. Once members start checking in, I’ll generate trend insights here.",
      });
    }

    // 2) Compute simple summary stats
    const perDay = new Map<string, number>();
    const hourCounts = new Array(24).fill(0);

    for (const r of rows) {
      const dt = new Date(r.checked_in_at);
      perDay.set(toDateKey(dt), (perDay.get(toDateKey(dt)) ?? 0) + 1);
      hourCounts[dt.getHours()] += 1;
    }

    const total = rows.length;
    const daysWithData = perDay.size;
    const avgPerDay = total / Math.max(1, daysWithData);

    let bestHour = 0;
    for (let h = 1; h < 24; h++) if (hourCounts[h] > hourCounts[bestHour]) bestHour = h;

    let topDay = "";
    let topDayCount = 0;
    for (const [day, count] of perDay.entries()) {
      if (count > topDayCount) {
        topDayCount = count;
        topDay = day;
      }
    }

    const prompt = `You are an analytics engine for a gym attendance dashboard. Given ONLY the data below, produce exactly 5 bullet points — no more, no less.

Data (last 14 days):
- Total check-ins: ${total}
- Days with data: ${daysWithData}
- Average check-ins per active day: ${avgPerDay.toFixed(1)}
- Peak hour: ${formatHourLabel(bestHour)}
- Busiest date: ${topDay} (${topDayCount} check-ins)

Rules:
1. Output exactly 5 lines, each starting with "- ".
2. Bullets 1–4 are insights. Bullet 5 is a data limitation.
3. Each bullet is one concise sentence.
4. Use a professional, neutral analytics tone.
5. Do NOT include any headings, labels, or section titles.
6. Do NOT restate the instructions or the data summary.
7. Do NOT use markdown formatting other than "- " bullets.
8. Do NOT speculate beyond the data provided.
9. Do NOT use phrases like "based on the provided summary" or "according to the data".
10. Output nothing before or after the 5 bullets.`;

    // 3) Call Bedrock (Claude Haiku)
    const client = new BedrockRuntimeClient({ region });

    const body = JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 250,
      temperature: 0.3,
      messages: [{ role: "user", content: prompt }],
    });

    const command = new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: new TextEncoder().encode(body),
    });

    const resp = await client.send(command);
    const json = JSON.parse(new TextDecoder().decode(resp.body));

    const insightsText =
      json?.content?.map((c: { text?: string }) => c?.text).filter(Boolean).join("\n").trim() || "No insights returned.";

    return NextResponse.json({ ok: true, insights: insightsText });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate insights.";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}

// TODO (later): add caching/cooldown to control cost, and guardrails for safer outputs.
