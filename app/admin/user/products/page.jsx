"use client";

import { useState } from "react";
import FilterBar from "@components/FilterBar";
import ProductList from "@components/ProductList";
import SearchInput from "@components/SearchInput";
import MobileFilter from "@components/MobileFilter";

const productspage = () => {
  const [filter, setFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <div className="w-full px-4 flex sm:h-[calc(100vh-5rem)] h-[calc(100vh-9rem)] mt-2">
      <div className="sm:flex hidden">
        <FilterBar setFilter={setFilter} filter={filter} />
      </div>

      <div className="flex flex-col w-full gap-2">
        <span className="text-xl font-bold p-4">Products</span>
        <div className="flex">
          <div className="flex-1">
            <SearchInput
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
            />
          </div>
          <div className="sm:hidden block pr-4">
            <MobileFilter setFilter={setFilter} filter={filter} />
          </div>
        </div>

        <div className="w-full border"></div>
        <div className="overflow-y-auto flex-1 ">
          <ProductList filter={filter} searchKeyword={searchKeyword} />
        </div>
      </div>
    </div>
  );
};

export default productspage;
