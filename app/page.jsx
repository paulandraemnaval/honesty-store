"use client";
import { useState } from "react";
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
      <div className="flex h-[calc(100vh-4rem)] flex-1 bg-backgroundColorMain gap-2">
        <div className="flex flex-col w-fit gap-2 py-20">
          <div className="flex w-full px-4 gap-1">
            <Image src={filterIcon} alt="filter icon" width={25} height={15} />
            <span className="font-medium">Filter</span>
          </div>
          <FilterBar setFilter={setFilter} filter={filter} />
        </div>
        <div className="flex flex-col w-full overflow-hidden gap-2 mt-4">
          <SearchInput
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
          />

          <div className="w-full border border-horizontalLineColor"></div>
          <div className="overflow-auto h-full w-full">
            <ProductList filter={filter} searchKeyword={searchKeyword} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
