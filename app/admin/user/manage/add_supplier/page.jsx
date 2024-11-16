import SupplierForm from "@components/SupplierForm";
import React from "react";

const page = () => {
  return (
    <div className="w-full px-4 overflow-hidden py-2">
      <h1 className="text-2xl font-bold">Add Supplier</h1>
      <p className="text-gray-500 mb-4">Add a new supplier to the inventory</p>
      <div className="w-full border mb-2"></div>
      <div className="hide_scrollbar w-full mb-2 h-full">
        <SupplierForm />
      </div>
    </div>
  );
};

export default page;
