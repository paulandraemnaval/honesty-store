import React from "react";
import ManageProduct from "@components/ManageProduct";
const page = () => {
  return (
    <div className="flex flex-col gap-4 text-green-500 w-full">
      <span className="text-2xl">Manage</span>
      <ManageProduct />
    </div>
  );
};

export default page;
