import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.NEXT_PUBLIC_RAZORPAY_SECRET_KEY!,
});

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();

    // Ensure price is a number (in INR)
    if (typeof plan.price !== "number" || plan.price <= 0) {
      throw new Error("Invalid plan price");
    }

    const options = {
      amount: plan.price * 100, // Convert INR to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        plan: plan.name,
        credits: plan.credits,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
