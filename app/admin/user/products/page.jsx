"use client";

import { useState } from "react";
import FilterBar from "@components/FilterBar";
import ProductList from "@components/ProductList";

const productspage = () => {
  const [filter, setFilter] = useState("all");

  return (
    <div className="flex h-full bg-backgroundColorMain gap-2 sm:px-12">
      <div className="sm:flex hidden">
        <FilterBar setFilter={setFilter} filter={filter} />
      </div>

      <div className="flex flex-col w-full gap-2">
        <span className="text-xl font-bold p-4">Products</span>
        <div className="w-full border"></div>
        <div className="hide_scrollbar overflow-y-auto overflow-hidden sm:h-[78vh] h-[77vh]">
          <ProductList filter={filter} renderMethod={`justify-center`} />
        </div>
      </div>
    </div>
  );
};

export default productspage;
