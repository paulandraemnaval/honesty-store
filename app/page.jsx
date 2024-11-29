"use client";
import { useState } from "react";

import "../stlyes/globals.css";
import ProductList from "@components/ProductList";
import FilterBar from "@components/FilterBar";
import SearchInput from "@components/SearchInput";
import MobileFilter from "@components/MobileFilter";

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortPriceAsc, setSortPriceAsc] = useState(null);
  return (
    <>
      <header className="flex justify-center items-center p-4 bg-gradient-to-r from-gradientStart to-gradientEnd">
        <p className="text-2xl text-white font-bold">HONESTY STORE</p>
      </header>
      <div className="w-full px-4 flex sm:h-[calc(100vh-4.5rem)] h-[calc(100vh-5rem)] mt-2">
        <div className="sm:flex hidden pr-2">
          <FilterBar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setSortPriceAsc={setSortPriceAsc}
          />
        </div>

        <div className="flex flex-col w-full gap-2">
          <div className="flex gap-1">
            <div className="flex-1">
              <SearchInput
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
              />
            </div>
            <div className="sm:hidden block z-20">
              <MobileFilter
                setSelectedCategory={setSelectedCategory}
                selectedCategory={selectedCategory}
              />
            </div>
          </div>

          <div className="w-full border"></div>
          <div className="overflow-y-auto flex-1">
            <ProductList
              selectedCategory={selectedCategory}
              sortPriceAsc={sortPriceAsc}
              searchKeyword={searchKeyword}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
