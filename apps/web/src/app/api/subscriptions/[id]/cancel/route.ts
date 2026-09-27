import { NextResponse } from "next/server";
import { fluoStore } from "@/lib/server/store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const {
      reason,
      feedback,
      immediate,
      retentionOffered,
      retentionAccepted,
    } = await request.json();

    const result = fluoStore.cancelSubscription(
      id,
      reason || "Unspecified",
      feedback,
      Boolean(immediate),
      Boolean(retentionOffered),
      Boolean(retentionAccepted)
    );

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
