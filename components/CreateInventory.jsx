"use client";
import React from "react";

const CreateInventory = () => {
  const [products, setProducts] = React.useState([]);
  const [suppliers, setSuppliers] = React.useState([]);

  React.useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch("/api/admin/products");
        const data = await response.json();
        setProducts(data.data);
      } catch (error) {
        console.error("Failed to fetch products: ", error);
      }
    };
    getProducts();

    const getSuppliers = async () => {
      try {
        const response = await fetch("/api/admin/supplier");
        const data = await response.json();
        setSuppliers(data.data);
      } catch (error) {
        console.error("Failed to fetch suppliers: ", error);
      }
    };
    getSuppliers();
  }, []);

  const postInventory = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const response = await fetch("/api/admin/inventory", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Failed to post inventory: ", error);
    }
  };

  return (
    <form
      action="createInventory"
      onSubmit={(e) => postInventory(e)}
      className="flex flex-col gap-2"
    >
      <label htmlFor="wholesale_price">Wholesale Price</label>
      <input
        type="number"
        placeholder="wholesale price"
        id="wholesalePrice"
        name="wholesalePrice"
        className="border"
      />
      <label htmlFor="inventoryProduct">Product</label>
      <select
        className="border p-2"
        name="inventoryProduct"
        id="inventoryProduct"
      >
        {products.map((product) => (
          <option key={product.productId} value={product.productId}>
            {product.productName}
          </option>
        ))}
      </select>

      <label htmlFor="inventorySupplier">Supplier</label>
      <select
        className="border p-2"
        name="inventorySupplier"
        id="inventorySupplier"
      >
        {suppliers.map((supplier) => (
          <option key={supplier.supplierId} value={supplier.supplierId}>
            {supplier.supplierName}
          </option>
        ))}
      </select>

      <label htmlFor="totalUnits">Total Units</label>
      <input
        type="number"
        placeholder="total units"
        id="totalUnits"
        name="totalUnits"
        className="border"
      />

      <label htmlFor="retailPrice">Retail Price</label>
      <input
        type="number"
        placeholder="retail price"
        id="retailPrice"
        name="retailPrice"
        className="border"
      />

      <label htmlFor="inventoryDescription">Inventory Description</label>
      <textarea
        id="inventoryDescription"
        placeholder="inventory description"
        name="inventoryDescription"
        className="border"
      />

      <label htmlFor="inventoryProfitMargin">Profit Margin</label>
      <input
        type="number"
        placeholder="profit margin"
        id="inventoryProfitMargin"
        name="inventoryProfitMargin"
        className="border"
      />

      <label htmlFor="inventoryExpirationDate">Expiration Date</label>
      <input
        type="date"
        id="inventoryExpirationDate"
        name="inventoryExpirationDate"
        className="border"
      />

      <button
        type="submit"
        className="bg-green-400 text-white p-4 rounded-md self-start"
      >
        Add Inventory
      </button>
    </form>
  );
};

export default CreateInventory;
