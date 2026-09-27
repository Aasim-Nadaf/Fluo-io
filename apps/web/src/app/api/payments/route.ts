import { NextResponse } from "next/server";
import { fluoStore } from "@/lib/server/store";

export async function GET() {
  const payments = fluoStore.getPayments();
  return NextResponse.json({ success: true, payments });
}
