import ReportForm from "@components/ReportForm";

const page = () => {
  return (
    <div className="w-full px-4 overflow-hidden py-2">
      <h1 className="text-2xl font-bold mb-1">Create Report</h1>
      <p className="text-gray-500 mb-4">Create a new report</p>
      <div className="w-full border mb-2"></div>
      <div className="hide_scrollbar w-full  mb-2 md:h-[75vh] h-[67vh]">
        <ReportForm />
      </div>
    </div>
  );
};

export default page;
