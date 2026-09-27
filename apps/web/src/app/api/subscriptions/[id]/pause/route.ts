import { NextResponse } from "next/server";
import { fluoStore } from "@/lib/server/store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { action, durationDays } = body;

    let subscription;
    if (action === "resume") {
      subscription = fluoStore.resumeSubscription(id);
    } else {
      subscription = fluoStore.pauseSubscription(id, Number(durationDays) || 30);
    }

    return NextResponse.json({ success: true, subscription });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update pause status" },
      { status: 500 }
    );
  }
}
