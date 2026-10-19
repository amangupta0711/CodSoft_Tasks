import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const timeSlot = searchParams.get("timeSlot");
    const guests = searchParams.get("guests");

    if (date && timeSlot && guests) {
      const guestCount = parseInt(guests, 10) || 1;
      const availableTables = await db.table.findAvailable(date, timeSlot, guestCount);
      return NextResponse.json({ success: true, tables: availableTables });
    }

    const allTables = await db.table.findMany();
    return NextResponse.json({ success: true, tables: allTables });
  } catch (error: any) {
    console.error("Error fetching tables:", error);
    return NextResponse.json({ error: "Failed to fetch tables" }, { status: 500 });
  }
}
