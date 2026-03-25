import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/menu
 * Returns all categories and active products with variants/options flag for availability based on ingredients.
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
          include: {
            variants: {
              include: {
                recipes: {
                  include: { ingredient: true }
                }
              }
            },
            options: {
              include: {
                recipes: {
                  include: { ingredient: true }
                }
              }
            }
          }
        }
      }
    });

    const result = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      products: cat.products.map(p => {
        const variants = p.variants.map(v => {
          const isAvailable = v.recipes.every(r => r.ingredient.stockQty >= r.quantity);
          return {
            id: v.id,
            name: v.name,
            price: Number(v.price),
            memberPrice: v.memberPrice ? Number(v.memberPrice) : null,
            sku: v.sku,
            isAvailable
          };
        });

        // Product is available if at least one variant is available, or if it doesn't have variants
        const isAvailable = variants.length > 0 ? variants.some(v => v.isAvailable) : true;

        const options = p.options.map(o => {
          const isOptionAvailable = o.recipes.every(r => r.ingredient.stockQty >= r.quantity);
          return {
            id: o.id,
            name: o.name,
            extraPrice: Number(o.extraPrice),
            isAvailable: isOptionAvailable
          };
        });

        return {
          id: p.id,
          name: p.name,
          description: p.description,
          imageUrl: p.imageUrl,
          isAvailable,
          variants,
          options
        };
      })
    }));

    return NextResponse.json({ categories: result });
  } catch (error) {
    console.error("[GET /api/menu] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu" },
      { status: 500 }
    );
  }
}
