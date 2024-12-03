"use client";
import { useState } from "react";
import Image from "next/image";
import inventoryReportIcon from "@public/icons/inventory_report_icon.png";
import ButtonLoading from "@components/ButtonLoading";
import { toast } from "react-hot-toast";

const InventoryReport = ({
  setShowInventoryReport = () => {},
  setEditingProductID = () => {},
  showInventoryReport = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    startDate: false,
    endDate: false,
  });

  const displayError = (message) => {
    toast.error(message ? message : "Please check the inputs and try again", {
      duration: 3000,
      style: {
        fontSize: "1.2rem",
        padding: "16px",
      },
    });
  };

  const validateDates = () => {
    let msg = "";
    const errors = {
      startDate: false,
      endDate: false,
    };

    if (!startDate) {
      errors.startDate = true;
    }

    if (!endDate) {
      errors.endDate = true;
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        errors.startDate = true;
        errors.endDate = true;
        msg = "Start date must be before end date";
      }
    }

    if (errors.startDate || errors.endDate) {
      displayError(msg);
    }

    setValidationErrors(errors);

    return !Object.values(errors).some((error) => error);
  };

  const handleCreateInventoryReport = async () => {
    if (!validateDates()) return;
    try {
      setLoading(true);
      const start = new Date(startDate);
      const end = new Date(endDate);
      const request = await fetch(
        `/api/admin/date?startDate=${start.toISOString()}&endDate=${end.toISOString()}`
      );
      const response = await request.json();
      console.log(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full flex-1 flex justify-end">
      <button
        className={`bg-mainButtonColor p-1 text-white text-sm truncate self-end object-cover h-10 w-10 rounded-md ${
          showInventoryReport ? "z-20 " : "z-0 "
        }`}
        onClick={() => {
          setShowInventoryReport((prev) => !prev);
          setEditingProductID("");
        }}
      >
        <span>
          <Image src={inventoryReportIcon} height={50} width={50} />
        </span>
      </button>
      {showInventoryReport && (
        <>
          {/* Backdrop for small screens */}
          <div className="fixed inset-0 bg-[rgba(120,120,120,0.75)] z-10 sm:hidden h-[calc(100vh-4.5rem)]" />

          {/* Inventory Report */}
          <div className="absolute top-12 sm:right-0 -right-[3.25rem] rounded-md shadow-lg bg-white px-6 py-4 w-[calc(100vw-1rem)] sm:w-[20rem] flex flex-col z-20">
            <span className="text-lg font-semibold">
              Generate Inventory Report
            </span>
            <label className="text-sm font-light mb-1" htmlFor="start_date">
              Start Date
            </label>
            <input
              type="date"
              className={`p-2 border rounded-md ${
                validationErrors.startDate
                  ? "border-red-500 mb-0"
                  : "border-gray-300 mb-4"
              }`}
              id="start_date"
              name="start_date"
              onChange={(e) => {
                setStartDate(e.target.value);
                setValidationErrors((prev) => ({ ...prev, startDate: false }));
              }}
            />
            {validationErrors.startDate && (
              <span className="text-red-500 text-sm mb-4">
                Please select a valid start date
              </span>
            )}
            <label className="text-sm font-light mb-1" htmlFor="end_date">
              End Date
            </label>
            <input
              type="date"
              className={`p-2 border rounded-md  ${
                validationErrors.endDate
                  ? "border-red-500 mb-0"
                  : "border-gray-300 mb-6"
              }`}
              id="end_date"
              name="end_date"
              onChange={(e) => {
                setEndDate(e.target.value);
                setValidationErrors((prev) => ({ ...prev, endDate: false }));
              }}
            />
            {validationErrors.endDate && (
              <span className="text-red-500 text-sm mb-6">
                Please select a valid end date
              </span>
            )}
            <button
              onClick={handleCreateInventoryReport}
              className={` text-white px-4 py-2 rounded-md ${
                loading
                  ? "cursor-not-allowed bg-mainButtonColorDisabled"
                  : "cursor-pointer bg-mainButtonColor"
              }`}
            >
              {loading ? (
                <ButtonLoading>Processing...</ButtonLoading>
              ) : (
                "Create Inventory Report"
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default InventoryReport;
