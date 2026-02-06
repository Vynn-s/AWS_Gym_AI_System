import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasRegion: Boolean(process.env.AWS_REGION),
    hasAccessKey: Boolean(process.env.AWS_ACCESS_KEY_ID),
    hasSecretKey: Boolean(process.env.AWS_SECRET_ACCESS_KEY),
    hasModelId: Boolean(process.env.BEDROCK_MODEL_ID),
    region: process.env.AWS_REGION ?? null,
    modelId: process.env.BEDROCK_MODEL_ID ?? null,
  });
}
