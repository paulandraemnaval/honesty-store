"use client";
import React from "react";

const Pagination = ({
  itemsCount,
  itemsPerPage,
  onPageChange,
  currentPage,
}) => {
  const totalPages = Math.ceil(itemsCount / itemsPerPage);

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  return (
    <div className="flex items-center gap-2">
      <ul className="flex gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <li key={index}>
            <button
              onClick={() => handlePageClick(index + 1)}
              className={`p-2 border ${
                currentPage === index + 1
                  ? "bg-customerRibbonGreen text-white"
                  : "text-customerRibbonGreen bg-white"
              } rounded-lg py-2 px-3`}
            >
              {index + 1}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pagination;
