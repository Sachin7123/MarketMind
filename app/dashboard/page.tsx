"use client";
import React, { useState } from "react";
import SearchSection from "./_components/SearchSection";
import TemplateListSection from "./_components/TemplateListSection";

function Dashboard() {
  const [userSearchInput, setUserSearchInput] = useState<string>();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <SearchSection
            onSearchInput={(value: string) => setUserSearchInput(value)}
          />
          <div className="mt-8">
            <TemplateListSection userSearchInput={userSearchInput} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
