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

  const postInventory = async (e) => {
    e.preventDefault();

    const expirationDate = e.target.inventory_expiration_date.value;
    const form = e.target;
    let formValid = true;

    // Validate inputs and highlight invalid fields
    const inputs = form.querySelectorAll("input");
    inputs.forEach((input) => {
      if (!input.value.trim() || input.value <= 0) {
        input.classList.add("ring-1", "ring-red-600");
        formValid = false;
      } else {
        input.classList.remove("ring-1", "ring-red-600");
      }
    });

    // Validate if all required fields are filled
    const isValidForm =
      selectedSupplier &&
      wholesalePrice > 0 &&
      profitMargin > 0 &&
      retailPrice > 0 &&
      e.target.total_units.value > 0 &&
      expirationDate &&
      expirationDate >= new Date().toISOString().split("T")[0];

    if (!isValidForm || !formValid) {
      toast.error(
        "One or more invalid inputs. Please check the inputs and try again.",
        {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        }
      );
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData(e.target);
      formData.append("inventory_product", selectedProduct);
      formData.append("inventory_supplier", selectedSupplier);

      const response = await fetch("/api/admin/inventory", {
        method: "POST",
        body: formData,
      });

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

  return (
    <form
      onSubmit={(e) => postInventory(e)}
      className="flex flex-col w-full gap-2 h-fit px-1"
    >
      <label htmlFor="inventory_supplier">
        Supplier<span className="text-red-600">*</span>
      </label>
      <SupplierInput
        setSelectedSupplier={setSelectedSupplier}
        setSupplierQuery={setSupplierQuery}
        supplierQuery={supplierQuery}
      />

      <label htmlFor="wholesale_price">
        Wholesale Price <span className="text-red-600">*</span>
      </label>
      <input
        type="number"
        id="wholesale_price"
        name="wholesale_price"
        className="border p-2 rounded-lg"
        value={wholesalePrice}
        onChange={(e) => setWholesalePrice(parseFloat(e.target.value) || "")}
        placeholder="wholesale price"
      />

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

      <label htmlFor="retail_price">
        Retail Price<span className="text-red-600">*</span>
      </label>
      <input
        type="number"
        id="retail_price"
        name="retail_price"
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

      <label htmlFor="total_units">
        Total Units<span className="text-red-600">*</span>
      </label>
      <input
        type="number"
        id="total_units"
        name="total_units"
        className="border p-2 rounded-lg"
        placeholder="total units"
      />

      <label htmlFor="inventory_expiration_date">
        Expiration Date<span className="text-red-600">*</span>
      </label>
      <input
        type="date"
        id="inventory_expiration_date"
        name="inventory_expiration_date"
        className="border p-2 rounded-lg"
      />

      <label htmlFor="inventory_description">Inventory Description</label>
      <textarea
        id="inventory_description"
        name="inventory_description"
        className="border p-2 rounded-lg"
        placeholder="inventory description"
      />

      <button
        type="submit"
        className={`text-white rounded-lg p-2 w-fit ${
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
