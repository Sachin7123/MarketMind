"use client";
import React from "react";
import SideNav from "./_components/SideNav";
import Header from "./_components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <SideNav />
      <main className="flex-1 ml-64 h-screen overflow-y-auto">
        <Header />
        {children}
      </main>
    </div>
  );
}
