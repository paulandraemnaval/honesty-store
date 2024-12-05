"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import placeholderImage from "@public/defaultImages/placeholder_image.png";
import { toast } from "react-hot-toast";
import ButtonLoading from "./ButtonLoading";
import Loading from "@components/Loading"; // Import your Loading component

const AuditForm = () => {
  const [inventories, setInventories] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [refreshForm, setRefreshForm] = useState(false); // New state to trigger re-render

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
  }, [refreshForm]); // Re-fetch inventories when the form is refreshed

  const handleQuantityChange = (inventoryId, value) => {
    setQuantities({
      ...quantities,
      [inventoryId]: value,
    });
  };

  const validateQuantities = () => {
    let valid = true;
    let newErrorMessages = {};

    inventories.forEach((prdwinv) => {
      const quantity = quantities[prdwinv.inventory.inventory_id]?.trim();
      const inventoryTotal = prdwinv.inventory.inventory_total_units;

      if (quantity === "") return;

      if (Number(quantity) > inventoryTotal || Number(quantity) < 0) {
        newErrorMessages[
          prdwinv.inventory.inventory_id
        ] = `Invalid quantity. Must be between 0 and ${inventoryTotal}`;
        valid = false;
      }
    });

    if (!valid) {
      toast.error("Invalid quantities. Please check the highlighted fields.", {
        duration: 3000,
        style: {
          fontSize: "1.2rem",
          padding: "16px",
        },
      });
    }

    setErrorMessages(newErrorMessages);
    return valid;
  };

  const submitAudit = async (e) => {
    e.preventDefault();

    if (!validateQuantities()) {
      console.log("Invalid quantities");
      return;
    }

    setIsProcessing(true);

    const newQuantities = Object.entries(quantities)
      .filter(([inventoryId, quantity]) => {
        const inventory = inventories.find(
          (prdwinv) => prdwinv.inventory.inventory_id === inventoryId
        );

        return (
          quantity?.trim() !== "" &&
          Number(quantity) !== inventory.inventory.inventory_total_units
        );
      })
      .map(([inventoryId, quantity]) => ({
        inventoryId,
        remaining: Number(quantity),
      }));

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
        toast.success("Audit submitted successfully", {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        });
        setQuantities({});
        setShowSummary(false);
        setRefreshForm((prev) => !prev);
      } else {
        console.error("Failed to submit audit: ", data.error);
      }
    } catch (err) {
      console.error("Failed to submit audit: ", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShowSummary = () => {
    setShowSummary(false);
  };

  return (
    <div className="overflow-auto max-h-full flex flex-col">
      <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
        {loading ? (
          <div className="flex justify-center items-center h-96 col-span-full">
            <span className="spinner-border-blue animate-spin w-10 h-10 border-2 border-mainButtonColor border-t-transparent rounded-full mr-2"></span>
            <p className="text-black">Loading...</p>
          </div>
        ) : inventories?.length > 0 ? (
          inventories?.map((prdwinv) => (
            <AuditFormField
              key={prdwinv.inventory.inventory_id}
              inventory={prdwinv.inventory}
              productName={prdwinv.product.product_name}
              image={prdwinv.product.product_image_url}
              quantities={quantities}
              errorMessages={errorMessages}
              inventoryId={prdwinv.inventory.inventory_id}
              handleQuantityChange={handleQuantityChange}
            />
          ))
        ) : (
          <p className="col-span-full">No auditable inventories found</p>
        )}
      </form>
      <div className={`${loading ? "hidden" : "flex"} w-full flex-row-reverse`}>
        <button
          type="button"
          className={`bg-customerRibbonGreen text-white py-2 px-4 rounded-md w-fit mt-4 bg-mainButtonColor`}
          onClick={() =>
            isProcessing
              ? null
              : validateQuantities()
              ? setShowSummary(true)
              : null
          }
        >
          Submit
        </button>
      </div>

      {showSummary && (
        <Summary
          inventories={inventories}
          quantities={quantities}
          submitAudit={submitAudit}
          isProcessing={isProcessing}
          handleShowSummary={handleShowSummary}
        />
      )}
    </div>
  );
};

const AuditFormField = ({
  image,
  inventory,
  productName,
  quantities,
  errorMessages,
  inventoryId,
  handleQuantityChange,
}) => {
  const errorMessage = errorMessages[inventoryId] || "";

  return (
    <div className="w-full rounded-md shadow-md p-4 bg-white flex flex-col items-center">
      <Image
        src={image || placeholderImage}
        alt={productName || "Product image"}
        className="rounded-md object-cover mb-auto"
        height={150}
        width={150}
      />
      <h3 className="text-center font-semibold mt-4 mb-2 text-sm sm:text-base">
        {productName}
      </h3>
      <div className="flex flex-col w-full ">
        <div className="flex items-center justify-center gap-2 ">
          <label
            htmlFor={inventory.inventory_id}
            className="text-left text-sm font-light self-start mr-auto "
          >
            Quantity
          </label>
          {errorMessage && (
            <span className="text-red-500 text-xs text-right w-full ml-auto ">
              {errorMessage}
            </span>
          )}
        </div>
        <input
          type="text"
          name={inventory.inventory_id}
          id={inventory.inventory_id}
          placeholder={`0 - ${inventory.inventory_total_units}`}
          className={` w-full p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border-2 ${
            errorMessage ? "border-red-500" : "border"
          }`}
          value={quantities[inventory.inventory_id] || ""}
          onInput={(e) => {
            const match = e.target.value.match(/^\d*$/);
            if (!match) {
              e.target.value = e.target.value.slice(0, -1);
            }
          }}
          onChange={(e) => {
            handleQuantityChange(inventory.inventory_id, e.target.value);
          }}
        />
      </div>
    </div>
  );
};
const Summary = ({
  submitAudit,
  inventories,
  quantities,
  isProcessing,
  handleShowSummary,
}) => {
  return (
    <div className="fixed  h-full sm:w-[calc(100vw-14rem)] w-full bg-black bg-opacity-50 flex justify-center items-center top-0 right-0 ">
      <div className="w-[40rem] max-h-[80vh] rounded-md shadow-md py-6 px-4 bg-white overflow-hidden relative mt-0 sm:mt-20">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Audit Summary
        </h2>
        <div className="overflow-auto max-h-[60vh] border-t border-gray-300">
          <div className="flex font-semibold text-lg border-b border-gray-300 p-2">
            <div className="flex-1">Product</div>
            <div className="flex-1 text-center">Prev</div>
            <div className="w-8 flex items-center justify-center"></div>
            <div className="flex-1 text-center">New</div>
          </div>
          {inventories.map((prdwinv) => (
            <div
              key={prdwinv.inventory.inventory_id}
              className="flex items-center p-2 border-b border-gray-200"
            >
              <div className="flex-1 truncate">
                {prdwinv.product.product_name}
              </div>
              <div className="flex-1 text-center">
                {prdwinv.inventory.inventory_total_units}
              </div>
              <div className="w-8 flex items-center justify-center">
                <span className="text-xl text-mainButtonColor">→</span>
              </div>
              <div className="flex-1 text-center">
                {quantities[prdwinv.inventory.inventory_id] || "-"}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 w-full">
          <button
            className={`bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400 cursor-pointer`}
            onClick={() => {
              handleShowSummary();
            }}
            disabled={isProcessing}
          >
            Close
          </button>
          <button
            className={`py-2 px-4 rounded-md text-white w-fit self-end  border ${
              isProcessing
                ? "bg-mainButtonColorDisabled cursor-not-allowed"
                : "bg-mainButtonColor  hover:bg-mainButtonColorHover"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              submitAudit(e);
            }}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ButtonLoading>Processing...</ButtonLoading>
            ) : (
              "Confirm Audit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditForm;
