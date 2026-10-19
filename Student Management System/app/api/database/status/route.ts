import { NextResponse } from "next/server";
import { getDatabaseStatus } from "@/lib/db";

export async function GET() {
  const status = await getDatabaseStatus();
  return NextResponse.json(status);
}
