import { z } from "zod";
import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description:
    "ส่ง JWT จาก `POST /api/auth/login` หรือ `POST /api/auth/register` ใน header `Authorization: Bearer <token>` หรือ cookie `auth-token`",
});

const Err = z.object({ error: z.string() }).openapi("Error");
const ErrDetails = z
  .object({
    error: z.string(),
    details: z.any().optional(),
  })
  .openapi("ErrorWithDetails");

const bearer = [{ bearerAuth: [] }];

/* -------------------- Auth -------------------- */

registry.registerPath({
  method: "post",
  path: "/api/auth/register",
  tags: ["Auth"],
  summary: "ลงทะเบียนลูกค้า",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z
            .object({
              email: z.string().email(),
              password: z.string().min(8),
              firstName: z.string(),
              lastName: z.string().optional().nullable(),
              phone: z.string().optional().nullable(),
            })
            .openapi("RegisterBody"),
        },
      },
    },
  },
  responses: {
    201: {
      description: "สร้างบัญชีสำเร็จ",
      content: {
        "application/json": {
          schema: z.object({
            token: z.string(),
            user: z.record(z.string(), z.any()),
          }),
        },
      },
    },
    400: {
      description: "ข้อมูลไม่ถูกต้อง / อีเมลซ้ำ",
      content: { "application/json": { schema: Err } },
    },
    500: {
      description: "Server error",
      content: { "application/json": { schema: Err } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/auth/login",
  tags: ["Auth"],
  summary: "เข้าสู่ระบบ",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            email: z.string().email(),
            password: z.string().min(1),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "สำเร็จ",
      content: {
        "application/json": {
          schema: z.object({
            token: z.string(),
            user: z.record(z.string(), z.any()),
          }),
        },
      },
    },
    400: { description: "Validation", content: { "application/json": { schema: ErrDetails } } },
    401: { description: "รหัสผ่านผิด / บัญชีปิด", content: { "application/json": { schema: Err } } },
    500: { description: "Server error", content: { "application/json": { schema: Err } } },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/auth/me",
  tags: ["Auth"],
  summary: "ข้อมูลผู้ใช้จาก JWT",
  security: bearer,
  responses: {
    200: {
      description: "มีหรือไม่มี session",
      content: {
        "application/json": {
          schema: z.object({
            user: z.record(z.string(), z.any()).nullable(),
          }),
        },
      },
    },
    500: { description: "Server error", content: { "application/json": { schema: Err } } },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/auth/logout",
  tags: ["Auth"],
  summary: "ล้าง cookie auth-token",
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": { schema: z.object({ ok: z.boolean() }) },
      },
    },
    500: { description: "Server error", content: { "application/json": { schema: Err } } },
  },
});

/* -------------------- Catalog & inventory -------------------- */

registry.registerPath({
  method: "get",
  path: "/api/categories",
  tags: ["Catalog"],
  summary: "รายการหมวดหมู่ (เรียง sortOrder)",
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: z.object({ categories: z.array(z.record(z.string(), z.any())) }),
        },
      },
    },
    500: { description: "Server error", content: { "application/json": { schema: Err } } },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/products",
  tags: ["Catalog"],
  summary: "รายการสินค้า",
  request: {
    query: z.object({
      categoryId: z.string().uuid().optional(),
      isActive: z.enum(["true", "false"]).optional(),
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: z.object({ products: z.array(z.record(z.string(), z.any())) }),
        },
      },
    },
    400: { description: "Query ไม่ถูกต้อง", content: { "application/json": { schema: Err } } },
    500: { description: "Server error", content: { "application/json": { schema: Err } } },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/products",
  tags: ["Catalog"],
  summary: "สร้างสินค้า (+ variants/options)",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            categoryId: z.string().uuid(),
            name: z.string(),
            description: z.string().optional().nullable(),
            imageUrl: z.string().optional().nullable(),
            isActive: z.boolean().optional(),
            variants: z.array(z.record(z.string(), z.any())).optional(),
            options: z.array(z.record(z.string(), z.any())).optional(),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "สร้างแล้ว",
      content: {
        "application/json": {
          schema: z.object({ product: z.record(z.string(), z.any()) }),
        },
      },
    },
    400: { description: "Bad request", content: { "application/json": { schema: ErrDetails } } },
    401: { description: "Unauthorized", content: { "application/json": { schema: Err } } },
    403: { description: "Forbidden", content: { "application/json": { schema: Err } } },
    500: { description: "Server error", content: { "application/json": { schema: Err } } },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/ingredients",
  tags: ["Inventory"],
  summary: "รายการวัตถุดิบ",
  request: {
    query: z.object({
      lowStock: z.enum(["true", "false"]).optional(),
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: z.object({ ingredients: z.array(z.record(z.string(), z.any())) }),
        },
      },
    },
    400: { description: "Query ไม่ถูกต้อง", content: { "application/json": { schema: Err } } },
    500: { description: "Server error", content: { "application/json": { schema: Err } } },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/inventory/adjust",
  tags: ["Inventory"],
  summary: "ปรับสต็อกด้วยมือ",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            ingredientId: z.string().uuid(),
            type: z.enum(["RESTOCK", "SALE", "WASTE", "ADJUSTMENT"]),
            quantity: z.number(),
            reason: z.string().optional().nullable(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: z.object({
            ingredient: z.record(z.string(), z.any()),
            transaction: z.record(z.string(), z.any()),
          }),
        },
      },
    },
    400: { description: "Bad request", content: { "application/json": { schema: ErrDetails } } },
    401: { description: "Unauthorized", content: { "application/json": { schema: Err } } },
    403: { description: "Forbidden", content: { "application/json": { schema: Err } } },
    500: { description: "Server error", content: { "application/json": { schema: Err } } },
  },
});

