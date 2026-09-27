import { NextResponse } from "next/server";
import { fluoStore } from "@/lib/server/store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { targetPlanId, targetCycle } = await request.json();

    if (!targetPlanId) {
      return NextResponse.json(
        { error: "Target plan ID is required" },
        { status: 400 }
      );
    }

    const result = fluoStore.upgradeSubscription(id, targetPlanId, targetCycle);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to upgrade subscription" },
      { status: 500 }
    );
  }
}
