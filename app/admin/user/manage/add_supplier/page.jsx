import SupplierForm from "@components/SupplierForm";
import React from "react";

const page = () => {
  return (
    <div className="w-full py-2 flex flex-col sm:h-[calc(100vh-6rem)] h-[calc(100vh-10rem)] mt-2">
      <h1 className="text-2xl font-bold px-4 mb-2">Add Supplier</h1>
      <p className="text-gray-500 mb-4 px-4">
        Add a new supplier to the inventory
      </p>
      <div className="w-full border mb-2 px-4"></div>
      <div className="overflow-y-auto flex-1 px-4">
        <SupplierForm />
      </div>
    </div>
  );
};

export default page;
