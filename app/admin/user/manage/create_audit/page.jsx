import React from "react";
import AuditForm from "@components/AuditForm";
const page = () => {
  return (
    <div className="w-full px-4 overflow-hidden py-2">
      <h1 className="text-2xl font-bold">Create Audit</h1>
      <p className="text-gray-500 mb-4">Create a new audit</p>
      <div className="w-full border mb-2"></div>

      <div className="hide_scrollbar  overflow-y-auto md:h-[75vh] h-[67vh]">
        <AuditForm />
      </div>
    </div>
  );
};

export default page;