/* -------------------- Orders -------------------- */

registry.registerPath({
  method: "get",
  path: "/api/orders",
  tags: ["Orders"],
  summary: "รายการออเดอร์ (ลูกค้าเห็นเฉพาะของตัวเอง)",
  security: bearer,
  request: {
    query: z.object({
      status: z
        .enum(["PENDING", "PREPARING", "READY", "COMPLETED", "CANCELLED"])
        .optional(),
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: z.object({ orders: z.array(z.record(z.string(), z.any())) }),
        },
      },
    },
    400: { description: "Query ไม่ถูกต้อง", content: { "application/json": { schema: Err } } },
    401: { description: "Unauthorized", content: { "application/json": { schema: Err } } },
    500: { description: "Server error", content: { "application/json": { schema: Err } } },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/orders",
  tags: ["Orders"],
  summary: "สร้างออเดอร์",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            type: z.enum(["ONLINE", "POS"]),
            totalAmount: z.union([z.number(), z.string()]),
            items: z.array(
              z.object({
                variantId: z.string().uuid(),
                quantity: z.number().int().positive(),
                priceAtTime: z.union([z.number(), z.string()]),
                options: z.any().optional().nullable(),
              })
            ),
            pickupMethod: z.enum(["SELF_PICKUP", "DELIVERY"]).optional(),
            scheduledAt: z.string().optional().nullable(),
            deliveryAddress: z.string().optional().nullable(),
            customerId: z.string().uuid().optional().nullable(),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "สร้างแล้ว",
      content: {
        "application/json": {
          schema: z.object({ order: z.record(z.string(), z.any()) }),
        },
      },
    },
    400: { description: "Bad request", content: { "application/json": { schema: ErrDetails } } },
    401: { description: "Unauthorized", content: { "application/json": { schema: Err } } },
    403: { description: "Forbidden (เช่น CUSTOMER สร้าง POS)", content: { "application/json": { schema: Err } } },
    500: { description: "Server error", content: { "application/json": { schema: Err } } },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/orders/sync",
  tags: ["Orders"],
  summary: "ซิงก์ออเดอร์ POS แบบ offline (bulk)",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            orders: z.array(z.record(z.string(), z.any())),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "สำเร็จ",
      content: {
        "application/json": {
          schema: z.object({ success: z.boolean(), syncedCount: z.number() }),
        },
      },
    },
    400: { description: "Bad request", content: { "application/json": { schema: ErrDetails } } },
    401: { description: "Unauthorized", content: { "application/json": { schema: Err } } },
    403: { description: "Forbidden", content: { "application/json": { schema: Err } } },
    500: { description: "Server error", content: { "application/json": { schema: Err } } },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/orders/{id}/status",
  tags: ["Orders"],
  summary: "อัปเดตสถานะออเดอร์ (+ BOM เมื่อ COMPLETED)",
  security: bearer,
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            status: z.enum([
              "PENDING",
              "PREPARING",
              "READY",
              "COMPLETED",
              "CANCELLED",
            ]),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: z.object({ order: z.record(z.string(), z.any()) }),
        },
      },
    },
    400: { description: "Insufficient stock / validation", content: { "application/json": { schema: Err } } },
    401: { description: "Unauthorized", content: { "application/json": { schema: Err } } },
    403: { description: "Forbidden", content: { "application/json": { schema: Err } } },
    404: { description: "Order not found", content: { "application/json": { schema: Err } } },
    500: { description: "Server error", content: { "application/json": { schema: Err } } },
  },
});

