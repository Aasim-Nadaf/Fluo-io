import { NextResponse } from "next/server";
import { fluoStore } from "@/lib/server/store";

export async function GET() {
  const plans = fluoStore.getPlans();
  return NextResponse.json({ success: true, plans });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description, monthlyPrice, yearlyPrice, features, maxUsers, maxProjects } = body;

    if (!name || monthlyPrice === undefined) {
      return NextResponse.json(
        { error: "Name and monthly price are required" },
        { status: 400 }
      );
    }

    const newPlan = fluoStore.createPlan({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      description: description || "",
      monthlyPrice: Number(monthlyPrice),
      yearlyPrice: Number(yearlyPrice || monthlyPrice * 10),
      currency: "USD",
      features: Array.isArray(features) ? features : ["Feature 1", "Feature 2"],
      maxUsers: Number(maxUsers) || 10,
      maxProjects: Number(maxProjects) || 20,
    });

    return NextResponse.json({ success: true, plan: newPlan }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create plan" }, { status: 500 });
  }
}
