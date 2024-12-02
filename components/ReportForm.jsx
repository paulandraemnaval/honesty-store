"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import downArrow from "@public/icons/down_arrow_icon.png";
import upArrow from "@public/icons/up_arrow_icon.png";
import ButtonLoading from "@components/ButtonLoading";
import { toast } from "react-hot-toast";
const ReportForm = () => {
  const [reports, setReports] = useState([]);
  const [showFlowUI, setShowFlowUI] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [expandedStates, setExpandedStates] = useState({});
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const getReports = async () => {
      try {
        const response = await fetch("/api/admin/report", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lastVisible: null }),
        });
        const data = await response.json();
        if (response.ok) {
          setReports(Array.isArray(data?.reports) ? data.reports : []);
        } else setReports([]);
      } catch (err) {
        console.log(err);
      }
    };
    getReports();
  }, [refresh]);

  const toggleExpand = (reportId) => {
    setExpandedStates((prevStates) => ({
      ...prevStates,
      [reportId]: !prevStates[reportId],
    }));
  };

  const handleShowCFUI = () => {
    setShowFlowUI((prev) => !prev);
  };

  return (
    <div className="gap-2 flex flex-col">
      <h1 className="text-lg">Report History</h1>
      {reports?.length > 0 ? (
        reports?.map((report) => {
          const startDate = new Date(report.report_start_date.seconds * 1000);
          const lastUpdatedDate = new Date(
            report.report_last_updated.seconds * 1000
          );

          const formattedStartDate = startDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          });
          const formattedLastUpdatedDate = lastUpdatedDate.toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "2-digit",
            }
          );

          return (
            <div key={report.report_id}>
              <div
                className={`w-full border rounded-sm p-4 flex flex-col sm:hover:bg-gray-100 cursor-pointer transition-colors bg-white`}
                onClick={() => toggleExpand(report.report_id)}
              >
                <div className="flex items-center">
                  <span className="mr-auto">
                    {`${formattedStartDate} - ${formattedLastUpdatedDate}`}
                  </span>
                  <Image
                    src={expandedStates[report.report_id] ? upArrow : downArrow}
                    alt="arrow"
                    height={20}
                    width={20}
                  />
                </div>
              </div>
              {expandedStates[report.report_id] && (
                <div className="p-4 bg-gray-50 shadow-md">
                  <div className="mb-2">
                    <span className="font-semibold">Cash Inflow:</span>{" "}
                    {report.report_cash_inflow}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Cash Outflow:</span>{" "}
                    {report.report_cash_outflow}
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="font-semibold m-2">No previous reports generated</p>
      )}

      {showFlowUI && (
        <FlowUI handleShowCFUI={handleShowCFUI} setRefresh={setRefresh} />
      )}
      <button
        className="text-white bg-mainButtonColor p-2 rounded-md w-fit self-end"
        onClick={() => handleShowCFUI()}
      >
        Create Report
      </button>
    </div>
  );
};

export default ReportForm;
const FlowUI = ({ handleShowCFUI, setRefresh }) => {
  const [cashInflowValue, setCashInflowValue] = useState("");
  const [cashOutflowValue, setCashOutflowValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    cashInflow: "",
    cashOutflow: "",
  });

  const handleCreateReport = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    try {
      setIsProcessing(true);
      const formData = new FormData();
      formData.append("cashInflow", cashInflowValue);
      formData.append("cashOutflow", cashOutflowValue);
      const request = await fetch("/api/admin/report", {
        method: "POST",
        body: formData,
      });
      if (request.ok) {
        setCashInflowValue("");
        setCashOutflowValue("");
        setRefresh((prev) => !prev);
        toast.success("Report created successfully", {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        });
      } else {
        toast.error("Failed to create report", {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        });
      }
    } catch (err) {
      toast.error("Failed to create report", {
        duration: 3000,
        style: {
          fontSize: "1.2rem",
          padding: "16px",
        },
      });
      console.log(err);
    } finally {
      setIsProcessing(false);
      handleShowCFUI();
    }
  };

  const validateInputs = () => {
    let valid = true;
    let newErrorMessages = { cashInflow: "", cashOutflow: "" };

    // Cash inflow validation
    if (
      parseFloat(cashInflowValue) < 0 ||
      isNaN(cashInflowValue) ||
      cashInflowValue === ""
    ) {
      newErrorMessages.cashInflow =
        "Cash Inflow must greater than or equal to 0";
      valid = false;
    }

    // Cash outflow validation
    if (
      parseFloat(cashOutflowValue) < 0 ||
      isNaN(cashOutflowValue) ||
      cashOutflowValue === ""
    ) {
      newErrorMessages.cashOutflow =
        "Cash Outflow must greater than or equal to 0";
      valid = false;
    }

    setErrorMessages(newErrorMessages);
    return valid;
  };

  // Handle numeric input with up to 2 decimal places
  const handleInputChange = (e, setter) => {
    const value = e.target.value;

    // Regex for numbers with optional decimal point and up to two decimals
    const regex = /^\d*\.?\d{0,2}$/;

    if (regex.test(value) || value === "") {
      setter(value);
    }
  };

  return (
    <div className="fixed  h-full sm:w-[calc(100vw-14rem)] w-full bg-black bg-opacity-50 flex justify-center items-center top-0 right-0">
      <form
        className="w-[20rem] gap-2 flex flex-col shadow-md rounded-md p-4 bg-white"
        onSubmit={(e) => handleCreateReport(e)}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Create Report</h2>
        </div>
        <label className="font-bold" htmlFor="cashInflow">
          Cash Inflow
        </label>
        <input
          type="text"
          placeholder="Enter cash inflow"
          value={cashInflowValue}
          onChange={(e) => handleInputChange(e, setCashInflowValue)}
          className={`h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border  ${
            errorMessages.cashInflow ? "border-red-500" : "border-gray-300"
          }`}
          name="cashInflow"
        />
        {errorMessages.cashInflow && (
          <p className="text-red-500 text-sm mt-2">
            {errorMessages.cashInflow}
          </p>
        )}

        <label className="font-bold" htmlFor="cashOutflow">
          Cash Outflow
        </label>
        <input
          type="text"
          placeholder="Enter cash outflow"
          value={cashOutflowValue}
          onChange={(e) => handleInputChange(e, setCashOutflowValue)}
          className={`h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border  ${
            errorMessages.cashOutflow ? "border-red-500" : "border-gray-300"
          }`}
          name="cashOutflow"
        />
        {errorMessages.cashOutflow && (
          <p className="text-red-500 text-sm mt-2">
            {errorMessages.cashOutflow}
          </p>
        )}

        <div className="flex gap-2 flex-row-reverse w-full">
          <button
            type="submit"
            className={`p-2 rounded text-white ${
              isProcessing
                ? "bg-mainButtonColorDisabled cursor-not-allowed"
                : "bg-mainButtonColor"
            }`}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ButtonLoading>Processing...</ButtonLoading>
            ) : (
              "Submit"
            )}
          </button>
          <button
            type="button"
            className="p-2 rounded text-black"
            onClick={() => handleShowCFUI()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
