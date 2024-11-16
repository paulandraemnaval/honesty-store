"use client";
import { useState, useEffect, useCallback } from "react";

const CreateInventory = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

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
      className="flex flex-col w-full gap-2 h-fit py-2 px-1"
    >
      <label htmlFor="wholesale_price">Wholesale Price</label>
      <input
        type="number"
        placeholder="wholesale price"
        id="wholesale_price"
        name="wholesale_price"
        className="border h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
        required
      />

      <label htmlFor="inventory_product">Product</label>
      <ProductInput
        setSelectedProduct={setSelectedProduct}
        className={`border h-fit p-2 rounded-lg focus:outline-none`}
      />
      <label htmlFor="inventory_supplier">Supplier</label>
      <SupplierInput
        setSelectedSupplier={setSelectedSupplier}
        className={`border h-fit p-2 rounded-lg focus:outline-mainButtonColor outline ring-mainButtonColor`}
      />
      <label htmlFor="total_units">Total Units</label>
      <input
        type="number"
        placeholder="total units"
        id="total_units"
        name="total_units"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
        required
      />

      <label htmlFor="retail_price">Retail Price</label>
      <input
        type="number"
        placeholder="retail price"
        id="retail_price"
        name="retail_price"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
        required
      />

      <label htmlFor="inventory_description">Inventory Description</label>
      <textarea
        id="inventory_description"
        placeholder="inventory description"
        name="inventory_description"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
        required
      />

      <label htmlFor="inventory_profit_margin">Profit Margin</label>
      <input
        type="number"
        placeholder="profit margin"
        id="inventory_profit_margin"
        name="inventory_profit_margin"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
        required
      />

      <label htmlFor="inventory_expiration_date">Expiration Date</label>
      <input
        type="date"
        id="inventory_expiration_date"
        name="inventory_expiration_date"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
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

const ProductInput = ({ setSelectedProduct, className }) => {
  const [productsQuery, setProductsQuery] = useState("");
  const [focused, setFocused] = useState(false);
  return (
    <div
      className={`relative flex flex-col border rounded-lg h-fit  ${
        focused ? "ring-mainButtonColor ring-1" : "border-gray-300"
      }`}
    >
      <input
        type="text"
        placeholder="Type Product Name"
        onChange={(e) => {
          setTimeout(() => {
            setProductsQuery(e.target.value);
          }, 500);
        }}
        className="border-none p-2 focus:outline-none rounded-lg"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
};
const SupplierInput = ({ setSelectedSupplier, className }) => {
  const [suppliersQuery, setSuppliersQuery] = useState("");
  const [supplierQueryResults, setSupplierQueryResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [focused, setFocused] = useState(false);

  const handleSupplierSearch = useCallback(async (supplierQuery) => {
    if (!supplierQuery.trim()) {
      setSupplierQueryResults([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/query?search=${supplierQuery}`);
      const data = await response.json();
      setSupplierQueryResults(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setSupplierQueryResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSuppliersQuery(value);
    setSupplierQueryResults([]);
    setLoading(true);

    if (debounceTimer) clearTimeout(debounceTimer);

    const newTimer = setTimeout(() => {
      handleSupplierSearch(value);
    }, 500);
    setDebounceTimer(newTimer);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [debounceTimer]);

  return (
    <div
      className={`relative flex flex-col border rounded-lg h-fit ${
        focused ? "ring-mainButtonColor ring-1" : "border-gray-300"
      }`}
    >
      <input
        type="text"
        placeholder="Type Supplier Name"
        onChange={handleInputChange}
        value={suppliersQuery}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="border-none p-2 focus:outline-none rounded-lg"
      />
      {focused && (
        <div>
          {loading && (
            <p className="p-2 bg-gray-100 rounded-bl-lg rounded-br-lg">
              Searching...
            </p>
          )}
          {!loading && suppliersQuery && supplierQueryResults.length === 0 && (
            <p className="p-2 text-gray-400 bg-gray-100 rounded-bl-lg rounded-br-lg">
              No Suppliers found
            </p>
          )}
          {supplierQueryResults.length > 0 && (
            <ul>
              {supplierQueryResults.map((supplier, index) => (
                <li
                  key={supplier.supplier_id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSuppliersQuery(supplier.supplier_name);
                    console.log(supplier.supplier_id);
                    console.log(supplier.supplier_name);
                    setSupplierQueryResults([]);
                    setFocused(false);
                  }}
                  className={`p-2 cursor-pointer bg-gray-100 hover:bg-gray-200 ${
                    index === supplierQueryResults.length - 1
                      ? "rounded-b-lg"
                      : ""
                  }`}
                >
                  {supplier.supplier_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
