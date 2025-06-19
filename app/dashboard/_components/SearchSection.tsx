import { Search } from "lucide-react";
import React from "react";

function SearchSection({ onSearchInput }: any) {
  return (
    <div className="p-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex flex-col justify-center items-center text-white">
      <h2 className="text-3xl font-bold">Browse All Templates</h2>
      <p>What would you like to create today?</p>
      <div className="w-full flex justify-center">
        <div className="flex gap-2 items-center p-2 border rounded-md bg-white my-5 w-[45%]">
          <Search className="text-blue-500" />
          <input
            type="text"
            placeholder="Search templates..."
            onChange={(e) => onSearchInput(e.target.value)}
            className="outline-none bg-transparent w-full text-black"
          />
        </div>
      </div>
    </div>
  );
}

export default SearchSection;
