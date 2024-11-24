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
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/user");
        const data = await response.json();
        setUser(data?.data || null);
      } catch (err) {
        setUser(null);
        console.error("Failed to fetch user: ", err);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const [showManage, setShowManage] = useState(false);
  const getUserRole = () => {
    if (user?.account_role === "1") return "C.E.O";
    if (user?.account_role === "2") return "Treasurer";
    if (user?.account_role === "3") return "Auditor";
    if (user?.account_role === "4") return "Secretary";
  };

  const links = [
    {
      href: "/admin/user",
      icon: homeIcon,
      label: "Dashboard",
    },
    {
      href: "/admin/user/products",
      icon: salesIcon,
      label: "Products",
    },
    ...(user?.account_role === "1"
      ? [
          {
            href: "/admin/user/manage_account",
            icon: accountManagementIcon,
            label: "Manage Accounts",
          },
        ]
      : []),
  ];

  const manageLinks = [
    { href: "/admin/user/manage/add_supplier", label: "Add Supplier" },
    { href: "/admin/user/manage/add_product", label: "Add Product" },
    { href: "/admin/user/manage/create_inventory", label: "Create Inventory" },
    { href: "/admin/user/manage/create_category", label: "Create Category" },
    { href: "/admin/user/manage/create_audit", label: "Create Audit" },
    { href: "/admin/user/manage/create_report", label: "Create Report" },
  ];

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
            className="rounded-full mr-auto object-cover"
          />
          <div className="flex flex-col w-full px-2">
            <p className="text-left font-semibold">
              {loading ? "loading..." : user?.account_name}
            </p>
            <p className="text-left font-thin">
              {loading ? "loading..." : getUserRole()}
            </p>
          </div>
        </div>

        {links.map(({ href, icon, label }) => (
          <div
            key={href}
            className={`flex w-full bg-white p-2 hover:text-mainButtonColor transition duration-100 ${
              pathName === href ? "text-navbarSelected" : ""
            }`}
          >
            <Image
              src={icon}
              alt={`${label}_icon`}
              height={20}
              width={25}
              className="object-contain"
            />
            <Link
              href={href}
              className="flex-1 items-center ml-4 font-semibold"
            >
              {label}
            </Link>
          </div>
        ))}

        <div className={`w-full`}>
          <div
            className={`w-full flex bg-white p-2 cursor-pointer hover:text-mainButtonColor transition-all duration-100 ${
              pathName === "/admin/user/manage" ? "text-navbarSelected" : ""
            }`}
            onClick={() => setShowManage((prev) => !prev)}
          >
            <Image
              src={ManagementIcon}
              alt="manage_icon"
              height={20}
              width={25}
            />
            <span className="flex-1 items-center ml-4 font-semibold">
              Manage
            </span>
          </div>
          {showManage &&
            manageLinks.map(({ href, label }) => (
              <div
                key={href}
                className={`w-full flex  py-[0.25rem] cursor-pointer hover:text-mainButtonColor transition-all duration-100 ${
                  pathName === href ? "text-navbarSelected" : ""
                }`}
              >
                <Link
                  href={href}
                  className="flex-1 items-center ml-4 font-semibold"
                >
                  {label}
                </Link>
              </div>
            ))}
        </div>
      </div>

      {/*mobile nav*/}
      <div className="sm:hidden fixed bottom-0 w-full z-10 bg-white">
        <div className="relative">
          {/* Main Navigation */}
          <div className="flex w-full py-2 px-2 justify-between">
            {links.map(({ href, icon, label }) => (
              <Link
                key={href}
                href={href}
                className="p-4 flex flex-1 items-center justify-center"
              >
                <Image
                  src={icon}
                  alt={`${label}_icon`}
                  height={20}
                  width={25}
                />
              </Link>
            ))}

            <div
              className="p-4 flex-1 flex items-center justify-center cursor-pointer"
              onClick={() => setShowManage((prev) => !prev)}
            >
              <Image
                src={ManagementIcon}
                alt="manage_icon"
                height={20}
                width={25}
              />
            </div>
          </div>

          {/* Manage Links (Expanded Menu) */}
          <div
            className={`absolute bottom-full left-0 w-full bg-white transition-all duration-300 ease-in-out ${
              showManage ? "flex flex-col" : "hidden"
            }`}
          >
            {manageLinks.map(({ href, label }) => (
              <div
                key={href}
                className={`w-full flex bg-white p-2 cursor-pointer ${
                  pathName === href ? "text-navbarSelected" : ""
                }`}
              >
                <Link
                  href={href}
                  className="flex-1 items-center ml-4 font-semibold"
                >
                  {label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
