"use client";
import ReportForm from "@components/ReportForm";

const Page = () => {
  const openGoogleSheet = () => {
    const url =
      "https://docs.google.com/spreadsheets/d/1PYKAm1mg1lbl5Qzn0JpltTpXsYcy3o0fbcQZR5aTnGI/edit?gid=1034794333#gid=1034794333";
    window.open(url, "_blank"); // Opens the URL in a new tab
  };

  return (
    <div className="w-full px-4 flex flex-col sm:h-[calc(100vh-6rem)] h-[calc(100vh-10rem)] mt-2">
      <div className="px-4 flex">
        <div className="flex flex-col w-full">
          <h1 className="text-2xl font-bold">Create Report</h1>
          <p className="text-gray-500 mb-2">
            Create a new report to track finances
          </p>
        </div>
        <div className="py-1 mt-auto mb-auto">
          <button
            className="bg-green-600 text-white rounded-md text-sm w-fit py-2 px-4"
            onClick={openGoogleSheet}
          >
            Google Sheets
          </button>
        </div>
      </div>
      <div className="w-full border mb-2"></div>
      <div className="overflow-y-auto flex-1 px-4">
        <ReportForm />
      </div>
    </div>
  );
};

export default Page;
