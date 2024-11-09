import React from "react";
import InventoryForm from "@components/InventoryForm";
const page = () => {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold">Create Inventory</h1>
      <p className="text-gray-500 mb-4">Create a new inventory</p>
      <InventoryForm />
    </div>
  );
};

export default page;
