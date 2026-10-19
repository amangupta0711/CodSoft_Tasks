import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, requireAuth } from "@/lib/auth";
import { orderCheckoutSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const orderType = searchParams.get("orderType") || undefined;

    // Kitchen staff and Admin can see all orders
    if (user?.role === "ADMIN" || user?.role === "STAFF") {
      const orders = await db.order.findMany({ status, orderType });
      return NextResponse.json({ success: true, orders });
    }

    // Customer can see their own orders
    if (user?.role === "CUSTOMER") {
      const orders = await db.order.findMany({ userId: user.id, status, orderType });
      return NextResponse.json({ success: true, orders });
    }

    return NextResponse.json({ error: "Please log in to view orders" }, { status: 401 });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Require authentication before placing an order
    const user = await requireAuth();
    const body = await req.json();

    const parsed = orderCheckoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const order = await db.order.create({
      userId: user.id,
      customerName: parsed.data.customerName,
      customerEmail: parsed.data.customerEmail || user.email,
      contactNumber: parsed.data.contactNumber,
      orderType: parsed.data.orderType,
      paymentMethod: parsed.data.paymentMethod,
      deliveryAddress: parsed.data.deliveryAddress,
      specialInstructions: parsed.data.specialInstructions,
      items: parsed.data.items,
    });

    return NextResponse.json(
      {
        success: true,
        order,
        message: `Order #${order.orderNumber} placed successfully!`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating order:", error);
    const status = error.message.includes("Unauthorized") ? 401 : 400;
    return NextResponse.json({ error: error.message || "Failed to place order" }, { status });
  }
}
