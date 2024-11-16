import ReportForm from "@components/ReportForm";

const page = () => {
  return (
    <div className="w-full  p-4">
      <h1 className="text-2xl font-bold mb-1">Create Report</h1>
      <div className="w-full border mb-2"></div>
      <ReportForm />
    </div>
  );
};

export default page;
