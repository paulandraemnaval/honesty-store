"use client";

import React from "react";
import ProductList from "@components/ProductList";
import ProductForm from "@components/ProductForm";
const productspage = () => {
  const [showAddProduct, setShowAddProduct] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  React.useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data.data);
    };
    fetchProducts();
  }, []);
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
            className="bg-customerRibbonGreen text-white p-4 rounded-lg items-center flex"
          >
            Search
          </button>
        </form>
        <button
          onClick={() => setShowAddProduct((prev) => !prev)}
          className="bg-customerRibbonGreen px-4 text-white rounded-lg self-center h-10 w-fit items-center"
        >
          Add...
        </button>
      </div>

      <ProductList products={products} />
    </div>
  );
};

export default productspage;
