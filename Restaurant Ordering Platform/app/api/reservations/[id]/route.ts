import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only administrators can modify reservation statuses" }, { status: 403 });
    }

    const body = await req.json();
    const { status, tableId } = body;

    const updated = await db.reservation.updateStatus(params.id, status, tableId);
    return NextResponse.json({ success: true, reservation: updated, message: "Reservation status updated" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update reservation" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    const cancelled = await db.reservation.cancel(
      params.id,
      user.role === "ADMIN" ? undefined : user.id
    );

    return NextResponse.json({ success: true, reservation: cancelled, message: "Reservation cancelled" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to cancel reservation" }, { status: 400 });
  }
}
