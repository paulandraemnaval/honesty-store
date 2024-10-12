import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="flex">
      {/*desktop nav*/}
      <div className="sm:flex hidden h-full items-center justify-center flex-col bg-green-400 gap-6 py-8 px-2 max-w-20">
        <div className=" border-gray-300 justify-center align-center text-center">
          <Link href="/admin/user">Dash</Link>
        </div>
        <div className=" border-gray-300 justify-center align-center text-center">
          <Link href="/admin/user/products">products</Link>
        </div>
        <div className=" border-gray-300 justify-center align-center text-center">
          <Link href="/admin/user/manage">Manage</Link>
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
