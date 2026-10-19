import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { menuItemSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("category") || undefined;
    const vegParam = searchParams.get("vegetarian");
    const search = searchParams.get("search") || undefined;
    const sortBy = searchParams.get("sortBy") || undefined;

    const isVegetarian = vegParam === "true" ? true : vegParam === "false" ? false : undefined;

    const [categories, items] = await Promise.all([
      db.category.findMany(),
      db.menuItem.findMany({ categoryId, isVegetarian, search, sortBy }),
    ]);

    return NextResponse.json({
      success: true,
      categories,
      items,
      count: items.length,
    });
  } catch (error: any) {
    console.error("Error fetching menu:", error);
    return NextResponse.json({ error: "Failed to load menu items" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Only Admin can create new menu items
    await requireRole(["ADMIN"]);

    const body = await req.json();
    const parsed = menuItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newItem = await db.menuItem.create(parsed.data);
    return NextResponse.json({ success: true, item: newItem, message: "Menu item created successfully" }, { status: 201 });
  } catch (error: any) {
    const status = error.message.includes("Forbidden") || error.message.includes("Unauthorized") ? 403 : 500;
    return NextResponse.json({ error: error.message || "Failed to create menu item" }, { status });
  }
}
