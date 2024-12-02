"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import closeIcon from "@public/icons/close_icon.png";
import Image from "next/image";
import Loading from "./Loading";
import ButtonLoading from "./ButtonLoading";
const CreateInventory = ({
  productName = "",
  setShowInventoryForm = () => {},
  inventoryID = "",
  setEditingInventoryID = () => {},
  setShowProductInventories = () => {},
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [supplierQuery, setSupplierQuery] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");
  const [profitMargin, setProfitMargin] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [manualRetailPrice, setManualRetailPrice] = useState(false);
  const [expDate, setExpDate] = useState(null);
  const [expDateDisplay, setExpDateDisplay] = useState("");
  const [validationMessages, setValidationMessages] = useState({
    inventory_supplier: "\u00A0",
    inventory_wholesale_price: "\u00A0",
    inventory_profit_margin: "\u00A0",
    inventory_total_units: "\u00A0",
    inventory_expiration_date: "\u00A0",
  });
  const [supplierValid, setSupplierValid] = useState(false);
  const [inventory, setInventory] = useState({});
  const [manualProfitMargin, setManualProfitMargin] = useState(false);

  useEffect(() => {
    if (!inventoryID) return;
    const fetchInventory = async () => {
      try {
        setDataLoading(true);
        const response = await fetch(`/api/admin/inventory/${inventoryID}`);
        const data = await response.json();
        setInventory(data?.data);
        setSupplierValid(true);
        setWholesalePrice(data?.data.inventory_wholesale_price);
        setProfitMargin(data?.data.inventory_profit_margin);
        setRetailPrice(data?.data.inventory_retail_price);
        setSelectedProduct(data?.data.product_id);
        const expirationms =
          data?.data.inventory_expiration_date.seconds * 1000 +
          Math.floor(data?.data.inventory_expiration_date.nanoseconds / 1e6);

        const expirationDate = new Date(expirationms)
          .toISOString()
          .split("T")[0];

        setExpDateDisplay(expirationDate);
        setExpDate(new Date(expirationms));
        if (data?.data) {
          const supplierResponse = await fetch(
            `/api/admin/supplier/${data?.data.supplier_id}`
          );
          const supplierData = await supplierResponse.json();

          console.log(supplierData);
          console.log("xd", data);
          setSupplierQuery(supplierData?.data.supplier_name);
          setSelectedSupplier(supplierData?.data.supplier_id);
        }
      } catch (error) {
        console.error("Failed to fetch inventory: ", error);
      } finally {
        setDataLoading(false);
      }
    };
    fetchInventory();
  }, [inventoryID]);

  useEffect(() => {
    if (!manualProfitMargin && wholesalePrice !== "") {
      setProfitMargin(parseFloat(wholesalePrice * 0.1).toFixed(2));
    }
  }, [wholesalePrice, manualProfitMargin]);

  const validateProfitMargin = () => {
    if (!manualProfitMargin) return true;
    const minProfitMargin = wholesalePrice * 0.1;
    if (!profitMargin || profitMargin < minProfitMargin) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (wholesalePrice !== "") {
      if (manualRetailPrice) {
        setProfitMargin(
          parseFloat(
            ((retailPrice - wholesalePrice) / wholesalePrice) * 100
          ).toFixed(2)
        );
      } else if (manualProfitMargin) {
        setRetailPrice(
          parseFloat(wholesalePrice * (1 + profitMargin / 100)).toFixed(2)
        );
      } else if (!manualProfitMargin && !manualRetailPrice) {
        setRetailPrice(parseFloat(wholesalePrice * 1.1).toFixed(2));
      }
    }
  }, [wholesalePrice, profitMargin, manualRetailPrice]);

  useEffect(() => {
    if (!productName) return;
    const fetchProduct = async () => {
      try {
        setDataLoading(true);
        const response = await fetch(`/api/admin/query?product=${productName}`);
        const data = await response.json();
        setSelectedProduct(
          Array.isArray(data?.data) ? data.data[0].product_id : null
        );
      } catch (error) {
        console.error("Failed to fetch product: ", error);
        setSelectedProduct(null);
      } finally {
        setDataLoading(false);
      }
    };
    fetchProduct();
  }, [productName]);

  const validateForm = (formData) => {
    const isProfitMarginValid = validateProfitMargin();

    const messages = {
      inventory_supplier: supplierValid
        ? "\u00A0"
        : "Invalid supplier. Please select a supplier from the dropdown",
      inventory_profit_margin: isProfitMarginValid
        ? "\u00A0"
        : `Profit margin must be at least 10% of wholesale price: ${parseFloat(
            wholesalePrice * 0.1
          ).toFixed(2)}`,
      inventory_wholesale_price:
        Number(formData.get("inventory_wholesale_price")) > 0
          ? "\u00A0"
          : "Wholesale price must be greater than 0",
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
        if (messages[id] !== "\u00A0") {
          input.classList.add("border-red-500", "border");
        } else {
          input.classList.remove("border-red-500");
        }
      }
    });

    return (
      Object.values(messages).every((message) => message === "\u00A0") &&
      isProfitMarginValid
    );
  };

  const postInventory = async (e) => {
    try {
      setLoading(true);
      const formData = new FormData(e.target);

      //to conform to API requirements
      formData.append("inventory_product", selectedProduct);
      formData.append("inventory_supplier", selectedSupplier);
      formData.append("total_units", formData.get("inventory_total_units"));
      formData.append("retail_price", retailPrice);

      formData.delete("inventory_profit_margin");
      formData.append("inventory_profit_margin", profitMargin);

      formData.append("wholesale_price", wholesalePrice);

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
        setWholesalePrice("");
        setProfitMargin("");
        setRetailPrice("");
        setManualRetailPrice(false);
        setSupplierValid(false);
        setSupplierQuery("");
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
    if (inventoryID) patchInventory(e);
    else postInventory(e);
  };

  const patchInventory = async (e) => {
    try {
      setLoading(true);
      const formData = new FormData(e.target);

      //to conform to API requirements
      formData.append("inventory_product", selectedProduct);
      formData.append("inventory_supplier", selectedSupplier);
      formData.append("total_units", formData.get("inventory_total_units"));
      formData.append("retail_price", retailPrice);

      formData.delete("inventory_profit_margin");

      formData.delete("inventory_expiration_date");

      formData.append("inventory_expiration_date", expDate.toISOString());

      formData.append("inventory_profit_margin", profitMargin);
      formData.append("wholesale_price", wholesalePrice);

      //delete redundant fields
      formData.delete("inventory_retail_price");
      formData.delete("inventory_wholesale_price");
      formData.delete("inventory_total_units");

      const response = await fetch(`/api/admin/inventory/${inventoryID}`, {
        method: "PATCH",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Inventory Updated Successfully!", {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        });
      } else {
        toast.error("Failed to update inventory. Please try again later.", {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        });
      }
    } catch (error) {
      toast.error("Failed to update inventory. Please try again later.");
      console.error("Failed to patch inventory: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/inventory/${inventoryID}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Inventory Deleted Successfully!", {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        });
        setShowInventoryForm(false);
      } else {
        toast.error("Failed to delete inventory. Please try again later.", {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        });
      }
    } catch (error) {
      toast.error("Failed to delete inventory. Please try again later.");
      console.error("Failed to delete inventory: ", error);
    } finally {
      setLoading(false);
    }
  };

  const getHeaderMsg = () => {
    if (inventoryID) return "Edit an existing inventory";

    return `Create an inventory for ${productName}`;
  };

  const getSubheaderMsg = () => {
    if (inventoryID) {
      return `Edit Inventory of a product`;
    } else if (productName) {
      return `Make Inventory for ${productName}`;
    }
    return "Make Inventory";
  };

  if (dataLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="w-full sm:flex hidden px-1 mb-2">
        <div className="w-full">
          <h1 className="text-2xl font-bold mr-auto">{getHeaderMsg()}</h1>
          <h2 className="text-sm text-gray-600">{getSubheaderMsg()}</h2>
        </div>
        <div
          className="w-fit h-fit cursor-pointer "
          onClick={(e) => {
            e.stopPropagation();
            if (inventoryID) setShowProductInventories(true);
            setEditingInventoryID("");
            setShowInventoryForm(false);
          }}
        >
          <Image
            src={closeIcon}
            alt="close icon"
            width={30}
            height={30}
            className="self-end"
          />
        </div>
      </div>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col w-full h-fit px-1 py-2"
      >
        <label htmlFor="inventory_supplier" className="ml-1">
          Supplier<span className="text-red-600">*</span>
        </label>
        <SupplierInput
          setSelectedSupplier={setSelectedSupplier}
          setSupplierQuery={setSupplierQuery}
          supplierQuery={supplierQuery}
          setSupplierValid={setSupplierValid}
        />
        <p className="text-red-600 text-sm mb-3">
          {validationMessages.inventory_supplier}
        </p>

        <label htmlFor="wholesale_price" className="ml-1">
          Wholesale Price<span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="inventory_wholesale_price"
          name="inventory_wholesale_price"
          className="border p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
          value={wholesalePrice === 0 ? "" : wholesalePrice}
          onChange={(e) => {
            setWholesalePrice(e.target.value ? e.target.value : 0);
          }}
          placeholder="e.g. 12.25"
          onInput={(e) => {
            const match = e.target.value.match(/^\d*\.?\d{0,2}$/);
            if (!match) {
              e.target.value = e.target.value.slice(0, -1);
            }
          }}
        />
        <p className="text-red-600 text-sm mb-3">
          {validationMessages.inventory_wholesale_price}
        </p>

        <label htmlFor="inventory_profit_margin" className="ml-1">
          Profit Margin (%)
          {manualProfitMargin ? (
            <span className="text-red-600">*</span>
          ) : (
            <span className="text-mainButtonColorDisabled text-sm font-light">
              {" "}
              Autocomplete
            </span>
          )}
        </label>
        <input
          type="text"
          id="inventory_profit_margin"
          name="inventory_profit_margin"
          className={`border p-2 rounded-lg outline-none mb-2 ${
            manualProfitMargin
              ? "focus:ring-mainButtonColor focus:ring-1"
              : "bg-gray-100 text-gray-500"
          }`}
          value={
            manualProfitMargin
              ? profitMargin
              : manualRetailPrice
              ? `${(
                  ((retailPrice - wholesalePrice) / wholesalePrice) *
                  100
                ).toFixed(2)}%`
              : "10%"
          }
          readOnly={!manualProfitMargin}
          placeholder={
            manualProfitMargin ? "Enter profit margin (%)" : "Autocalculated"
          }
          onInput={(e) => {
            const match = e.target.value.match(/^\d*\.?\d{0,2}%?$/);
            if (!match) {
              e.target.value = e.target.value.slice(0, -1);
            }
          }}
          onBlur={(e) => {
            const value = e.target.value.trim();
            if (value && !value.endsWith("%")) {
              e.target.value = `${value}%`;
            }
          }}
          onFocus={(e) => {
            e.target.value = e.target.value.replace(/%/g, "");
          }}
          onChange={(e) => {
            const valueWithoutPercent = e.target.value.replace(/%/g, "");
            if (/^\d*\.?\d{0,2}$/.test(valueWithoutPercent)) {
              setProfitMargin(valueWithoutPercent); // Update state.
            }
          }}
          disabled={!manualProfitMargin}
        />
        <div className="flex items-center gap-2 px-1">
          <input
            type="checkbox"
            id="manual_profit_margin"
            name="manual_profit_margin"
            className="h-4 w-4"
            checked={manualProfitMargin}
            onChange={(e) => {
              setManualProfitMargin(e.target.checked);
              if (manualRetailPrice) {
                setManualRetailPrice(false);
              }
            }}
          />
          <label
            htmlFor="manual_profit_margin"
            className="text-sm text-gray-500"
          >
            Set Profit Margin Manually
          </label>
        </div>
        <p className="text-red-600 text-sm mb-3">
          {validationMessages.inventory_profit_margin}
        </p>

        <label htmlFor="retail_price" className="ml-1">
          Retail Price{" "}
          <span
            className={` text-sm font-light ${
              !manualRetailPrice
                ? "text-mainButtonColorDisabled"
                : "text-red-500"
            }`}
          >
            {" "}
            {!manualRetailPrice ? "Autocomplete" : "*"}
          </span>
        </label>

        <input
          type="text"
          id="inventory_retail_price"
          name="inventory_retail_price"
          className=" border p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 mb-2"
          value={retailPrice === 0 ? "" : retailPrice}
          onChange={(e) => {
            if (manualRetailPrice) {
              setRetailPrice(e.target.value ? e.target.value : "");
            }
          }}
          onInput={(e) => {
            const match = e.target.value.match(/^\d*\.?\d{0,2}$/);
            if (!match) {
              e.target.value = e.target.value.slice(0, -1);
            }
          }}
          placeholder="retail price"
          disabled={!manualRetailPrice}
        />
        <div className="flex gap-2 ml-1 mb-8">
          <input
            type="checkbox"
            id="manual_retail_price"
            name="manutal_retail_price"
            className="h-4 w-4"
            checked={manualRetailPrice}
            onChange={(e) => {
              setManualRetailPrice(e.target.checked);
              if (manualProfitMargin) {
                setManualProfitMargin(false);
              }
            }}
          />
          <label
            htmlFor="manual_retail_price"
            className="text-sm text-gray-500"
          >
            Set Retail Price Manually
          </label>
        </div>

        <label htmlFor="total_units" className="ml-1">
          Total Units<span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="inventory_total_units"
          name="inventory_total_units"
          className="border p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 "
          placeholder="e.g. 100"
          onInput={(e) => {
            const match = e.target.value.match(/^\d*$/);
            if (!match) {
              e.target.value = e.target.value.slice(0, -1);
            }
          }}
          defaultValue={inventory ? inventory?.inventory_total_units : ""}
        />
        <p className="text-red-600 text-sm mb-3">
          {validationMessages.inventory_total_units}
        </p>
        <label htmlFor="inventory_expiration_date" className="ml-1">
          Expiration Date<span className="text-red-600">*</span>
        </label>
        <input
          type="date"
          id="inventory_expiration_date"
          name="inventory_expiration_date"
          className="border p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
          defaultValue={expDateDisplay}
          onChange={(e) => {
            setExpDate(new Date(e.target.value));
          }}
        />
        <p className="text-red-600 text-sm mb-3">
          {validationMessages.inventory_expiration_date}
        </p>

        <label htmlFor="inventory_description" className="ml-1">
          Inventory Description
        </label>
        <textarea
          id="inventory_description"
          name="inventory_description"
          className="h-40 border px-2 py-4 rounded-lg mb-4 outline-none focus:ring-mainButtonColor focus:ring-1"
          placeholder="inventory description"
          defaultValue={inventory ? inventory?.inventory_description : ""}
        />
        <div className="flex w-full flex-row-reverse">
          <button
            type="submit"
            className={`text-white rounded-lg p-2 sm:w-fit w-full self-end flex items-center justify-center gap-1 ${
              loading || dataLoading
                ? "bg-mainButtonColorDisabled"
                : "bg-mainButtonColor"
            }`}
            disabled={loading || dataLoading}
          >
            {loading ? (
              <ButtonLoading>Processing...</ButtonLoading>
            ) : inventoryID ? (
              "Update Inventory"
            ) : (
              "Create Inventory"
            )}
          </button>
          {inventoryID && (
            <button
              className="bg-white text-red-600 rounded-lg p-2"
              onClick={() => {
                handleDelete();
              }}
              type="button"
            >
              Delete Inventory
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default CreateInventory;

const SupplierInput = ({
  setSelectedSupplier,
  supplierQuery,
  setSupplierQuery,
  setSupplierValid,
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
    setSupplierValid(false);
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
                    setSupplierValid(true);
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