/* -------------------- Payments & promotions -------------------- */

registry.registerPath({
  method: "get",
  path: "/api/promotions",
  tags: ["Promotions"],
  summary: "โปรโมชันที่ใช้ได้ (ช่วงวันที่ + isActive)",
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: z.object({ promotions: z.array(z.record(z.string(), z.any())) }),
        },
      },
    },
    500: { description: "Server error", content: { "application/json": { schema: Err } } },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/promotions",
  tags: ["Promotions"],
  summary: "สร้างโปรโมชัน",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            code: z.string(),
            description: z.string().optional().nullable(),
            discountValue: z.union([z.number(), z.string()]),
            isPercent: z.boolean(),
            minOrderAmount: z.union([z.number(), z.string()]).optional().nullable(),
            maxUses: z.number().int().positive().optional().nullable(),
            startDate: z.string(),
            endDate: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "สร้างแล้ว",
      content: {
        "application/json": {
          schema: z.object({ promotion: z.record(z.string(), z.any()) }),
        },
      },
    },
    400: { description: "Bad request", content: { "application/json": { schema: ErrDetails } } },
    401: { description: "Unauthorized", content: { "application/json": { schema: Err } } },
    403: { description: "Forbidden", content: { "application/json": { schema: Err } } },
    500: { description: "Server error", content: { "application/json": { schema: Err } } },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/promotions/validate",
  tags: ["Promotions"],
  summary: "ตรวจสอบรหัสโปรกับยอดรวม",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            code: z.string(),
            orderTotalAmount: z.union([z.number(), z.string()]),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "ผลการตรวจ",
      content: {
        "application/json": {
          schema: z.record(z.string(), z.any()),
        },
      },
    },
    400: { description: "Validation", content: { "application/json": { schema: ErrDetails } } },
    401: { description: "Unauthorized", content: { "application/json": { schema: Err } } },
    500: { description: "Server error", content: { "application/json": { schema: Err } } },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/payments",
  tags: ["Payments"],
  summary: "สร้างการชำระเงินสำหรับออเดอร์",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            orderId: z.string().uuid(),
            method: z.enum(["CASH", "QR_CODE", "CREDIT_CARD"]),
            amount: z.union([z.number(), z.string()]),
            pointsUsed: z.number().int().nonnegative().optional().nullable(),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "สร้างแล้ว",
      content: {
        "application/json": {
          schema: z.object({ payment: z.record(z.string(), z.any()) }),
        },
      },
    },
    400: { description: "Bad request", content: { "application/json": { schema: Err } } },
    401: { description: "Unauthorized", content: { "application/json": { schema: Err } } },
    403: { description: "Forbidden", content: { "application/json": { schema: Err } } },
    404: { description: "Order not found", content: { "application/json": { schema: Err } } },
    500: { description: "Server error", content: { "application/json": { schema: Err } } },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/payments/{id}/status",
  tags: ["Payments"],
  summary: "อัปเดตสถานะการชำระ (COMPLETED → order PENDING → PREPARING)",
  security: bearer,
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            status: z.enum(["COMPLETED", "FAILED"]),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: z.object({
            payment: z.record(z.string(), z.any()),
            order: z.record(z.string(), z.any()).nullable(),
          }),
        },
      },
    },
    400: { description: "Bad request", content: { "application/json": { schema: ErrDetails } } },
    401: { description: "Unauthorized", content: { "application/json": { schema: Err } } },
    403: { description: "Forbidden", content: { "application/json": { schema: Err } } },
    404: { description: "Not found", content: { "application/json": { schema: Err } } },
    500: { description: "Server error", content: { "application/json": { schema: Err } } },
  },
});

