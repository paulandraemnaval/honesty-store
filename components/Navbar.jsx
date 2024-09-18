import React from "react";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="flex">
      {/*desktop nav*/}
      <div className="sm:flex hidden h-full flex-col bg-green-400 gap-6 py-8 px-2 max-w-16">
        <div className=" border-gray-300 justify-center align-center flex mb-auto text-center">
          logo goes here
        </div>
        <div className=" border-gray-300 justify-center align-center flex text-center">
          home
        </div>
        <div className=" border-gray-300 justify-center align-center flex">
          sales
        </div>
        <div className=" border-gray-300 justify-center align-center flex ">
          products
        </div>
        <div className=" border-gray-300 justify-center align-center flex mt-auto">
          me
        </div>
      </div>

      {/*mobile nav*/}
      <div className="sm:hidden fixed bottom-0 flex bg-green-400 w-full py-2 px-2 justify-between">
        <div className="p-4">home</div>
        <div className="p-4">sales</div>
        <div className="p-4">product</div>
        <div className="p-4">me</div>
      </div>
    </nav>
  );
};

export default Navbar;
