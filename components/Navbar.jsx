"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import homeIcon from "@public/icons/home_icon.png";
import salesIcon from "@public/icons/sales_icon.png";
import accountManagementIcon from "@public/icons/account_management_icon.png";
import inventoryIcon from "@public/icons/inventory_icon.png";

const Navbar = () => {
  const pathName = usePathname();
  const [showManage, setShowManage] = React.useState(false);
  return (
    <nav>
      {/*desktop nav*/}

      <div className="p-2 sm:flex hidden h-full items-center justify-center flex-col bg-navbarGreen gap-8 py-8 w-[14rem]">
        <p className="font-bold text-white text-2xl text-center">
          HONESTY STORE
        </p>
        <div
          className={`text-white flex w-full bg-[rgba(0,0,0,0.25)] p-2 rounded-md ${
            pathName === "/admin/user" ? "bg-yellow text-black" : ""
          }`}
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
            className="flex-1 items-center ml-4 mt-auto mb-auto"
          >
            Dash
          </Link>
        </div>
        <div className="w-full">
          <div
            className={`text-white w-full flex bg-[rgba(0,0,0,0.25)] p-2 cursor-pointer ${
              pathName === "/admin/user/manage" ? "bg-yellow text-black" : ""
            } ${
              showManage === true ? "rounded-tr-md rounded-tl-md" : "rounded-md"
            }`}
            onClick={() => setShowManage((prev) => !prev)}
          >
            <Image
              src={accountManagementIcon}
              alt="accountManagementIcon_icon"
              height={30}
              width={30}
            />
            <span className="flex-1 items-center ml-4 mt-auto mb-auto">
              Manage
            </span>
          </div>
          {showManage && (
            <>
              <div
                className={`text-white w-full flex bg-[rgba(0,0,0,0.25)] p-2  cursor-pointer ${
                  pathName === "/admin/user/manage/add_supplier"
                    ? "bg-yellow text-black"
                    : ""
                }`}
              >
                <Link
                  href="/admin/user/manage/add_supplier"
                  className="flex-1 items-center ml-4 mt-1"
                >
                  Add Supplier
                </Link>
              </div>
              <div
                className={`text-white w-full flex bg-[rgba(0,0,0,0.25)] p-2  cursor-pointer ${
                  pathName === "/admin/user/manage/add_product"
                    ? "bg-yellow text-black"
                    : ""
                }`}
              >
                <Link
                  href="/admin/user/manage/add_product"
                  className="flex-1 items-center ml-4 mt-1"
                >
                  Add Product
                </Link>
              </div>
              <div
                className={`text-white w-full flex bg-[rgba(0,0,0,0.25)] p-2  cursor-pointer ${
                  pathName === "/admin/user/manage/create_inventory"
                    ? "bg-yellow text-black"
                    : ""
                }`}
              >
                <Link
                  href="/admin/user/manage/create_inventory"
                  className="flex-1 items-center ml-4 mt-1"
                >
                  Create Inventory
                </Link>
              </div>
              <div
                className={`text-white w-full flex bg-[rgba(0,0,0,0.25)] p-2  cursor-pointer ${
                  pathName === "/admin/user/manage/create_category"
                    ? "bg-yellow text-black"
                    : ""
                }`}
              >
                <Link
                  href="/admin/user/manage/create_category"
                  className="flex-1 items-center ml-4 mt-1 "
                >
                  Create Category
                </Link>
              </div>
              <div
                className={`text-white w-full flex bg-[rgba(0,0,0,0.25)] p-2  cursor-pointer rounded-bl-md rounded-br-md ${
                  pathName === "/admin/user/manage/create_audit"
                    ? "bg-yellow text-black"
                    : ""
                }`}
              >
                <Link
                  href="/admin/user/manage/create_audit"
                  className="flex-1 items-center ml-4 mt-1 "
                >
                  Create Audit
                </Link>
              </div>
            </>
          )}
        </div>
        <div
          className={` text-white flex w-full bg-[rgba(0,0,0,0.25)] p-2 rounded-md ${
            pathName === "/admin/user/products" ? "bg-yellow text-black" : ""
          }`}
        >
          <Image src={salesIcon} alt="sales_icon" height={30} width={30} />
          <Link
            href="/admin/user/products"
            className="flex-1 items-center ml-4 mt-auto mb-auto "
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
