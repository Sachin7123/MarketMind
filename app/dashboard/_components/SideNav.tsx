"use client";
import { FileClock, Home, WalletCards, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import UsageTrack from "./UsageTrack";
import { Card } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { AIOutput } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import useSWR from "swr";

// Fetch credits function
const fetchCredits = async (email: string) => {
  if (!email) return 0;
  const result = await db
    .select()
    .from(AIOutput)
    .where(eq(AIOutput.createdBy, email));
  let totalCredits = 0;
  result.forEach((element) => {
    totalCredits += element.aiResponse
      ? element.aiResponse.trim().split(/\s+/).length
      : 0;
  });
  return totalCredits;
};

function SideNav() {
  const { user } = useUser();
  const creditsTotal = 10000; // This could be made dynamic based on user's plan

  // Use SWR for credits
  const email = user?.primaryEmailAddress?.emailAddress;
  const {
    data: totalCredits = 0,
    error,
    isValidating,
  } = useSWR(email ? ["credits", email] : null, () => fetchCredits(email!), {
    refreshInterval: 60000,
  });

  const MenuList = [
    {
      name: "Home",
      icon: Home,
      path: "/dashboard",
    },
    {
      name: "History",
      icon: FileClock,
      path: "/dashboard/history",
    },
    {
      name: "Billing",
      icon: WalletCards,
      path: "/dashboard/billing",
    },
    {
      name: "Profile",
      icon: User,
      path: "/dashboard/profile",
    },
  ];

  const path = usePathname();

  return (
    <div className="fixed top-0 left-0 h-screen p-5 shadow-sm border-r bg-white dark:bg-gray-800 w-64 flex flex-col justify-between">
      <div>
        <div className="flex justify-center mb-8">
          <Link href="/dashboard">
            <Image src={"/logo.svg"} alt="logo" width={150} height={100} />
          </Link>
        </div>
        <div className="space-y-2">
          {MenuList.map((menu) => (
            <Link href={menu.path} key={menu.name}>
              <div
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                  ${
                    path === menu.path
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-500 dark:text-gray-300 dark:hover:bg-gray-700"
                  }
                `}
              >
                <menu.icon className="h-7 w-7" />
                <h2 className="text-base font-medium">{menu.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div>
        <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl">
          <h3 className="text-base font-semibold text-white mb-2">Credits</h3>
          <div className="h-2 bg-white/30 w-full rounded-full">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{
                width: `${(totalCredits / creditsTotal) * 100}%`,
              }}
            ></div>
          </div>
          <p className="text-md mt-2 text-white font-semibold">
            {isValidating
              ? "Loading..."
              : `${totalCredits}/${creditsTotal} credits used`}
          </p>
          <Link href="/dashboard/billing" className="block mt-4">
            <Button className="w-full bg-white text-[#5B3DF2] hover:bg-white/90">
              Buy Credits
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

export default SideNav;
