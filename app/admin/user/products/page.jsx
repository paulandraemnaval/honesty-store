"use client";

import { useState } from "react";
import FilterBar from "@components/FilterBar";
import ProductList from "@components/ProductList";

const productspage = () => {
  const [filter, setFilter] = useState("all");

  return (
    <div className="flex h-full bg-backgroundColorMain gap-2 relative">
      <div className="flex flex-col w-64 gap-2">
        <span className="text-xl font-bold p-4">Filter</span>
        <div className="w-full border max-h-[0rem]"></div>
        <FilterBar setFilter={setFilter} filter={filter} />
      </div>

      <div className="flex flex-col w-full overflow-auto gap-2">
        <span className="text-xl font-bold p-4">Products</span>
        <div className="w-full border"></div>
        <ProductList filter={filter} />
      </div>
    </div>
  );
};

export default productspage;
