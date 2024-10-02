import React from "react";
import ProductForm from "@components/ProductForm";
const page = () => {
  return (
    <div className="flex flex-col gap-4 w-full p-2 relative">
      <h1>Add Product</h1>
      <ProductForm />
    </div>
  );
};

export default page;
