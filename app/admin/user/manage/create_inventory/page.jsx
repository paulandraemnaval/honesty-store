import React from "react";
import InventoryForm from "@components/InventoryForm";
const page = () => {
  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold">Create Inventory</h1>
      <p className="text-gray-500 mb-4">Create a new inventory</p>

      <div className="w-full border mb-2"></div>

      <div className="overflow-y-auto h-[75vh]">
        <InventoryForm />
      </div>
    </div>
  );
};

export default page;
