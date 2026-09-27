import { NextResponse } from "next/server";
import { fluoStore } from "@/lib/server/store";

export async function GET() {
  const metrics = fluoStore.getMetrics();
  return NextResponse.json({ success: true, metrics });
}
