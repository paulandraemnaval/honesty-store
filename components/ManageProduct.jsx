"use client";
import React from "react";
import PageRibbon from "./PageRibbon";
import ProductForm from "./ProductForm";
import SupplierForm from "./SupplierForm";
import CategoryForm from "./CategoryForm";
import CreateInventory from "./InventoryForm";
const ManageProduct = () => {
  const [action, setAction] = React.useState("addProduct");

  return (
    <div className="flex flex-col gap-2">
      <PageRibbon setAction={setAction} action={action} />
      {action === "addSupplier" && <SupplierForm />}
      {action === "CategoryForm" && <CategoryForm />}
      {action === "createInventory" && <CreateInventory />}
      {action === "addProduct" && <ProductForm method="post" />}
    </div>
  );
};

export default ManageProduct;
