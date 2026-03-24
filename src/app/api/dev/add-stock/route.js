import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const res = await prisma.ingredient.updateMany({
      data: {
        stockQty: 100
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `เติมสต็อกให้วัตถุดิบทั้งหมด ${res.count} รายการ เรียบร้อยแล้ว! พร้อมทดสอบชำระเงินตัดสต็อก` 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
