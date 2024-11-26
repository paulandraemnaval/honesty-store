"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import placeholderImage from "@public/defaultImages/placeholder_image.png";
const AuditForm = () => {
  const [inventories, setInventories] = useState([]);
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getInventories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/inventory");
        const data = await response.json();
        setInventories(
          Array.isArray(data?.inventories) ? data.inventories : []
        );
      } catch (err) {
        console.error("Failed to fetch inventories: ", err);
        setInventories([]);
      } finally {
        setLoading(false);
      }
    };
    getInventories();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch("/api/admin/products");
        const data = await response.json();
        setProducts(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error("Failed to fetch products: ", err);
        setProducts([]);
      }
    };
    getProducts();
  }, []);

  const getProductName = (productId) => {
    const product = products.find(
      (product) => product.product_id === productId
    );
    return product ? product.product_name : "";
  };

  const getProductImage = (productId) => {
    const product = products.find(
      (product) => product.product_id === productId
    );
    return product ? product.product_image_url : "";
  };
  const handleQuantityChange = (inventoryId, value) => {
    const updatedQuantities = {
      ...quantities,
      [inventoryId]: value,
    };

    const allFieldsValid =
      filteredInventories.length > 0 &&
      filteredInventories.every((inventory) => {
        const quantity = updatedQuantities[inventory.inventory_id];
        return (
          quantity !== undefined &&
          quantity !== "" &&
          !quantity.includes("-") &&
          Number(quantity) >= 0
        );
      });

    setQuantities(updatedQuantities);
    setSubmitEnabled(allFieldsValid);
  };

  const handleShowSummary = () => {
    setShowSummary((prev) => !prev);
  };

  const submitAudit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const newQuantities = Object.entries(quantities).map(
      ([inventoryId, quantity]) => ({
        inventoryId,
        remaining: quantity,
      })
    );

    try {
      const response = await fetch("/api/admin/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuantities),
      });
      const data = await response.json();
      if (response.ok) {
        setQuantities({});
      } else {
        console.error("Failed to submit audit: ", data.error);
      }
    } catch (err) {
      console.error("Failed to submit audit: ", err);
    } finally {
      setIsProcessing(false);
      handleShowSummary();
    }
  };

  const filteredInventories = inventories.filter((inventory) =>
    products.some((product) => product.product_id === inventory.product_id)
  );

  return (
    <div className="overflow-auto max-h-full flex flex-col">
      <form
        className="gap-4 flex flex-col p-2 relative overflow-auto"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <span className="spinner-border-blue animate-spin w-10 h-10 border-2 border-mainButtonColor border-t-transparent rounded-full mr-2"></span>
            <p className="text-black">Loading...</p>
          </div>
        ) : filteredInventories.length > 0 ? (
          filteredInventories.map((inventory) => (
            <AuditFormField
              key={inventory.inventory_id}
              inventory={inventory}
              productName={getProductName(inventory.product_id)}
              image={getProductImage(inventory.product_id)}
              onChange={handleQuantityChange}
              quantities={quantities}
            />
          ))
        ) : (
          <p>No auditable inventories found</p>
        )}

        <button
          className={`bg-customerRibbonGreen text-white py-2 px-4 rounded-md w-fit self-end ${
            !submitEnabled
              ? "cursor-not-allowed bg-mainButtonColorDisabled"
              : "bg-mainButtonColor"
          }`}
          onClick={() => {
            handleShowSummary();
          }}
          disabled={!submitEnabled}
        >
          Submit
        </button>
      </form>
      {showSummary && (
        <Summary
          inventories={filteredInventories}
          quantities={quantities}
          handleShowSummary={handleShowSummary}
          submitAudit={submitAudit}
          getProductName={getProductName}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
};

const AuditFormField = ({
  image,
  inventory,
  productName,
  onChange,
  quantities,
}) => {
  const handleChange = (e) => {
    onChange(inventory.inventory_id, e.target.value);
  };

  return (
    <div className="w-full rounded-md shadow-md p-4 bg-white">
      <div className="flex gap-2 w-full mb-2">
        <label htmlFor={inventory.inventory_id} className="mt-auto mr-auto">
          {productName}
        </label>
        <Image
          src={image || placeholderImage}
          alt={productName || "Product image"}
          height={40}
          width={40}
        />
      </div>
      <input
        type="number"
        name={inventory.inventory_id}
        id={inventory.inventory_id}
        placeholder="Enter quantity"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border w-full border-gray-300"
        onChange={handleChange}
        value={quantities[inventory.inventory_id] || ""}
        required
        min="0"
      />
    </div>
  );
};

const Summary = ({
  submitAudit,
  inventories,
  quantities,
  handleShowSummary,
  getProductName,
  isProcessing,
}) => {
  return (
    <div className="w-[24rem] rounded-md shadow-md p-4 absolute self-center top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 bg-white">
      <h2 className="text-xl font-semibold mb-2">Summary</h2>
      <hr />
      <div className="flex mb-2 mt-4">
        <h2 className="font-semibold mr-auto">Product Name</h2>
        <h2 classname="font-semibold">New Quantity</h2>
      </div>
      <div className="flex mb-4">
        {Object.entries(quantities).map(([inventoryId, quantity]) => (
          <div key={inventoryId} className="flex w-full">
            <p className="text-base mr-auto">
              {getProductName(
                inventories.find((inv) => inv.inventory_id === inventoryId)
                  .product_id
              )}
            </p>
            {quantity}
          </div>
        ))}
      </div>
      <div className="flex gap-2 flex-row-reverse w-full">
        <button
          type="submit"
          className="bg-mainButtonColor text-white py-2 px-4 w-fit rounded-md"
          onClick={(e) => submitAudit(e)}
        >
          {isProcessing ? "Submitting..." : "Submit"}
        </button>
        <button
          className="text-customerRibbonGreen"
          onClick={() => handleShowSummary()}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AuditForm;
