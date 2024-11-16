"use client";

import { useEffect, useState } from "react";

const FilterBar = ({ setFilter, filter }) => {
  const [filters, setFilters] = useState([]);
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
  return (
    <div className="w-full h-full flex-1 flex flex-col p-4">
      <button
        key={"all"}
        onClick={() => setFilter("all")}
        className={`p-2 bg-transparent text-center rounded-md ${
          "all" === filter ? "text-selectedTextColor" : ""
        }`}
      >
        All
      </button>

      {filters.map((fil) => (
        <button
          key={fil.category_id}
          onClick={() => setFilter(fil.category_id)}
          className={`p-2 bg-transparent text-center rounded-md ${
            fil.category_id === filter ? "text-customerRibbonGreen" : ""
          }`}
        >
          {fil.category_name}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
