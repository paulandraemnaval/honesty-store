"use client";
import { useState, useEffect, useCallback } from "react";

const CreateInventory = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const postInventory = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);

      formData.append("inventory_product", selectedProduct);
      formData.append("inventory_supplier", selectedSupplier);

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
      className="flex flex-col w-full gap-2 h-fit px-1"
    >
      <label htmlFor="wholesale_price">Wholesale Price</label>
      <input
        type="number"
        placeholder="wholesale price"
        id="wholesale_price"
        name="wholesale_price"
        className="border h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border-gray-300"
        required
      />

      <label htmlFor="inventory_product">Product</label>
      <ProductInput setSelectedProduct={setSelectedProduct} />
      <label htmlFor="inventory_supplier">Supplier</label>
      <SupplierInput setSelectedSupplier={setSelectedSupplier} />
      <label htmlFor="total_units">Total Units</label>
      <input
        type="number"
        placeholder="total units"
        id="total_units"
        name="total_units"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
        required
      />

      <label htmlFor="retail_price">Retail Price</label>
      <input
        type="number"
        placeholder="retail price"
        id="retail_price"
        name="retail_price"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
        required
      />

      <label htmlFor="inventory_description">Inventory Description</label>
      <textarea
        id="inventory_description"
        placeholder="inventory description"
        name="inventory_description"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
        required
      />

      <label htmlFor="inventory_profit_margin">Profit Margin</label>
      <input
        type="number"
        placeholder="profit margin"
        id="inventory_profit_margin"
        name="inventory_profit_margin"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
        required
      />

      <label htmlFor="inventory_expiration_date">Expiration Date</label>
      <input
        type="date"
        id="inventory_expiration_date"
        name="inventory_expiration_date"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
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

const ProductInput = ({ setSelectedProduct }) => {
  const [productsQuery, setproductsQuery] = useState("");
  const [productsQueryResults, setproductsQueryResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [focused, setFocused] = useState(false);

  const handleProductSearch = useCallback(async (productsQuery) => {
    if (!productsQuery.trim()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/query?product=${productsQuery}`);
      const data = await response.json();
      console.log(data);
      setproductsQueryResults(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setproductsQueryResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setproductsQuery(value);
    setproductsQueryResults([]);
    setLoading(true);

    if (debounceTimer) clearTimeout(debounceTimer);

    const newTimer = setTimeout(() => {
      handleProductSearch(value);
    }, 500);
    setDebounceTimer(newTimer);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [debounceTimer]);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    setTimeout(() => setFocused(false), 100);
  };

  return (
    <div
      className={`relative flex flex-col border rounded-lg h-fit ${
        focused ? "ring-mainButtonColor ring-1" : "border-gray-300"
      }`}
    >
      <input
        type="text"
        placeholder="Type Product Name"
        onChange={handleInputChange}
        value={productsQuery}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="border-none p-2 focus:outline-none rounded-lg"
      />
      {focused && (
        <div>
          {loading && (
            <p className="p-2 bg-gray-100 rounded-bl-lg rounded-br-lg">
              Searching...
            </p>
          )}
          {!loading && productsQuery && productsQueryResults.length === 0 && (
            <p className="p-2 text-gray-400 bg-gray-100 rounded-bl-lg rounded-br-lg">
              No Products found
            </p>
          )}
          {productsQueryResults.length > 0 && (
            <ul>
              {productsQueryResults.map((product, index) => (
                <li
                  key={product.product_id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setproductsQuery(product.product_name);
                    setSelectedProduct(product.product_id);
                    setFocused(false);
                  }}
                  className={`p-2 cursor-pointer bg-gray-100 hover:bg-gray-200 ${
                    index === productsQueryResults.length - 1
                      ? "rounded-b-lg"
                      : ""
                  }`}
                >
                  {product.product_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
const SupplierInput = ({ setSelectedSupplier }) => {
  const [supplierQuery, setSupplierQuery] = useState("");
  const [supplierQueryResults, setSupplierQueryResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [focused, setFocused] = useState(false);

  const handleSupplierSearch = useCallback(async (supplierQuery) => {
    if (!supplierQuery.trim()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/query?supplier=${supplierQuery}`
      );
      const data = await response.json();
      setSupplierQueryResults(Array.isArray(data?.data) ? data.data : []);
      console.log(data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setSupplierQueryResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSupplierQuery(value);
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

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    setTimeout(() => setFocused(false), 100);
  };

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
        value={supplierQuery}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="border-none p-2 focus:outline-none rounded-lg"
      />
      {focused && (
        <div>
          {loading && (
            <p className="p-2 bg-gray-100 rounded-bl-lg rounded-br-lg">
              Searching...
            </p>
          )}
          {!loading && supplierQuery && supplierQueryResults.length === 0 && (
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
                    setSupplierQuery(supplier.supplier_name);
                    setSelectedSupplier(supplier.supplier_id);
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
