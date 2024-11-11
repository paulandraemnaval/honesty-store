import React from "react";
import AuditForm from "@components/AuditForm";
const page = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Create Audit</h1>
      <p className="text-gray-500 mb-4">Create a new audit</p>
      <AuditForm />
    </div>
  );
};

export default page;