/* -------------------- Admin -------------------- */

registry.registerPath({
  method: "get",
  path: "/api/dashboard/summary",
  tags: ["Admin"],
  summary: "สรุป dashboard วันนี้",
  security: bearer,
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: z.object({
            dateRange: z.object({
              start: z.string(),
              end: z.string(),
            }),
            totalSales: z.string(),
            totalOrders: z.number(),
            lowStockItems: z.number(),
          }),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: Err } } },
    403: { description: "Forbidden", content: { "application/json": { schema: Err } } },
    500: { description: "Server error", content: { "application/json": { schema: Err } } },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/users",
  tags: ["Admin"],
  summary: "รายชื่อผู้ใช้",
  security: bearer,
  request: {
    query: z.object({
      role: z.enum(["CUSTOMER", "STAFF"]).optional(),
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: z.object({ users: z.array(z.record(z.string(), z.any())) }),
        },
      },
    },
    400: { description: "Query ไม่ถูกต้อง", content: { "application/json": { schema: Err } } },
    401: { description: "Unauthorized", content: { "application/json": { schema: Err } } },
    403: { description: "Forbidden", content: { "application/json": { schema: Err } } },
    500: { description: "Server error", content: { "application/json": { schema: Err } } },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/users/staff",
  tags: ["Admin"],
  summary: "สร้างบัญชี STAFF/ADMIN (เฉพาะ ADMIN)",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            email: z.string().email(),
            password: z.string().min(8),
            firstName: z.string(),
            lastName: z.string().optional().nullable(),
            phone: z.string().optional().nullable(),
            role: z.enum(["STAFF", "ADMIN"]),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "สร้างแล้ว",
      content: {
        "application/json": {
          schema: z.object({ user: z.record(z.string(), z.any()) }),
        },
      },
    },
    400: { description: "Bad request", content: { "application/json": { schema: ErrDetails } } },
    401: { description: "Unauthorized", content: { "application/json": { schema: Err } } },
    403: { description: "Forbidden (ไม่ใช่ ADMIN)", content: { "application/json": { schema: Err } } },
    500: { description: "Server error", content: { "application/json": { schema: Err } } },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/audit-logs",
  tags: ["Admin"],
  summary: "AuditLog + InventoryTransaction ล่าสุดอย่างละ 50",
  security: bearer,
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: z.object({
            auditLogs: z.array(z.record(z.string(), z.any())),
            inventoryTransactions: z.array(z.record(z.string(), z.any())),
          }),
        },
      },
    },
    401: { description: "Unauthorized", content: { "application/json": { schema: Err } } },
    403: { description: "Forbidden", content: { "application/json": { schema: Err } } },
    500: { description: "Server error", content: { "application/json": { schema: Err } } },
  },
});

/* -------------------- Legacy menu (optional) -------------------- */

registry.registerPath({
  method: "get",
  path: "/api/menu",
  tags: ["Menu (legacy)"],
  summary: "เมนู placeholder",
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": { schema: z.object({ items: z.array(z.any()) }) },
      },
    },
    500: { description: "Server error", content: { "application/json": { schema: Err } } },
  },
});

const generator = new OpenApiGeneratorV31(registry.definitions);

/**
 * สร้าง OpenAPI 3.1 document จาก Zod registry (ใช้กับ Scalar)
 */
export function getOpenApiDocument() {
  const serverUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "KAFUNG Coffee Shop API",
      version: "1.0.0",
      description:
        "REST API สำหรับระบบจัดการร้านกาแฟ (Auth, Catalog, Orders, Payments, Admin) — สร้างสเปกจาก Zod ด้วย `@asteasolutions/zod-to-openapi`",
    },
    servers: [{ url: serverUrl, description: "API base" }],
    tags: [
      { name: "Auth", description: "ลงทะเบียน / login / session" },
      { name: "Catalog", description: "หมวดหมู่และสินค้า" },
      { name: "Inventory", description: "วัตถุดิบและการปรับสต็อก" },
      { name: "Orders", description: "ออเดอร์และ BOM" },
      { name: "Promotions", description: "โปรโมชัน" },
      { name: "Payments", description: "การชำระเงิน" },
      { name: "Admin", description: "แดชบอร์ดและผู้ใช้" },
      { name: "Menu (legacy)", description: "เมนูเดิม (placeholder)" },
    ],
  });
}
