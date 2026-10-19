import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { orderNumber: string } }) {
  try {
    const orderNumber = params.orderNumber.trim();
    const order = await db.order.findByOrderNumber(orderNumber);

    if (!order) {
      return NextResponse.json({ error: `Order #${orderNumber} not found` }, { status: 404 });
    }

    const user = await getCurrentUser();
    // If order has an assigned user and current user is logged in as another customer, protect it
    if (order.userId && user && user.role === "CUSTOMER" && order.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized access to this order" }, { status: 403 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Error tracking order:", error);
    return NextResponse.json({ error: "Failed to track order" }, { status: 500 });
  }
}
