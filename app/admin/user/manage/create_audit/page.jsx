import React from "react";
import AuditForm from "@components/AuditForm";
const page = () => {
  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold">Create Audit</h1>
      <p className="text-gray-500 mb-4">Create a new audit</p>
      <div className="w-full border mb-2"></div>

      <div className="h-[75vh] overflow-y-auto">
        <AuditForm />
      </div>
    </div>
  );
};

export default page;
