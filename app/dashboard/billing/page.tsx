"use client";
declare global {
  interface Window {
    Razorpay: any;
  }
}
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, CreditCard, Zap } from "lucide-react";
import { db } from "@/utils/db";
import { AIOutput, UserPlan } from "@/utils/schema";
import { eq, and, desc } from "drizzle-orm";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import useSWR from "swr";

type HistoryItem = {
  id: number;
  formData: string;
  aiResponse: string | null;
  templateSlug: string;
  createdBy: string;
  createdAt: string | null;
};

type UserPlanType = {
  planName: string;
  planPrice: number;
  credits: number;
  endDate: Date;
  isActive: boolean;
};

const plans = [
  {
    name: "Basic",
    price: 0,
    credits: "10,000",
    features: [
      "Basic AI content generation",
      "Standard support",
      "Basic templates",
      "Limited usage",
    ],
  },
  {
    name: "Pro",
    price: 1499, // INR
    period: "per year",
    credits: "50,000",
    features: [
      "Advanced AI content generation",
      "Priority support",
      "All templates",
      "Increased usage limits",
      "Custom templates",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: 4999, // INR
    period: "per year",
    credits: "Unlimited",
    features: [
      "Unlimited AI content generation",
      "24/7 dedicated support",
      "Custom AI models",
      "API access",
      "Team collaboration",
      "Advanced analytics",
    ],
  },
];

// Fetch credits function
const fetchCredits = async (email: string) => {
  if (!email) return 0;
  const result: HistoryItem[] = await db
    .select()
    .from(AIOutput)
    .where(eq(AIOutput.createdBy, email));
  let totalCredits = 0;
  result.forEach((element: HistoryItem) => {
    totalCredits += element.aiResponse
      ? element.aiResponse.trim().split(/\s+/).length
      : 0;
  });
  return totalCredits;
};

// Fetch current plan function
const fetchCurrentPlan = async (userId: string) => {
  if (!userId) return null;
  const result = await db
    .select()
    .from(UserPlan)
    .where(and(eq(UserPlan.userId, userId), eq(UserPlan.isActive, true)))
    .orderBy(desc(UserPlan.createdAt))
    .limit(1);
  return result.length > 0 ? result[0] : null;
};

function BillingPage() {
  const { user } = useUser();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Use SWR for credits and plan
  const email = user?.primaryEmailAddress?.emailAddress;
  const userId = user?.id;

  const {
    data: totalUsage = 0,
    error: creditsError,
    isValidating: creditsLoading,
  } = useSWR(email ? ["credits", email] : null, () => fetchCredits(email!), {
    refreshInterval: 300000, // 5 minutes
  });

  const {
    data: currentPlan,
    error: planError,
    isValidating: planLoading,
    mutate: mutatePlan,
  } = useSWR(
    userId ? ["plan", userId] : null,
    () => fetchCurrentPlan(userId!),
    {
      refreshInterval: 300000, // 5 minutes
    }
  );

  const handlePlanSelect = (plan: any) => {
    if (plan.price === 0) return;
    setSelectedPlan(plan);
    setShowPaymentDialog(true);
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const res = await initializeRazorpay();
      if (!res) {
        alert("Razorpay SDK failed to load");
        return;
      }
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        description: `${selectedPlan.name} Plan Subscription`,
        order_id: data.order.id,
        handler: async function (response: any) {
          // Update plan after successful payment
          const updateResponse = await fetch("/api/update-plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user?.id,
              plan: selectedPlan,
              paymentId: response.razorpay_payment_id,
            }),
          });
          if (updateResponse.ok) {
            await mutatePlan();
            alert("Payment successful! Your plan has been updated.");
            setShowPaymentDialog(false);
          } else {
            alert(
              "Payment successful but plan update failed. Please contact support."
            );
          }
        },
        prefill: {
          name: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
        },
        theme: { color: "#2563eb" },
      };
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      alert("Payment failed: " + (error?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Get current plan details
  const getCurrentPlanDetails = () => {
    if (!currentPlan) return plans[0];
    return plans.find((p) => p.name === currentPlan.planName) || plans[0];
  };

  const currentPlanDetails = getCurrentPlanDetails();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Billing & Plans</h1>
          <p className="mt-1 text-sm text-gray-500">
            Choose the perfect plan for your content generation needs
          </p>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white shadow-sm border">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              Current Usage
            </h3>
            <div className="h-2 bg-gray-100 w-full rounded-full">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (Number(totalUsage) /
                      (Number(currentPlanDetails.credits.replace(/,/g, "")) ||
                        10000)) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            <p className="text-sm mt-2 text-gray-600">
              {creditsLoading
                ? "Loading..."
                : creditsError && creditsError.message?.includes("rate limit")
                ? "Rate limit exceeded. Please wait and try again."
                : `${totalUsage}/${currentPlanDetails.credits} credits used`}
            </p>
          </Card>
          <Card className="p-6 bg-white shadow-sm border">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              Current Plan
            </h3>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {currentPlanDetails.name}
            </p>
            <p className="text-sm text-gray-600">
              {currentPlan?.endDate
                ? `Valid until ${new Date(
                    currentPlan.endDate
                  ).toLocaleDateString()}`
                : "Free tier"}
            </p>
          </Card>
          <Card className="p-6 bg-white shadow-sm border">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              Next Billing Date
            </h3>
            <p className="text-2xl font-bold text-gray-700">
              {currentPlan?.endDate
                ? new Date(currentPlan.endDate).toLocaleDateString()
                : "-"}
            </p>
            <p className="text-sm text-gray-600">
              {currentPlan ? "Subscription active" : "No active subscription"}
            </p>
          </Card>
        </div>
        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-6 bg-white shadow-sm border transition-all duration-200 hover:shadow-md relative ${
                plan.name === currentPlanDetails.name ? "border-blue-500" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-1 rounded-full text-sm font-medium shadow-sm">
                  Most Popular
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-500 text-sm">
                      /{plan.period}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {plan.credits} credits
                </p>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handlePlanSelect(plan)}
                className={`w-full ${
                  plan.name === currentPlanDetails.name
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                }`}
                disabled={plan.name === currentPlanDetails.name}
              >
                {plan.name === currentPlanDetails.name
                  ? "Current Plan"
                  : "Upgrade Plan"}
              </Button>
            </Card>
          ))}
        </div>
      </div>
      {/* Payment Dialog */}
      <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to subscribe to the {selectedPlan?.name} plan for ₹
              {selectedPlan?.price}. This will give you access to{" "}
              {selectedPlan?.credits} credits.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={handlePayment}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default BillingPage;
