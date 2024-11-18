"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import downArrow from "@public/icons/down_arrow_icon.png";
import upArrow from "@public/icons/up_arrow_icon.png";
//TODO: implement infinite scroll for the report history, use patch and lastVisible in request body

const ReportForm = () => {
  const [reports, setReports] = useState([]);
  const [showFlowUI, setShowFlowUI] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
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
  }, []);
  const handleShowCFUI = () => {
    setShowFlowUI((prev) => !prev);
  };

  return (
    <div className="gap-2 flex flex-col">
      <h1 className="text-lg">Report History</h1>
      <div className="bg-white rounded-md p-2 shadow-md gap-2">
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
              <div
                className="py-1 px-2 rounded-md flex flex-col"
                key={report.report_id}
              >
                <div className="flex">
                  <p className="mr-auto">{`${formattedStartDate} - ${formattedLastUpdatedDate}`}</p>
                  <Image
                    src={isExpanded ? downArrow : upArrow}
                    alt="arrow"
                    height={20}
                    width={20}
                    onClick={() => setIsExpanded((prev) => !prev)}
                  />
                </div>
                {!isExpanded && (
                  <div className="bg-mainButtonColor py-1 px-2 rounded-sm text-white">
                    <p>{`Cash Inflow: ${report.report_cash_inflow}`}</p>
                    <p>{`Cash Outflow: ${report.report_cash_outflow}`}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="font-semibold m-2">No previous reports generated</p>
        )}
      </div>

      {showFlowUI && <FlowUI handleShowCFUI={handleShowCFUI} />}
      <button
        className=" text-white bg-mainButtonColor p-2 rounded-md w-fit self-end"
        onClick={() => handleShowCFUI()}
      >
        Create Report
      </button>
    </div>
  );
};

export default ReportForm;

const FlowUI = ({ handleShowCFUI }) => {
  const [cashInflowValue, setCashInflowValue] = useState(0);
  const [cashOutflowValue, setCashOutflowValue] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreateReport = async (e) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      const formData = new FormData();
      formData.append("cashInflow", cashInflowValue);
      formData.append("cashOutflow", cashOutflowValue);
      const request = await fetch("/api/admin/report", {
        method: "POST",
        body: formData,
      });
      const response = await request.json();
    } catch (err) {
      console.log(err);
    } finally {
      setIsProcessing(false);
      handleShowCFUI();
    }
  };
  const handleInflowChange = (e) => {
    const value = e.target.value;
    setCashInflowValue(value);
  };

  const handleOutflowChange = (e) => {
    const value = e.target.value;
    setCashOutflowValue(value);
  };

  useEffect(() => {
    const isValid =
      cashInflowValue !== "" &&
      Number(cashInflowValue) >= 0 &&
      cashOutflowValue !== "" &&
      Number(cashOutflowValue) >= 0;
    setIsSubmitDisabled(!isValid);
  }, [cashInflowValue, cashOutflowValue]);

  return (
    <form
      className="w-[20rem] gap-2 flex flex-col rounded-md shadow-md p-4 absolute self-center top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 bg-white"
      onSubmit={() => handleCreateReport()}
    >
      <label className="font-bold" htmlFor="cashInflow">
        Cash Flow
      </label>
      <input
        type="number"
        placeholder="Enter cash inflow"
        value={cashInflowValue}
        onChange={(e) => handleInflowChange(e)}
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
        name="cashInflow"
      />
      <label className="font-bold" htmlFor="cashOutflow">
        Cash Outflow
      </label>
      <input
        type="number"
        placeholder="Enter cash outflow"
        value={cashOutflowValue}
        onChange={(e) => handleOutflowChange(e)}
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
        name="cashOutflow"
      />
      <div className="flex gap-1 flex-row-reverse w-full">
        <button
          type="submit"
          className={`p-2 rounded text-white ${
            isSubmitDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-mainButtonColor"
          }`}
          onClick={(e) => {
            handleCreateReport(e);
          }}
          disabled={isSubmitDisabled}
        >
          {isProcessing ? "Processing..." : "Submit"}
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
  );
};
