import { db } from "@/utils/db";
import { UserPlan } from "@/utils/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, plan, paymentId } = await req.json();

    // Calculate end date (1 year from now)
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    // Insert new plan
    await db.insert(UserPlan).values({
      userId,
      planName: plan.name,
      planPrice: plan.price,
      credits: parseInt(plan.credits.replace(/,/g, "")),
      endDate,
      paymentId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating plan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update plan" },
      { status: 500 }
    );
  }
}
