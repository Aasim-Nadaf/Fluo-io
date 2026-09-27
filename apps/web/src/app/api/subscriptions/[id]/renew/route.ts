import { NextResponse } from "next/server";
import { fluoStore } from "@/lib/server/store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = fluoStore.processRenewal(id);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process renewal" },
      { status: 500 }
    );
  }
}
