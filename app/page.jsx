"use client";
import { useState } from "react";
import "../stlyes/globals.css";
import ProductList from "@components/ProductList";
import FilterBar from "@components/FilterBar";

const Page = () => {
  const [filter, setFilter] = useState("all");
  return (
    <>
      <header className="flex justify-center items-center p-4 bg-gradient-to-r from-gradientStart via-gradientMiddle to-gradientEnd">
        <p className="text-2xl text-white font-medium">
          HONESTY STORE | PRODUCTS
        </p>
      </header>
      <div className="flex h-[calc(100vh-4rem)] flex-1 bg-backgroundColorMain gap-2 ">
        <div className="flex flex-col w-fit gap-2">
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
    </>
  );
};

export default Page;
