"use client";

import { useEffect, useState } from "react";
import filterIcon from "@public/icons/filter_icon.png";
import closeIcon from "@public/icons/close_icon.png";
import Image from "next/image";

const FilterBar = ({ setFilter, filter }) => {
  const [filters, setFilters] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetch("/api/admin/category");
        const data = await response.json();
        if (response.ok) {
          setFilters(Array.isArray(data?.categories) ? data.categories : []);
        } else {
          setFilters([]);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setFilters([]);
      }
    };
    getCategories();
  }, []);

  const applyFilter = () => {
    if (selectedFilter) {
      setFilter(selectedFilter);
      setIsExpanded(false);
    }
  };

  return (
    <div className="relative">
      {/* Filter Icon Bar (on mobile only) */}
      <div
        className="flex items-center justify-center p-4 bg-gray-200 cursor-pointer md:hidden"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Image src={filterIcon} alt="filterIcon" height={20} width={20} />
      </div>

      {/* Expanded Filter Options (takes up full screen on mobile) */}
      {isExpanded && (
        <div
          className="absolute left-0 top-0 z-10 w-full h-screen p-4 bg-white shadow-lg"
          style={{ background: "white", zIndex: 10 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Image
              src={closeIcon}
              className="text-gray-500 cursor-pointer"
              onClick={() => setIsExpanded(false)}
              alt="closeIcon"
              height={20}
              width={20}
            />
          </div>

          <button
            key={"all"}
            onClick={() => setSelectedFilter("all")}
            className={`p-2 text-left rounded-md w-full ${
              selectedFilter === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            All
          </button>

          {filters.map((fil) => (
            <button
              key={fil.category_id}
              onClick={() => setSelectedFilter(fil.category_id)}
              className={`p-2 text-left rounded-md w-full ${
                selectedFilter === fil.category_id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {fil.category_name}
            </button>
          ))}

          <button
            onClick={applyFilter}
            disabled={!selectedFilter}
            className={`mt-4 p-2 w-full rounded-md ${
              selectedFilter
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Apply Filter
          </button>
        </div>
      )}

      {/* Desktop View */}
      <div className="hidden md:flex flex-col p-4 w-full h-full">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <button
          key={"all"}
          onClick={() => setFilter("all")}
          className={`p-2 text-center rounded-md font-semibold ${
            filter === "all" ? "text-selectedTextColor" : "text-black"
          }`}
        >
          All
        </button>

        {filters.map((fil) => (
          <button
            key={fil.category_id}
            onClick={() => setFilter(fil.category_id)}
            className={`p-2 text-center font-semibold ${
              filter === fil.category_id
                ? "text-selectedTextColor"
                : "text-black"
            }`}
          >
            {fil.category_name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
