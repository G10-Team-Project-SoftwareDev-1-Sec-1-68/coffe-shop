import { ApiReference } from '@scalar/nextjs-api-reference'

// กำหนด OpenAPI Specification (เอาไว้ใช้อธิบาย API ของเรา)
const spec = {
  openapi: '3.1.0',
  info: {
    title: 'KAFUNG Coffee Bar API',
    version: '1.0.0',
    description: 'API Documentation for KAFUNG POS & Online Order System',
  },
  paths: {
    '/api/menu': {
      get: {
        summary: 'ดึงข้อมูลเมนูทั้งหมด',
        tags: ['Menu'],
        responses: {
          '200': {
            description: 'รายการเมนูทั้งหมด (Array)',
          },
        },
      },
      post: {
        summary: 'สร้างเมนูใหม่',
        tags: ['Menu'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Espresso' },
                  price: { type: 'number', example: 45 },
                  category: { type: 'string', example: 'coffee' },
                },
                required: ['name', 'price'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'สร้างเมนูสำเร็จ',
          },
        },
      },
    },
    // TODO: เพิ่ม /api/menu/[id] และ /api/orders ตรงนี้
  },
}

// สร้าง API Route เพื่อเรนเดอร์หน้า HTML ของ Scalar
export const GET = ApiReference({
  spec: {
    content: spec,
  },
  theme: 'deepSpace', // Scalar มี theme สวยๆ ให้เลือก เช่น default, moon, deepSpace, purple
  layout: 'modern',   // เลือกได้ระหว่าง 'modern' หรือ 'classic'
})

