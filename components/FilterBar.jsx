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
    <div className="flex flex-col w-fit gap-2 flex-1 h-full min-w-[12rem] ">
      <span className="text-lg font-semibold p-4">Filters</span>
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
            filter === fil.category_id ? "text-selectedTextColor" : "text-black"
          }`}
        >
          {fil.category_name}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
