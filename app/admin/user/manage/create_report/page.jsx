import ReportForm from "@components/ReportForm";

const Page = () => {
  return (
    <div className="w-full px-4 flex flex-col sm:h-[calc(100vh-6rem)] h-[calc(100vh-10rem)] mt-2">
      <div className="px-4">
        <h1 className="text-2xl font-bold">Create Report</h1>
        <p className="text-gray-500 mb-2">
          Create a new report to track finances
        </p>
      </div>
      <div className="w-full border mb-2"></div>
      <div className="overflow-y-auto flex-1 px-4">
        <ReportForm />
      </div>
    </div>
  );
};

export default Page;
