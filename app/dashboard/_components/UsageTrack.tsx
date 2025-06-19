"use-client";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { AIOutput } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import React, { useContext, useEffect, useState } from "react";
type HistoryItem = {
  id: number;
  formData: string;
  aiResponse: string | null;
  templateSlug: string;
  createdBy: string;
  createdAt: string | null;
};

function UsageTrack() {
  const { user } = useUser();
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const { totalUsage, setTotalUsage } = useContext(TotalUsageContext);

  useEffect(() => {
    user && GetData();
  }, [user]);

  const GetData = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const result: HistoryItem[] = await db
      .select()
      .from(AIOutput)
      .where(eq(AIOutput.createdBy, user.primaryEmailAddress.emailAddress));

    GetTotalCredits(result);
  };

  const GetTotalCredits = (result: HistoryItem[]) => {
    let totalCredits: number = 0;
    result.forEach((element: HistoryItem) => {
      totalCredits += element.aiResponse
        ? element.aiResponse.trim().split(/\s+/).length
        : 0;
    });

    setTotalCredits(totalCredits);
    console.log(totalCredits);
  };
  return (
    <div>
      <div className="p-3 shadow-md rounded-lg border bg-blue-500 text-white">
        <h2 className="text-lg font-semibold">Credits</h2>
        <div className="h-2 bg-[#baaeea] w-full rounded-full mt-3">
          <div
            className="h-full bg-white rounded-full"
            style={{
              width: `${(totalCredits / 10000) * 100}%`,
            }}
          ></div>
        </div>
        <h2 className="text-sm mt-2">{totalCredits}/10,000 credits used</h2>
      </div>
      <Button
        variant="outline"
        className="w-full mt-3 text-blue-500 cursor-pointer "
      >
        Buy Credits
      </Button>
    </div>
  );
}

export default UsageTrack;
