import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { recordFeePayment } from "@/lib/db";
import { feePaymentSchema } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin privileges required to record payments" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = feePaymentSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const payment = await recordFeePayment({
      invoiceId: validated.data.invoiceId,
      amount: validated.data.amount,
      paymentMethod: validated.data.paymentMethod,
      transactionRef: validated.data.transactionRef,
      notes: validated.data.notes,
      recordedById: session.id,
    });

    return NextResponse.json({ success: true, data: payment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
