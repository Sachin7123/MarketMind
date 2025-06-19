"use client";
import React, { useEffect, useState } from "react";
import Templates from "@/app/(data)/Templates";
import { TEMPLATE } from "../_components/TemplateListSection";

type HistoryItem = {
  id: number;
  templateSlug: string;
  aiResponse: string;
  createdAt: string;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch("/api/history")
      .then(async (res) => {
        const text = await res.text();
        if (!text) return []; // or handle as needed
        return JSON.parse(text);
      })
      .then((data) => setHistory(data));
  }, []);

  const getTemplateDetails = (slug: string): TEMPLATE | undefined =>
    Templates.find((t) => t.slug === slug);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  function downloadCSV(history: HistoryItem[]) {
    const header = "Template,AI Response,Date\n";
    const rows = history.map((item) =>
      [
        `"${item.templateSlug.replace(/"/g, '""')}"`,
        `"${(item.aiResponse || "").replace(/"/g, '""')}"`,
        `"${item.createdAt}"`,
      ].join(",")
    );
    const csvContent = header + rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "history.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadItem(item: HistoryItem) {
    const content = `Template: ${item.templateSlug}\nDate: ${item.createdAt}\n\nAI Response:\n${item.aiResponse}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `history-${item.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">History</h1>
          <p className="mt-1 text-sm text-gray-500">
            View your past AI content generations
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-4">
          <button
            className="px-4 py-2 text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition"
            onClick={() => downloadCSV(history)}
            disabled={history.length === 0}
          >
            Download All as CSV
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Template
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    AI Response
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Words
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Copy
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Download
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((item) => {
                  const template = getTemplateDetails(item.templateSlug);
                  const isExpanded = expandedIds.has(item.id);
                  const wordCount = item.aiResponse.trim().split(/\s+/).length;
                  const formattedDate =
                    new Date(item.createdAt).toString() !== "Invalid Date"
                      ? new Date(item.createdAt).toLocaleString()
                      : item.createdAt;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-2 text-blue-600 font-medium">
                        {template?.icon && (
                          <img
                            src={template.icon}
                            alt={template.name}
                            className="w-5 h-5"
                          />
                        )}
                        <span>{template?.name || item.templateSlug}</span>
                      </td>
                      <td className="px-6 py-4 max-w-xl whitespace-pre-wrap break-words text-gray-900">
                        {isExpanded
                          ? item.aiResponse
                          : item.aiResponse.slice(0, 100) +
                            (wordCount > 20 ? "..." : "")}
                        {wordCount > 20 && (
                          <button
                            className="ml-2 text-blue-500 hover:text-blue-600 underline text-sm cursor-pointer"
                            onClick={() => toggleExpand(item.id)}
                          >
                            {isExpanded ? "Show less" : "Show more"}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {formattedDate}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                          {wordCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          className="text-blue-600 hover:text-blue-800 focus:outline-none cursor-pointer transition-colors duration-150"
                          onClick={() =>
                            navigator.clipboard.writeText(item.aiResponse)
                          }
                          title="Copy full response"
                        >
                          📋
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          className="text-green-600 hover:text-green-800 focus:outline-none cursor-pointer transition-colors duration-150"
                          onClick={() => downloadItem(item)}
                          title="Download this response"
                        >
                          ⬇️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
