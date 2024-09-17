import React from "react";
import Navbar from "../../../components/Navbar";
const userLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default userLayout;
