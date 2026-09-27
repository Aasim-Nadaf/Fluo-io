import { NextResponse } from "next/server";
import { fluoStore } from "@/lib/server/store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const subscription = fluoStore.reactivateSubscription(id);
    return NextResponse.json({ success: true, subscription });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to reactivate subscription" },
      { status: 500 }
    );
  }
}
