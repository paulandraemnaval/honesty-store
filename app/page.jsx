"use client";
import React from "react";
import "../stlyes/globals.css";
import ProductList from "@components/ProductList";
import FilterBar from "@components/FilterBar";

const Page = () => {
  return (
    <>
      <header className="flex justify-center items-center p-4 bg-gradient-to-r from-gradientStart via-gradientMiddle to-gradientEnd">
        <p className="text-2xl text-white font-medium">
          HONESTY STORE | PRODUCTS
        </p>
      </header>
      <div className="flex h-[calc(100vh-4rem)]">
        <span className="text-xl font-bold p-4">Filter</span>
        <hr />
        <FilterBar />

        <div className="flex flex-col w-full overflow-auto">
          <span className="text-xl font-bold p-4">Products</span>
          <hr />
          <ProductList />
        </div>
      </div>
    </>
  );
};

export default Page;
