import { User, Zap, Menu, PenTool } from "lucide-react";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import useSWR from "swr";
import { db } from "@/utils/db";
import { AIOutput } from "@/utils/schema";
import { eq } from "drizzle-orm";

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

function Header() {
  const { user, isLoaded, isSignedIn } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const { data: usedCredits = 0, isValidating } = useSWR(
    email ? ["header-credits", email] : null,
    () => fetchCredits(email!),
    { refreshInterval: 300000 }
  );

  return (
    <div className="bg-white border-b">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="relative">
                <PenTool className="h-6 w-6 text-[#5B3DF2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-600">
                  Content Studio
                </span>
                <span className="text-xs text-gray-400">Create & Manage</span>
              </div>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#5B3DF2]/5">
                <Zap className="h-4 w-4 text-[#5B3DF2]" />
                <span className="text-sm font-medium text-[#5B3DF2]">
                  {isValidating ? "..." : usedCredits.toLocaleString()}
                </span>
              </div>
              <Link href="/dashboard/billing">
                <Button
                  variant="outline"
                  className="border-[#5B3DF2] text-[#5B3DF2] hover:bg-[#5B3DF2] hover:text-white"
                >
                  Upgrade
                </Button>
              </Link>
            </div>

            <Link href="/dashboard/profile">
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                {isLoaded && isSignedIn ? (
                  <>
                    {user?.imageUrl ? (
                      <Image
                        src={user.imageUrl}
                        alt={user.fullName || "User"}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                        priority
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                    )}
                    {/* <span className="text-sm font-medium text-gray-700">
                  {user?.fullName || user?.username || "Profile"}
                </span> */}
                  </>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
