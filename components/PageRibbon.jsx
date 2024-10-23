import React from "react";

const PageRibbon = ({ setAction, action }) => {
  return (
    <>
      <ul className="flex justify-evenly border border-t-0 border-l-0 border-r-0">
        <li
          className={`p-4 cursor-pointer rounded-tr-md rounded-tl-md ${
            action === "addSupplier" && "bg-customerRibbonGreen text-white"
          }`}
          onClick={() => setAction("addSupplier")}
        >
          Add Supplier
        </li>
        <li
          className={`p-4 cursor-pointer rounded-tr-md rounded-tl-md ${
            action === "CategoryForm" && "bg-customerRibbonGreen text-white"
          }`}
          onClick={() => setAction("CategoryForm")}
        >
          Create Category
        </li>
        <li
          className={`p-4 cursor-pointer rounded-tr-md rounded-tl-md ${
            action === "createInventory" && "bg-customerRibbonGreen text-white"
          }`}
          onClick={() => setAction("createInventory")}
        >
          Create Inventory
        </li>

        <li
          className={`p-4 cursor-pointer rounded-tr-md rounded-tl-md ${
            action === "addProduct" && "bg-customerRibbonGreen text-white"
          }`}
          onClick={() => setAction("addProduct")}
        >
          Add Product
        </li>
      </ul>
    </>
  );
};

export default PageRibbon;
