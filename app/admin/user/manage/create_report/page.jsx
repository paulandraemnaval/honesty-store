import ReportForm from "@components/ReportForm";

const page = () => {
  return (
    <div className="w-full px-4 flex flex-col sm:h-[calc(100vh-5rem)] h-[calc(100vh-9rem)] mt-2">
      <h1 className="text-2xl font-bold mb-1">Create Report</h1>
      <p className="text-gray-500 mb-4">Create a new report</p>
      <div className="w-full border mb-2"></div>
      <div className="overflow-y-auto flex-1">
        <ReportForm />
      </div>
    </div>
  );
};

export default page;
