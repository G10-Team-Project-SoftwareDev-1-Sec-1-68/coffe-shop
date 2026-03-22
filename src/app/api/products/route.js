import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStaffOrAdmin } from "@/lib/auth";

const decimalLike = z.union([z.number(), z.string()]).transform((v) => String(v));

const ProductVariantInputSchema = z.object({
  name: z.string().trim().min(1).max(200),
  price: decimalLike,
  memberPrice: z.union([decimalLike, z.null()]).optional(),
  sku: z.string().trim().max(100).optional().nullable(),
});

const ProductOptionInputSchema = z.object({
  name: z.string().trim().min(1).max(200),
  extraPrice: z.union([z.number(), z.string()]).optional().default(0),
});

const PostProductSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().max(5000).optional().nullable(),
  imageUrl: z.string().trim().max(2000).optional().nullable(),
  isActive: z.boolean().optional().default(true),
  variants: z.array(ProductVariantInputSchema).optional().default([]),
  options: z.array(ProductOptionInputSchema).optional().default([]),
});

function serializeProduct(product) {
  if (!product) return product;
  return {
    ...product,
    variants: (product.variants ?? []).map((v) => ({
      ...v,
      price: v.price != null ? String(v.price) : null,
      memberPrice: v.memberPrice != null ? String(v.memberPrice) : null,
    })),
    options: (product.options ?? []).map((o) => ({
      ...o,
      extraPrice: o.extraPrice != null ? String(o.extraPrice) : "0",
    })),
  };
}

/**
 * GET /api/products
 * Query: categoryId (uuid), isActive (true|false)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const isActiveRaw = searchParams.get("isActive");

    const where = {};
    if (categoryId) {
      if (!z.string().uuid().safeParse(categoryId).success) {
        return NextResponse.json({ error: "Invalid categoryId" }, { status: 400 });
      }
      where.categoryId = categoryId;
    }
    if (isActiveRaw !== null && isActiveRaw !== "") {
      if (isActiveRaw !== "true" && isActiveRaw !== "false") {
        return NextResponse.json(
          { error: "isActive must be true or false" },
          { status: 400 }
        );
      }
      where.isActive = isActiveRaw === "true";
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: true,
        options: true,
      },
      orderBy: [{ name: "asc" }],
    });

    return NextResponse.json({
      products: products.map(serializeProduct),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * STAFF/ADMIN: create product with optional variants & options in one transaction.
 */
export async function POST(request) {
  const auth = requireStaffOrAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = PostProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      categoryId,
      name,
      description,
      imageUrl,
      isActive,
      variants,
      options,
    } = parsed.data;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 400 });
    }

    const normalizedImage =
      imageUrl && imageUrl.trim() !== "" ? imageUrl.trim() : null;

    const created = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          categoryId,
          name,
          description: description ?? null,
          imageUrl: normalizedImage,
          isActive,
        },
      });

      if (variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((v) => ({
            productId: product.id,
            name: v.name,
            price: v.price,
            memberPrice: v.memberPrice != null ? String(v.memberPrice) : null,
            sku: v.sku?.trim() ? v.sku.trim() : null,
          })),
        });
      }

      if (options.length > 0) {
        await tx.productOption.createMany({
          data: options.map((o) => ({
            productId: product.id,
            name: o.name,
            extraPrice: String(o.extraPrice ?? 0),
          })),
        });
      }

      return tx.product.findUnique({
        where: { id: product.id },
        include: {
          category: true,
          variants: true,
          options: true,
        },
      });
    });

    return NextResponse.json(
      { product: serializeProduct(created) },
      { status: 201 }
    );
  } catch (error) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Unique constraint violation (e.g. duplicate SKU)" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message ?? "Failed to create product" },
      { status: 500 }
    );
  }
}
