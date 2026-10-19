import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const item = await db.menuItem.findById(params.id);
    if (!item) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch menu item" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole(["ADMIN"]);
    const body = await req.json();

    const updated = await db.menuItem.update(params.id, body);
    return NextResponse.json({ success: true, item: updated, message: "Dish updated successfully" });
  } catch (error: any) {
    const status = error.message.includes("Forbidden") || error.message.includes("Unauthorized") ? 403 : 500;
    return NextResponse.json({ error: error.message || "Failed to update menu item" }, { status });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole(["ADMIN"]);
    await db.menuItem.delete(params.id);
    return NextResponse.json({ success: true, message: "Menu item archived successfully without breaking order history" });
  } catch (error: any) {
    const status = error.message.includes("Forbidden") || error.message.includes("Unauthorized") ? 403 : 500;
    return NextResponse.json({ error: error.message || "Failed to delete menu item" }, { status });
  }
}
