"use client";
import React from "react";
import "../stlyes/globals.css";
import ProductList from "@components/ProductList";
const page = () => {
  return (
    <>
      <header className="flex justify-center items-center p-4 bg-gradient-to-r from-gradientStart via-gradientMiddle to-gradientEnd">
        <p className="text-2xl text-white font-medium">
          HONESTY STORE | PRODUCTS
        </p>
      </header>
      <ProductList />
    </>
  );
};

export default page;
