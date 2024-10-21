import React from "react";

const PageRibbon = ({ actionSetter, variation }) => {
  return (
    <>
      {variation === "manageProduct" && (
        <ul className="flex justify-evenly border border-t-0 border-l-0 border-r-0">
          <li
            className="p-4 cursor-pointer "
            onClick={() => actionSetter("addSupplier")}
          >
            Add Supplier
          </li>
          <li
            className="p-4 cursor-pointer "
            onClick={() => actionSetter("createCategory")}
          >
            Create Category
          </li>
          <li
            className="p-4 cursor-pointer "
            onClick={() => actionSetter("createInventory")}
          >
            Create Inventory
          </li>

          <li
            className="p-4 cursor-pointer "
            onClick={() => actionSetter("addProduct")}
          >
            Add Product
          </li>
        </ul>
      )}
      {variation === "manageUser" && (
        <ul className="flex justify-evenly border border-t-0 border-l-0 border-r-0">
          <li className="p-4 cursor-pointer " onClick={() => actionSetter(0)}>
            Users
          </li>
          <li className="p-4 cursor-pointer " onClick={() => actionSetter(1)}>
            Roles
          </li>
          <li className="p-4 cursor-pointer " onClick={() => actionSetter(2)}>
            Permissions
          </li>
        </ul>
      )}
    </>
  );
};

export default PageRibbon;
