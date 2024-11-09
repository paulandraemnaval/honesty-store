import SupplierForm from "@components/SupplierForm";
import React from "react";

const page = () => {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold">Add Supplier</h1>
      <p className="text-gray-500 mb-4">Add a new supplier to the inventory</p>
      <SupplierForm />
    </div>
  );
};

export default page;
