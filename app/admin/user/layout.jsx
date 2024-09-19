import React from "react";
import Navbar from "../../../components/Navbar";
const userLayout = ({ children }) => {
  return (
    <div className="flex min-h-[100vh]">
      <Navbar />
      {children}
    </div>
  );
};

export default userLayout;
