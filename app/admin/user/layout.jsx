import React from "react";
import Navbar from "../../../components/Navbar";
const userLayout = ({ children }) => {
  return (
    <div className="flex min-h-[100vh]">
      <Navbar />
      <div className="flex p-4 flex-1">{children}</div>
    </div>
  );
};

export default userLayout;
