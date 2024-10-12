"use client";
import React from "react";
import PageRibbon from "./PageRibbon";
import ProductForm from "./ProductForm";
import SupplierForm from "./SupplierForm";
import CreateCategory from "./CreateCategory";
import CreateInventory from "./CreateInventory";
const ManageProduct = () => {
  const [action, setAction] = React.useState("");

  return (
    <div className="flex flex-col">
      <PageRibbon actionSetter={setAction} variation={"manageProduct"} />
      {action === "addSupplier" && <SupplierForm />}
      {action === "createCategory" && <CreateCategory />}
      {action === "createInventory" && <CreateInventory />}
      {action === "addProduct" && <ProductForm />}
    </div>
  );
};

export default ManageProduct;
