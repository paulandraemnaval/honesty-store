"use client";
import React from "react";
import PageRibbon from "./PageRibbon";
import ProductForm from "./ProductForm";
import SupplierForm from "./SupplierForm";
const ManageProduct = () => {
  const [action, setAction] = React.useState("");

  return (
    <div className="flex flex-col">
      <PageRibbon actionSetter={setAction} variation={"manageProduct"} />
      {action === "addSupplier" && <SupplierForm />}
      {action === "createCategory" && <div>Create Category</div>}
      {action === "createInventory" && <div>Create Inventory</div>}
      {action === "addProduct" && <ProductForm />}
    </div>
  );
};

export default ManageProduct;
