"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import "../stlyes/globals.css";
import ProductList from "@components/ProductList";
import FilterBar from "@components/FilterBar";
import SearchInput from "@components/SearchInput";
import filterIcon from "@public/icons/filter_icon.png";

const Page = () => {
  const [filter, setFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  return (
    <>
      <header className="flex justify-center items-center p-4 bg-gradient-to-r from-gradientStart to-gradientEnd">
        <p className="text-2xl text-white font-bold">HONESTY STORE</p>
      </header>
      <div className="flex h-[calc(100vh-4rem)] flex-1 bg-backgroundMain gap-2 border-2px-1">
        <div className="sm:flex hidden">
          <FilterBar setFilter={setFilter} filter={filter} />
        </div>
        <div className="flex flex-col w-full overflow-hidden gap-2 mt-2">
          <SearchInput
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
          />

          <div className="w-full border border-horizontalLineColor"></div>
          <ProductList filter={filter} searchKeyword={searchKeyword} />
        </div>
      </div>
    </>
  );
};

export default Page;
