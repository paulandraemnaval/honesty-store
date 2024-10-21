import Link from "next/link";
import React from "react";
import Image from "next/image";
import homeIcon from "@public/icons/home_icon.png";
import salesIcon from "@public/icons/sales_icon.png";
import accountManagementIcon from "@public/icons/account_management_icon.png";
import inventoryIcon from "@public/icons/inventory_icon.png";

const Navbar = () => {
  return (
    <nav className="flex">
      {/*desktop nav*/}
      <div className="sm:flex hidden h-full items-center justify-center flex-col bg-customerRibbonGreen gap-6 py-8 px-2 max-w-20">
        <div className=" border-gray-300 justify-center align-center text-center flex">
          <Image src={homeIcon} alt="home_icon" height={30} width={30} />
          <Link href="/admin/user">Dash</Link>
        </div>
        <div className=" border-gray-300 justify-center align-center text-center">
          <Image
            src={accountManagementIcon}
            alt="accountManagementIcon_icon"
            height={30}
            width={30}
          />
          <Link href="/admin/user/manage">Manage</Link>
        </div>
        <div className=" border-gray-300 justify-center align-center text-center">
          <Image src={salesIcon} alt="sales_icon" height={30} width={30} />
          <Link href="/admin/user/products">products</Link>
        </div>

        <div className=" border-gray-300 justify-center align-center text-center">
          <Image
            src={inventoryIcon}
            alt="inventory_icon"
            height={30}
            width={30}
          />
          <Link href="/admin/user/inventory">Inventory</Link>
        </div>
        <div className=" border-gray-300 justify-center align-center flex mt-auto">
          me
        </div>
      </div>

      {/*mobile nav*/}

      <div className="sm:hidden fixed bottom-0 flex bg-customerRibbonGreen w-full py-2 px-2 justify-between">
        <div className="p-4">home</div>
        <div className="p-4">sales</div>
        <div className="p-4">product</div>
        <div className="p-4">me</div>
      </div>
    </nav>
  );
};

export default Navbar;
