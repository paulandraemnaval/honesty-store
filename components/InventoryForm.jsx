"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";

const CreateInventory = ({ productName }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [supplierQuery, setSupplierQuery] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);
  const [retailPrice, setRetailPrice] = useState(0);
  const [manualRetailPrice, setManualRetailPrice] = useState(false);
  const [validationMessages, setValidationMessages] = useState({
    inventory_supplier: "\u00A0",
    inventory_wholesale_price: "\u00A0",
    inventory_profit_margin: "\u00A0",
    inventory_retail_price: "\u00A0",
    inventory_total_units: "\u00A0",
    inventory_expiration_date: "\u00A0",
  });
  useEffect(() => {
    if (productName) {
      const fetchProduct = async () => {
        try {
          setDataLoading(true);
          const response = await fetch(
            `/api/admin/query?product=${productName}`
          );
          const data = await response.json();
          setSelectedProduct(
            Array.isArray(data?.data) ? data.data[0].product_id : null
          );
        } catch (error) {
          console.error("Failed to fetch product: ", error);
        } finally {
          setDataLoading(false);
        }
      };
      fetchProduct();
    }
  }, [productName]);

  useEffect(() => {
    if (!manualRetailPrice) {
      setRetailPrice(wholesalePrice + profitMargin);
    }
  }, [wholesalePrice, profitMargin, manualRetailPrice]);

  const validateForm = (formData) => {
    const messages = {
      inventory_supplier: selectedSupplier ? "\u00A0" : "Supplier is required",
      inventory_wholesale_price:
        Number(formData.get("inventory_wholesale_price")) > 0
          ? "\u00A0"
          : "Wholesale price must be greater than 0",
      inventory_profit_margin:
        Number(formData.get("inventory_profit_margin")) > 0
          ? "\u00A0"
          : "Profit margin must be greater than 0",
      inventory_retail_price:
        Number(formData.get("inventory_retail_price")) > 0
          ? "\u00A0"
          : "Retail price must be greater than 0",
      inventory_total_units:
        Number(formData.get("inventory_total_units")) > 0
          ? "\u00A0"
          : "Total units must be greater than 0",
      inventory_expiration_date:
        new Date(formData.get("inventory_expiration_date")) > new Date()
          ? "\u00A0"
          : "Expiration date must be in the future",
    };

    setValidationMessages(messages);

    Object.keys(messages).forEach((id) => {
      const input = document.getElementById(id);
      if (input) {
        if (messages[id]) {
          input.classList.add("border-red-500", "border");
        } else {
          input.classList.remove("border-red-500");
        }
      }
    });

    return Object.values(messages).every((message) => message === "");
  };

  const postInventory = async (e) => {
    try {
      setLoading(true);
      const formData = new FormData(e.target);
      //to conform to API requirements
      formData.append("inventory_product", selectedProduct);
      formData.append("inventory_supplier", selectedSupplier);
      formData.append("retail_price", retailPrice);
      formData.append("wholesale_price", wholesalePrice);
      formData.append("total_units", formData.get("inventory_total_units"));

      //delete redundant fields
      formData.delete("inventory_retail_price");
      formData.delete("inventory_wholesale_price");
      formData.delete("inventory_total_units");

      const response = await fetch("/api/admin/inventory", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("profit margin: ", formData.get("inventory_profit_margin"));

      if (response.ok) {
        toast.success("Inventory Created Successfully!", {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        });
        e.target.reset();
        setSupplierQuery("");
        setWholesalePrice(0);
        setProfitMargin(0);
        setRetailPrice(0);
        setManualRetailPrice(false);
      } else {
        toast.error("Failed to create inventory. Please try again later.", {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        });
      }
    } catch (error) {
      toast.error("Failed to create inventory. Please try again later.");
      console.error("Failed to post inventory: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    if (!validateForm(formData)) {
      toast.error("Please check the inputs and try again.", {
        duration: 3000,
        style: {
          fontSize: "1.2rem",
          padding: "16px",
        },
      });
      return;
    }

    postInventory(e);
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="flex flex-col w-full h-fit px-1"
    >
      <label htmlFor="inventory_supplier">
        Supplier<span className="text-red-600">*</span>
      </label>
      <SupplierInput
        setSelectedSupplier={setSelectedSupplier}
        setSupplierQuery={setSupplierQuery}
        supplierQuery={supplierQuery}
      />
      <p className="text-red-600 text-sm mb-2">
        {validationMessages.inventory_supplier}
      </p>

      <label htmlFor="wholesale_price">
        Wholesale Price <span className="text-red-600">*</span>
      </label>
      <input
        type="number"
        id="inventory_wholesale_price"
        name="inventory_wholesale_price"
        className="border p-2 rounded-lg"
        value={wholesalePrice}
        onChange={(e) => setWholesalePrice(parseFloat(e.target.value) || "")}
        placeholder="wholesale price"
      />
      <p className="text-red-600 text-sm mb-2">
        {validationMessages.inventory_wholesale_price}
      </p>

      <label htmlFor="inventory_profit_margin">
        Profit Margin<span className="text-red-600">*</span>
      </label>
      <input
        type="number"
        id="inventory_profit_margin"
        name="inventory_profit_margin"
        className="border p-2 rounded-lg"
        value={profitMargin}
        onChange={(e) => setProfitMargin(parseFloat(e.target.value) || "")}
        placeholder="profit margin"
      />
      <p className="text-red-600 text-sm mb-2">
        {validationMessages.inventory_profit_margin}
      </p>

      <label htmlFor="retail_price">
        Retail Price<span className="text-red-600">*</span>
      </label>
      <input
        type="number"
        id="inventory_retail_price"
        name="inventory_retail_price"
        className="border p-2 rounded-lg"
        value={retailPrice}
        onChange={(e) =>
          manualRetailPrice
            ? setRetailPrice(parseFloat(e.target.value) || "")
            : null
        }
        readOnly={!manualRetailPrice}
        placeholder="retail price"
      />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="manual_retail_price"
          className="h-4 w-4"
          checked={manualRetailPrice}
          onChange={(e) => setManualRetailPrice(e.target.checked)}
        />
        <label htmlFor="manual_retail_price">Set Retail Price Manually</label>
      </div>

      <p className="text-red-600 text-sm mb-2">
        {validationMessages.inventory_retail_price}
      </p>

      <label htmlFor="total_units">
        Total Units<span className="text-red-600">*</span>
      </label>
      <input
        type="number"
        id="inventory_total_units"
        name="inventory_total_units"
        className="border p-2 rounded-lg"
        placeholder="total units"
      />
      <p className="text-red-600 text-sm mb-2">
        {validationMessages.inventory_total_units}
      </p>
      <label htmlFor="inventory_expiration_date">
        Expiration Date<span className="text-red-600">*</span>
      </label>
      <input
        type="date"
        id="inventory_expiration_date"
        name="inventory_expiration_date"
        className="border p-2 rounded-lg"
      />
      <p className="text-red-600 text-sm mb-2">
        {validationMessages.inventory_expiration_date}
      </p>

      <label htmlFor="inventory_description">Inventory Description</label>
      <textarea
        id="inventory_description"
        name="inventory_description"
        className="border p-2 rounded-lg mb-2"
        placeholder="inventory description"
      />

      <button
        type="submit"
        className={`text-white rounded-lg p-2 w-fit self-end ${
          loading || dataLoading
            ? "bg-mainButtonColorDisabled"
            : "bg-mainButtonColor"
        }`}
        disabled={loading || dataLoading}
      >
        {loading ? "Creating Inventory..." : "Create Inventory"}
      </button>
    </form>
  );
};

export default CreateInventory;

const SupplierInput = ({
  setSelectedSupplier,
  supplierQuery,
  setSupplierQuery,
}) => {
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

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    setTimeout(() => setFocused(false), 300);
  };

  return (
    <div
      className={`relative flex flex-col border rounded-lg h-fit ${
        focused ? "ring-mainButtonColor ring-1" : "border-gray-300"
      }`}
      id="inventory_supplier"
    >
      <input
        type="text"
        placeholder="Supplier"
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
