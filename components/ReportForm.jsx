"use client";
import { useState, useEffect } from "react";

const ReportForm = () => {
  const [reports, setReports] = useState([]);
  const [cashInflow, setCashInflow] = useState(0);
  const [cashOutflow, setCashOutflow] = useState(0);
  const [showFlowUI, setShowFlowUI] = useState(false);
  useEffect(() => {
    const getReports = async () => {
      try {
        const response = await fetch("/api/admin/report");
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
  const handleCreateReport = async () => {
    console.log("generating report");
  };
  return (
    <div className="gap-2 flex flex-col">
      <h1 className="text-lg">Report History</h1>
      <div className="bg-white rounded-md p-2 shadow-md gap-2">
        {reports?.length > 0 ? (
          reports?.map((report) => {
            <div className="p-4 rounded-md bg-white" key={report.report_id}>
              <p>{`${new Date(report.report_start_date)} - ${new Date(
                report.report_end_date
              )}`}</p>
            </div>;
          })
        ) : (
          <p className="font-semibold m-2">No previous reports generated</p>
        )}
      </div>
      {showFlowUI && (
        <FlowUI
          setCashInflow={setCashInflow}
          setCashOutflow={setCashOutflow}
          handleShowCFUI={handleShowCFUI}
          handleCreateReport={handleCreateReport}
        />
      )}
      <button
        className="bg-customerRibbonGreen text-white bg-mainButtonColor p-2 rounded-md w-fit self-end"
        onClick={() => handleShowCFUI()}
      >
        Create Report
      </button>
    </div>
  );
};

export default ReportForm;

const FlowUI = ({
  setCashInflow,
  setCashOutflow,
  handleShowCFUI,
  handleCreateReport,
}) => {
  const [cashInflowValue, setCashInflowValue] = useState("");
  const [cashOutflowValue, setCashOutflowValue] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const handleInflowChange = (e) => {
    const value = e.target.value;
    setCashInflowValue(value);
    setCashInflow(value);
  };

  const handleOutflowChange = (e) => {
    const value = e.target.value;
    setCashOutflowValue(value);
    setCashOutflow(value);
  };

  useEffect(() => {
    // Check that the values are not empty and are greater than or equal to 0
    const isValid =
      cashInflowValue !== "" &&
      Number(cashInflowValue) >= 0 &&
      cashOutflowValue !== "" &&
      Number(cashOutflowValue) >= 0;
    setIsSubmitDisabled(!isValid);
  }, [cashInflowValue, cashOutflowValue]);

  return (
    <div className="w-[20rem] gap-2 flex flex-col rounded-md shadow-md p-4 absolute self-center top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 bg-white">
      <label className="font-bold" htmlFor="cashInflow">
        Cash Flow
      </label>
      <input
        type="number"
        placeholder="Enter cash inflow"
        value={cashInflowValue}
        onChange={handleInflowChange}
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
        name="cashInflow"
      />
      <label className="font-bold" htmlFor="cashOutflow">
        Cash Outflow
      </label>
      <input
        type="number"
        placeholder="Enter cash outflow"
        value={cashOutflowValue}
        onChange={handleOutflowChange}
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
        name="cashOutflow"
      />
      <div className="flex gap-1 flex-row-reverse w-full">
        <button
          className={`p-2 rounded text-white ${
            isSubmitDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-mainButtonColor"
          }`}
          onClick={() => {
            handleShowCFUI();
            handleCreateReport();
          }}
          disabled={isSubmitDisabled}
        >
          Submit
        </button>
        <button
          className="p-2 rounded text-black"
          onClick={() => {
            handleShowCFUI();
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
