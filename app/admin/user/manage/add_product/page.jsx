import React from "react";
import ProductForm from "@components/ProductForm";
const page = () => {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold">Add Product</h1>
      <p className="text-gray-500 mb-4">Add a new product to the inventory</p>
      <ProductForm />
    </div>
  );
};

export default page;
