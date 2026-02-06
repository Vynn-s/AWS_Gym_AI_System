import { NextResponse } from "next/server";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

export async function GET() {
  try {
    const region = process.env.AWS_REGION;
    const modelId = process.env.BEDROCK_MODEL_ID;

    if (!region || !modelId) {
      return NextResponse.json({ ok: false, error: "Missing AWS env vars" }, { status: 500 });
    }

    const client = new BedrockRuntimeClient({ region });

    const body = JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: "Give one short sentence about gym attendance insights.",
        },
      ],
    });

    const command = new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: new TextEncoder().encode(body),
    });

    const response = await client.send(command);
    const json = JSON.parse(new TextDecoder().decode(response.body));

    const text =
      json?.content
        ?.map((c: { text?: string }) => c?.text)
        .join("") ?? "No response text";

    return NextResponse.json({ ok: true, text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Bedrock call failed";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
