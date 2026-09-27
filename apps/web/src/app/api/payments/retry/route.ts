import { NextResponse } from "next/server";
import { fluoStore } from "@/lib/server/store";

export async function POST(request: Request) {
  try {
    const { paymentId } = await request.json();
    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID is required" }, { status: 400 });
    }

    const updatedPayment = fluoStore.retryPayment(paymentId);
    return NextResponse.json({ success: true, payment: updatedPayment });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to retry payment" },
      { status: 500 }
    );
  }
}
