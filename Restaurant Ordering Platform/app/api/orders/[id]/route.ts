import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { orderStatusSchema } from "@/lib/validation";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    const order = await db.order.findById(params.id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Authorization check
    if (user.role === "CUSTOMER" && order.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized access to order" }, { status: 403 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    const status = error.message.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json({ error: error.message || "Failed to fetch order" }, { status });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    if (user.role !== "STAFF" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only kitchen staff or administrators can update order status" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = orderStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid status transition", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await db.order.updateStatus(params.id, parsed.data.status);
    return NextResponse.json({ success: true, order: updated, message: `Order status updated to ${parsed.data.status}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update order status" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    const cancelled = await db.order.cancel(
      params.id,
      user.role === "ADMIN" ? undefined : user.id
    );

    return NextResponse.json({
      success: true,
      order: cancelled,
      message: `Order #${cancelled.orderNumber} has been successfully cancelled.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to cancel order" }, { status: 400 });
  }
}
