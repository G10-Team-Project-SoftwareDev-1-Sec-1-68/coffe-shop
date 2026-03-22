import { ApiReference } from "@scalar/nextjs-api-reference";
import { getOpenApiDocument } from "@/lib/openapi-spec";

/**
 * Scalar UI — สเปก OpenAPI สร้างจาก Zod ใน `src/lib/openapi-spec.js`
 * @see GET /api/openapi.json สำหรับดึง JSON ดิบ
 */
export const GET = ApiReference({
  spec: {
    content: getOpenApiDocument(),
  },
  theme: "deepSpace",
  layout: "modern",
  pageTitle: "KAFUNG Coffee Shop API",
});
