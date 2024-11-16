"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import defaultProfileImage from "@public/defaultImages/default_profile_image.png";
import homeIcon from "@public/icons/home_icon.png";
import salesIcon from "@public/icons/sales_icon.png";
import ManagementIcon from "@public/icons/account_management_icon.png";
import accountManagementIcon from "@public/icons/accounts_icon.png";

const Navbar = () => {
  const pathName = usePathname();
  const [user, setUser] = useState({});
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("/api/admin/user");
        const data = await response.json();
        setUser(data?.data || null);
      } catch (err) {
        setUser(null);
        console.error("Failed to fetch user: ", err);
      }
    };
    getUser();
  }, []);

  console.log(user, "USER");
  const [showManage, setShowManage] = useState(false);
  const getUserRole = () => {
    if (user?.account_role === "1") return "C.E.O";
    if (user?.account_role === "2") return "Treasurer";
    if (user?.account_role === "3") return "Auditor";
    if (user?.account_role === "4") return "Secretary";
  };
  return (
    <nav>
      {/*desktop nav*/}

      <div className="p-2 sm:flex hidden h-full items-center flex-col bg-navbarColor gap-5 py-4 w-[14rem]">
        <p className="text-center font-bold text-2xl bg-gradient-to-r from-gradientStart to-gradientEnd bg-clip-text text-transparent flex-start">
          Honesty Store
        </p>
        <div className="flex items-center justify-center w-full px-6 py-8">
          <Image
            src={user?.account_profile_url || defaultProfileImage}
            alt="profile_image"
            height={40}
            width={40}
            className="rounded-full mr-auto"
          />
          <div className="flex flex-col w-full px-2">
            <p className="text-left font-semibold">{user?.account_name}</p>
            <p className="text-left font-thin">{getUserRole()}</p>
          </div>
        </div>
        <div
          className={` flex w-full bg-white p-2  ${
            pathName === "/admin/user" ? "text-navbarSelected" : ""
          }`}
        >
          <Image
            src={homeIcon}
            alt="home_icon"
            height={20}
            width={25}
            className="object-contain"
          />
          <Link
            href="/admin/user"
            className="flex-1 items-center ml-4 font-semibold"
          >
            Dash
          </Link>
        </div>
        <div className="w-full">
          <div
            className={` w-full flex bg-white p-2 cursor-pointer ${
              pathName === "/admin/user/manage" ? "text-navbarSelected" : ""
            } ${showManage === true ? "rounded-tr-md rounded-tl-md" : ""}`}
            onClick={() => setShowManage((prev) => !prev)}
          >
            <Image
              src={ManagementIcon}
              alt="accountManagementIcon_icon"
              height={20}
              width={25}
            />
            <span className="flex-1 items-center ml-4 font-semibold">
              Manage
            </span>
          </div>
          {showManage && (
            <>
              <div
                className={` w-full flex bg-white p-2  cursor-pointer ${
                  pathName === "/admin/user/manage/add_supplier"
                    ? "text-navbarSelected"
                    : ""
                }`}
              >
                <Link
                  href="/admin/user/manage/add_supplier"
                  className="flex-1 items-center ml-4 font-semibold"
                >
                  Add Supplier
                </Link>
              </div>
              <div
                className={` w-full flex bg-white p-2  cursor-pointer ${
                  pathName === "/admin/user/manage/add_product"
                    ? "text-navbarSelected"
                    : ""
                }`}
              >
                <Link
                  href="/admin/user/manage/add_product"
                  className="flex-1 items-center ml-4 mt-1 font-semibold"
                >
                  Add Product
                </Link>
              </div>
              <div
                className={` w-full flex bg-white p-2  cursor-pointer ${
                  pathName === "/admin/user/manage/create_inventory"
                    ? "text-navbarSelected"
                    : ""
                }`}
              >
                <Link
                  href="/admin/user/manage/create_inventory"
                  className="flex-1 items-center ml-4 mt-1 font-semibold"
                >
                  Create Inventory
                </Link>
              </div>
              <div
                className={` w-full flex bg-white p-2  cursor-pointer ${
                  pathName === "/admin/user/manage/create_category"
                    ? "text-navbarSelected"
                    : ""
                }`}
              >
                <Link
                  href="/admin/user/manage/create_category"
                  className="flex-1 items-center ml-4 mt-1 font-semibold"
                >
                  Create Category
                </Link>
              </div>
              <div
                className={` w-full flex bg-white p-2  cursor-pointer  ${
                  pathName === "/admin/user/manage/create_audit"
                    ? "text-navbarSelected"
                    : ""
                }`}
              >
                <Link
                  href="/admin/user/manage/create_audit"
                  className="flex-1 items-center ml-4 mt-1 font-semibold"
                >
                  Create Audit
                </Link>
              </div>
              <div
                className={` w-full flex bg-white p-2  cursor-pointer rounded-bl-md rounded-br-md ${
                  pathName === "/admin/user/manage/create_report"
                    ? "text-navbarSelected"
                    : ""
                }`}
              >
                <Link
                  href="/admin/user/manage/create_report"
                  className="flex-1 items-center ml-4 mt-1 font-semibold"
                >
                  Create Report
                </Link>
              </div>
            </>
          )}
        </div>
        <div
          className={`  flex w-full bg-white p-2  ${
            pathName === "/admin/user/products" ? "text-navbarSelected" : ""
          }`}
        >
          <Image src={salesIcon} alt="sales_icon" height={20} width={25} />
          <Link
            href="/admin/user/products"
            className="flex-1 items-center ml-4 mt-auto mb-auto font-semibold"
          >
            products
          </Link>
        </div>

        {/* <div
          className={` text-black flex w-full bg-white p-2  ${
            currentPage === "inventory" ? "text-navbarSelected" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation;
            setCurrentPage("inventory");
          }}
        >
          <Image
            src={inventoryIcon}
            alt="inventory_icon"
            height={20}
            width={20}
          />
          <Link
            href="/admin/user/inventory"
            className="flex-1 items-center ml-4 mt-1/2 "
          >
            Inventory
          </Link>
        </div>*/}
        {user?.account_role === "1" && (
          <div
            className={` flex w-full bg-white p-2  ${
              pathName === "/admin/user/manage_account"
                ? "text-navbarSelected"
                : ""
            }`}
          >
            <Image
              src={accountManagementIcon}
              alt="accounts_icon"
              height={20}
              width={25}
            />
            <Link
              href="/admin/user/manage_account"
              className="flex-1 items-center ml-4 mt-auto mb-auto font-semibold"
            >
              Manage Accounts
            </Link>
          </div>
        )}
      </div>

      {/*mobile nav*/}

      <div className="sm:hidden fixed bottom-0 flex w-full py-2 px-2 justify-between bg-white">
        <Link
          href="/admin/user"
          className="p-4 flex items-center justify-center"
        >
          <Image src={homeIcon} alt="home_icon" height={20} width={25} />
        </Link>
        <div
          className="p-4 flex-1 flex items-center justify-center"
          onClick={() => setShowManage((prev) => !prev)}
        >
          <Image src={ManagementIcon} alt="sales_icon" height={20} width={25} />
        </div>
        <Link
          href="/admin/user/products"
          className="p-4 flex items-center justify-center"
        >
          <Image src={salesIcon} alt="sales_icon" height={20} width={25} />
        </Link>{" "}
        {user?.account_role === "1" && (
          <div className="p-4 flex-1">
            <Image
              src={accountManagementIcon}
              alt="accountManagementIcon_icon"
              height={20}
              width={25}
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
