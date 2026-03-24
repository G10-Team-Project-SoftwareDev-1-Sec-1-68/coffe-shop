import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // หาเมนูในระบบ (ถ้ามี)
    let variant = await prisma.productVariant.findFirst({
      include: { product: true },
    });

    if (!variant) {
      return NextResponse.json({ error: "ไม่พบสินค้าในระบบ กรุณาเพิ่มสินค้าก่อน" }, { status: 400 });
    }

    const orderNumber = "TKT-" + Math.floor(1000 + Math.random() * 9000);

    const order = await prisma.order.create({
      data: {
        orderNumber: orderNumber,
        totalAmount: variant.price,
        status: "PENDING",
        type: "POS",
        pickupMethod: "SELF_PICKUP",
        items: {
          create: [
            {
              variantId: variant.id,
              quantity: 1,
              priceAtTime: variant.price,
              options: JSON.stringify({ sweetness: 50 }),
            },
          ],
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: `สร้างออเดอร์จำลอง ${orderNumber} สำเร็จ! ให้เปิดหรือรีเฟรชหน้า /pos ได้เลยครับ` 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
