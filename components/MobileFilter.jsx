"use client";
import Image from "next/image";
import FilterIcon from "@public/icons/filter_icon.png";
import closeIcon from "@public/icons/close_icon.png";
import { useEffect, useState } from "react";
const MobileFilter = ({ setFilter, selectedFilter }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState([]);
  const [localFilter, setLocalFilter] = useState(selectedFilter);
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

  const handleSelectFilter = () => {
    setFilter(localFilter);
    setIsExpanded(false);
  };
  return (
    <>
      <div
        className="object-cover"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <Image src={FilterIcon} height={30} width={40} alt="filter_icon" />
      </div>
      {isExpanded && (
        <div className="h-[calc(100vh-8rem)] w-[70vw] absolute top-[4rem] right-0 bg-white flex flex-col ">
          <div className="flex py-2 px-4 justify-center items-center">
            <span className="mr-auto font-semibold text-xl">Filter</span>
            <div
              className="object-cover"
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              <Image src={closeIcon} height={30} width={40} alt="close_icon" />
            </div>
          </div>
          <div className="flex px-4 flex-col gap-2">
            <span>By Category</span>
            <div className="grid gap-1 w-full grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]">
              <button
                onClick={() => setLocalFilter("all")}
                className={`p-2 text-center font-semibold  rounded-sm ${
                  localFilter === "all"
                    ? "bg-mainButtonColor text-white"
                    : "text-black bg-gray-200"
                }`}
              >
                All
              </button>
              {filters.map((filter) => (
                <button
                  key={filter.category_id}
                  onClick={() => setLocalFilter(filter.category_id)}
                  className={`p-2 text-center font-semibold  rounded-sm ${
                    localFilter === filter.category_id
                      ? "bg-mainButtonColor text-white"
                      : "text-black bg-gray-200"
                  }`}
                >
                  {filter.category_name}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full px-4 py-2 mt-auto flex flex-row-reverse">
            <button
              className="bg-mainButtonColor text-white p-2 rounded-md"
              onClick={() => handleSelectFilter()}
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileFilter;
