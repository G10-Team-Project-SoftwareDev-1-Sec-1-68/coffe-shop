import { NextResponse } from "next/server";
import { getOpenApiDocument } from "@/lib/openapi-spec";

/**
 * GET /api/openapi.json — OpenAPI 3.1 (สร้างจาก Zod registry)
 * ใช้กับ Postman, codegen, หรือ Scalar แบบ external spec
 */
export async function GET() {
  try {
    const doc = getOpenApiDocument();
    return NextResponse.json(doc, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to generate OpenAPI document" },
      { status: 500 }
    );
  }
}
