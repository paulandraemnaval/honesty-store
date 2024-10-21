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

  console.log(suppliers);

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
        id="wholesale_price"
        name="wholesale_price"
        className="border"
      />
      <label htmlFor="inventory_product">Product</label>
      <select
        className="border p-2"
        name="inventory_product"
        id="inventory_product"
      >
        {products.length === 0 ? (
          <option>No products available</option>
        ) : (
          products.map((product) => (
            <option key={product.product_id} value={product.product_id}>
              {product.product_name}
            </option>
          ))
        )}
      </select>

      <label htmlFor="inventory_supplier">Supplier</label>
      <select
        className="border p-2"
        name="inventory_supplier"
        id="inventory_supplier"
      >
        {suppliers.map((supplier) => (
          <option key={supplier.supplier_id} value={supplier.supplier_id}>
            {supplier.supplier_name}
          </option>
        ))}
      </select>

      <label htmlFor="total_units">Total Units</label>
      <input
        type="number"
        placeholder="total units"
        id="total_units"
        name="total_units"
        className="border"
      />

      <label htmlFor="retail_price">Retail Price</label>
      <input
        type="number"
        placeholder="retail price"
        id="retail_price"
        name="retail_price"
        className="border"
      />

      <label htmlFor="inventory_description">Inventory Description</label>
      <textarea
        id="inventory_description"
        placeholder="inventory description"
        name="inventory_description"
        className="border"
      />

      <label htmlFor="inventory_profit_margin">Profit Margin</label>
      <input
        type="number"
        placeholder="profit margin"
        id="inventory_profit_margin"
        name="inventory_profit_margin"
        className="border"
      />

      <label htmlFor="inventory_expiration_date">Expiration Date</label>
      <input
        type="date"
        id="inventory_expiration_date"
        name="inventory_expiration_date"
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
