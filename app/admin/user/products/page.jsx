"use client";

import React from "react";
import ProductList from "@components/ProductList";

const productspage = () => {
  const [showRecieptInput, setShowRecieptInput] = React.useState(false);
  const products = [
    {
      name: "Product 1",
      price: 100,
      description: "This is product 1",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Product 2",
      price: 200,
      description: "This is product 2",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Product 3",
      price: 300,
      description: "This is product 3",
      image: "https://via.placeholder.com/150",
    },
  ];
  return (
    <div className="flex flex-col gap-4 w-full p-2 relative">
      <h1>Products</h1>
      <div className="flex gap-2 h-10">
        <form action="" className="flex gap-2 w-full sm:w-fit">
          <input
            type="text"
            placeholder="search item..."
            className="border-none outine-none bg-gray-300 rounded-lg p-4 w-full sm:w-full lg:w-fit"
          />
          <button
            type="submit"
            className="bg-green-400 text-white p-4 rounded-lg items-center flex"
          >
            Search
          </button>
        </form>
        <button
          onClick={() => setShowRecieptInput((prev) => !prev)}
          className="bg-green-400 px-4 text-white rounded-lg self-center h-10 w-fit items-center"
        >
          Add...
        </button>
      </div>
      <ul className="flex gap-2 flex-wrap align-middle">
        <ProductList products={products} />
      </ul>
    </div>
  );
};

export default productspage;
