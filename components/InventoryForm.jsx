"use client";
import { useState, useEffect } from "react";

const CreateInventory = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(""); // Default to empty string
  const [selectedSupplier, setSelectedSupplier] = useState(""); // Default to empty string

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch("/api/admin/products");
        const data = await response.json();
        if (response.ok) {
          setProducts(Array.isArray(data?.products) ? data.products : []);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch products: ", error);
      }
    };
    getProducts();
  }, []);

  useEffect(() => {
    const getSuppliers = async () => {
      try {
        const response = await fetch("/api/admin/supplier/");
        const data = await response.json();
        if (response.ok) {
          setSuppliers(Array.isArray(data?.data) ? data.data : []);
        } else {
          setSuppliers([]);
        }
      } catch (error) {
        console.error("Failed to fetch suppliers: ", error);
        setSuppliers([]);
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
        id="wholesale_price"
        name="wholesale_price"
        className="border h-fit p-2 rounded-lg"
        required
      />

      <label htmlFor="inventory_product">Product</label>
      <select
        className="border h-fit p-2 rounded-lg"
        name="inventory_product"
        id="inventory_product"
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
        required
      >
        <option value="" disabled>
          Select Product
        </option>{" "}
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
        className="border h-fit p-2 rounded-lg"
        name="inventory_supplier"
        id="inventory_supplier"
        value={selectedSupplier}
        onChange={(e) => setSelectedSupplier(e.target.value)}
        required
      >
        <option value="" disabled>
          Select Supplier
        </option>
        {suppliers?.length === 0 ? (
          <option>No suppliers available</option>
        ) : (
          suppliers?.map((supplier) => (
            <option key={supplier.supplier_id} value={supplier.supplier_id}>
              {supplier.supplier_name}
            </option>
          ))
        )}
      </select>

      <label htmlFor="total_units">Total Units</label>
      <input
        type="number"
        placeholder="total units"
        id="total_units"
        name="total_units"
        className="border h-fit p-2 rounded-lg"
        required
      />

      <label htmlFor="retail_price">Retail Price</label>
      <input
        type="number"
        placeholder="retail price"
        id="retail_price"
        name="retail_price"
        className="border h-fit p-2 rounded-lg"
        required
      />

      <label htmlFor="inventory_description">Inventory Description</label>
      <textarea
        id="inventory_description"
        placeholder="inventory description"
        name="inventory_description"
        className="border h-fit p-2 rounded-lg"
        required
      />

      <label htmlFor="inventory_profit_margin">Profit Margin</label>
      <input
        type="number"
        placeholder="profit margin"
        id="inventory_profit_margin"
        name="inventory_profit_margin"
        className="border h-fit p-2 rounded-lg"
        required
      />

      <label htmlFor="inventory_expiration_date">Expiration Date</label>
      <input
        type="date"
        id="inventory_expiration_date"
        name="inventory_expiration_date"
        className="border h-fit p-2 rounded-lg"
        required
      />

      <button
        type="submit"
        className="bg-customerRibbonGreen text-white rounded-lg p-2 w-fit bg-mainButtonColor self-end"
      >
        Create Inventory
      </button>
    </form>
  );
};

export default CreateInventory;
