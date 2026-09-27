import { NextResponse } from "next/server";
import { fluoStore } from "@/lib/server/store";

export async function GET() {
  const renewals = fluoStore.getRenewals();
  return NextResponse.json({ success: true, renewals });
}
