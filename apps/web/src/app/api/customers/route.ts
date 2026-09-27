import { NextResponse } from "next/server";
import { fluoStore } from "@/lib/server/store";

export async function GET() {
  const customers = fluoStore.getCustomers();
  return NextResponse.json({ success: true, customers });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, country, currency, paymentMethod } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const customer = fluoStore.createCustomer({
      name,
      email,
      company: company || "Independent",
      country: country || "United States",
      currency: currency || "USD",
      status: "active",
      paymentMethod: paymentMethod || {
        brand: "visa",
        last4: String(Math.floor(1000 + Math.random() * 9000)),
        expMonth: 12,
        expYear: 2028,
      },
    });

    return NextResponse.json({ success: true, customer }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create customer" }, { status: 500 });
  }
}
