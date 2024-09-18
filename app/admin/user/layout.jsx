import React from "react";
import Navbar from "../../../components/Navbar";
const userLayout = ({ children }) => {
  return (
    <div className="flex min-h-[100vh] flex-col sm:flex-row ">
      <Navbar />
      {children}
    </div>
  );
};

export default userLayout;
