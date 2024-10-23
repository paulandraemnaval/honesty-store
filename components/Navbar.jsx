"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";

import homeIcon from "@public/icons/home_icon.png";
import salesIcon from "@public/icons/sales_icon.png";
import accountManagementIcon from "@public/icons/account_management_icon.png";
import inventoryIcon from "@public/icons/inventory_icon.png";

const Navbar = () => {
  const [currentPage, setCurrentPage] = React.useState("dash");

  return (
    <nav>
      {/*desktop nav*/}

      <div className="p-2 sm:flex hidden h-full items-center justify-center flex-col bg-navbarGreen gap-8 py-8 w-[12rem]">
        <p className="font-bold text-white text-2xl text-center">
          HONESTY STORE
        </p>
        <div
          className={`text-white flex w-full bg-[rgba(0,0,0,0.25)] p-2 rounded-md ${
            currentPage === "dash" ? "bg-yellow text-black" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation;
            setCurrentPage("dash");
          }}
        >
          <Image
            src={homeIcon}
            alt="home_icon"
            height={30}
            width={30}
            className="object-contain"
          />
          <Link
            href="/admin/user"
            className="flex-1 items-center ml-4 mt-1/2  "
          >
            Dash
          </Link>
        </div>
        <div
          className={`text-white w-full flex bg-[rgba(0,0,0,0.25)] p-2 rounded-md ${
            currentPage === "manage" ? "bg-yellow text-black" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation;
            setCurrentPage("manage");
          }}
        >
          <Image
            src={accountManagementIcon}
            alt="accountManagementIcon_icon"
            height={30}
            width={30}
          />
          <Link
            href="/admin/user/manage"
            className="flex-1 items-center ml-4 mt-1/2 "
          >
            Manage
          </Link>
        </div>
        <div
          className={` text-white flex w-full bg-[rgba(0,0,0,0.25)] p-2 rounded-md ${
            currentPage === "products" ? "bg-yellow text-black" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation;
            setCurrentPage("products");
          }}
        >
          <Image src={salesIcon} alt="sales_icon" height={30} width={30} />
          <Link
            href="/admin/user/products"
            className="flex-1 items-center ml-4 mt-1/2 "
          >
            products
          </Link>
        </div>

        {/* <div
          className={`text-white flex w-full bg-[rgba(0,0,0,0.25)] p-2 rounded-md ${
            currentPage === "inventory" ? "bg-yellow text-black" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation;
            setCurrentPage("inventory");
          }}
        >
          <Image
            src={inventoryIcon}
            alt="inventory_icon"
            height={30}
            width={30}
          />
          <Link
            href="/admin/user/inventory"
            className="flex-1 items-center ml-4 mt-1/2 "
          >
            Inventory
          </Link>
        </div>*/}
        <div className=" justify-center align-center flex mt-auto"></div>
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
