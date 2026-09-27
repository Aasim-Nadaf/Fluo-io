import { NextResponse } from "next/server";
import { fluoStore } from "@/lib/server/store";

export async function POST(request: Request) {
  try {
    const { paymentId, refundAmount, reason } = await request.json();
    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID is required" }, { status: 400 });
    }

    const updatedPayment = fluoStore.refundPayment(
      paymentId,
      refundAmount ? Number(refundAmount) : undefined,
      reason
    );
    return NextResponse.json({ success: true, payment: updatedPayment });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process refund" },
      { status: 500 }
    );
  }
}
