import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { reservationSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const date = searchParams.get("date") || undefined;

    // If Admin, can view all
    if (user?.role === "ADMIN") {
      const reservations = await db.reservation.findMany({ status, date });
      return NextResponse.json({ success: true, reservations });
    }

    // If logged in customer, only view own
    if (user) {
      const reservations = await db.reservation.findMany({ userId: user.id, status, date });
      return NextResponse.json({ success: true, reservations });
    }

    return NextResponse.json({ error: "Please log in to view your reservations" }, { status: 401 });
  } catch (error: any) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();

    const parsed = reservationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const reservation = await db.reservation.create({
      ...parsed.data,
      userId: user?.id,
    });

    return NextResponse.json(
      {
        success: true,
        reservation,
        message: `Table booked successfully! Your reservation reference is ${reservation.reservationNumber}.`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating reservation:", error);
    return NextResponse.json({ error: error.message || "Failed to book table" }, { status: 400 });
  }
}
