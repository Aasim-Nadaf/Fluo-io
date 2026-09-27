import { NextResponse } from "next/server";
import { fluoStore } from "@/lib/server/store";

export async function GET() {
  const subscriptions = fluoStore.getSubscriptions();
  return NextResponse.json({ success: true, subscriptions });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, planId, billingCycle, status, autoRenew } = body;

    if (!customerId || !planId) {
      return NextResponse.json(
        { error: "Customer and Plan selection are required" },
        { status: 400 }
      );
    }

    const result = fluoStore.createSubscription({
      customerId,
      planId,
      billingCycle: billingCycle || "monthly",
      status: status || "active",
      autoRenew: autoRenew !== false,
    });

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create subscription" }, { status: 500 });
  }
}
