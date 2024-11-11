"use client";
import React from "react";
import Image from "next/image";
import placeholderImage from "@public/defaultImages/placeholder_image.png";
const AuditForm = () => {
  const [inventories, setInventories] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [quantities, setQuantities] = React.useState({});
  const [showSummary, setShowSummary] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  React.useEffect(() => {
    const getInventories = async () => {
      try {
        const response = await fetch("/api/admin/inventory");
        const data = await response.json();
        if (response.status === 200) {
          setInventories(data?.inventories || []);
        } else {
          setInventories([]);
        }
      } catch (err) {
        console.error("Failed to fetch inventories: ", err);
        setInventories([]);
      }
    };
    getInventories();
  }, []);

  React.useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch("/api/admin/products");
        const data = await response.json();
        if (response.status === 200) {
          setProducts(data?.data || []);
        } else {
          setProducts([]);
        }
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
    setQuantities((prev) => ({
      ...prev,
      [inventoryId]: value,
    }));
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

  return (
    <>
      <form
        className="gap-4 flex flex-col p-2 relative"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {inventories.map((inventory) => (
          <AuditFormField
            key={inventory.inventory_id}
            inventory={inventory}
            productName={getProductName(inventory.inventory_product)}
            image={getProductImage(inventory.inventory_product)}
            onQuantityChange={handleQuantityChange}
            quantities={quantities}
          />
        ))}

        <button
          className="bg-customerRibbonGreen text-white py-2 px-4 w-fit rounded-md"
          onClick={() => {
            handleShowSummary();
          }}
        >
          Submit
        </button>
      </form>
      {showSummary && (
        <Summary
          inventories={inventories}
          quantities={quantities}
          handleShowSummary={handleShowSummary}
          submitAudit={submitAudit}
          getProductName={getProductName}
          isProcessing={isProcessing}
        />
      )}
    </>
  );
};

const AuditFormField = ({
  image,
  inventory,
  productName,
  onQuantityChange,
  quantities,
}) => {
  const handleChange = (e) => {
    onQuantityChange(inventory.inventory_id, e.target.value);
  };

  return (
    <div className="w-full rounded-md shadow-md p-4">
      <div className="flex gap-2 w-full">
        <Image
          src={image || placeholderImage}
          alt={productName || "Product image"}
          height={40}
          width={40}
        />
        <label htmlFor={inventory.inventory_id} className="mt-auto">
          {productName}
        </label>
      </div>
      <input
        type="number"
        name={inventory.inventory_id}
        id={inventory.inventory_id}
        placeholder="Enter quantity"
        className="w-full p-2 border border-gray-200 rounded-md mt-2"
        onChange={handleChange}
        value={quantities[inventory.inventory_id] || ""}
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
                  .inventory_product
              )}
            </p>
            {quantity}
          </div>
        ))}
      </div>
      <div className="flex gap-2 flex-row-reverse w-full">
        <button
          type="submit"
          className="bg-customerRibbonGreen text-white py-2 px-4 w-fit rounded-md"
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
