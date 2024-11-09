import CategoryForm from "@components/CategoryForm";
import React from "react";

const page = () => {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold">Create Category</h1>
      <p className="text-gray-500 mb-4">Create a new category</p>
      <CategoryForm />
    </div>
  );
};

export default page;
