"use client";

import { useEffect, useState } from "react";

const FilterBar = ({ setFilter, filter }) => {
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetch("/api/admin/category");
        const data = await response.json();
        setFilters(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setFilters([]);
      }
    };
    getCategories();
  }, []);

  return (
    <div className="flex flex-col w-fit gap-2 flex-1 h-full min-w-[12rem] ">
      <span className="text-lg font-semibold p-4">Filters</span>

      <div className="flex px-4 flex-col gap-2">
        <span>By Category</span>
        <div className="grid gap-1 w-full grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]">
          <button
            onClick={() => setFilter("all")}
            className={`p-2 text-center font-semibold  rounded-sm ${
              filter === "all"
                ? "bg-mainButtonColor text-white"
                : "text-black bg-gray-200"
            }`}
          >
            All
          </button>
          {filters.map((fil) => (
            <button
              key={fil.category_id}
              onClick={() => setFilter(fil.category_id)}
              className={`p-2 text-center font-semibold rounded-sm ${
                filter === fil.category_id
                  ? "bg-mainButtonColor text-white"
                  : "text-black bg-gray-200"
              }`}
            >
              {fil.category_name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
