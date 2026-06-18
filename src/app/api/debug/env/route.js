import { NextResponse } from "next/server";

// ⚠️ TEMPORARY DEBUG ENDPOINT — ลบออกหลังแก้บัคเสร็จ
export async function GET() {
  const url = process.env.DATABASE_URL;
  return NextResponse.json({
    hasUrl: !!url,
    urlPreview: url ? url.substring(0, 30) + "..." : "NOT SET",
    nodeEnv: process.env.NODE_ENV,
  });
}
