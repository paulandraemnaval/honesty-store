import SupplierForm from "@components/SupplierForm";
import React from "react";

const page = () => {
  return (
    <div className="w-full px-4 flex flex-col sm:h-[calc(100vh-5rem)] h-[calc(100vh-9rem)] mt-2">
      <h1 className="text-2xl font-bold">Add Supplier</h1>
      <p className="text-gray-500 mb-4">Add a new supplier to the inventory</p>
      <div className="w-full border mb-2"></div>
      <div className="overflow-y-auto flex-1">
        <SupplierForm />
      </div>
    </div>
  );
};

export default page;
