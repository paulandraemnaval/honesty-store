"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import defaultProfileImage from "@public/defaultImages/default_profile_image.png";
import homeIcon from "@public/icons/home_icon.png";
import productsIcon from "@public/icons/products_icon.png";
import productsIconSelected from "@public/icons/products_icon_selected.png";
import ManagementIcon from "@public/icons/manage_icon.png";
import accountManagementIcon from "@public/icons/accounts_icon.png";
import homeIconSelected from "@public/icons/home_icon_selected.png";
import accountManagementIconSelected from "@public/icons/accounts_icon_selected.png";
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
      icon: pathName === "/admin/user" ? homeIconSelected : homeIcon,
      label: "Dashboard",
    },
    {
      href: "/admin/user/products",
      icon:
        pathName === "/admin/user/products"
          ? productsIconSelected
          : productsIcon,
      label: "Products",
    },
    ...(user?.account_role === "1"
      ? [
          {
            href: "/admin/user/manage_account",
            icon:
              pathName === "/admin/user/manage_account"
                ? accountManagementIconSelected
                : accountManagementIcon,
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
      <div className="p-2 sm:flex hidden h-full items-center flex-col bg-navbarColor gap-3 py-4 w-[14rem]">
        <p className="text-center font-bold text-2xl bg-gradient-to-r from-gradientStart to-gradientEnd bg-clip-text text-transparent flex-start">
          Honesty Store
        </p>
        <div className="flex items-center justify-center w-full px-6 py-2 rounded-sm shadow-sm mt-12 bg-slate-100">
          <Image
            src={user?.account_profile_url || defaultProfileImage}
            alt="profile_image"
            height={70}
            width={70}
            className=" h-10 w-10 rounded-full mr-auto object-cover"
          />
          <div className="flex flex-col w-full px-4">
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
            className={`flex w-full bg-white p-2 hover:bg-mainButtonColor hover:text-white rounded-sm transition duration-100 items-center justify-center ${
              pathName === href ? "text-navbarSelected" : ""
            }`}
          >
            <Image
              src={icon}
              alt={`${label}_icon`}
              height={20}
              width={25}
              className="object-contain h-8 w-8"
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
            className={`w-full flex bg-white p-2 cursor-pointer hover:bg-mainButtonColor hover:text-white transition-all duration-100 rounded-sm items-center justify-center ${
              pathName === "/admin/user/manage" ? "text-navbarSelected" : ""
            }`}
            onClick={() => setShowManage((prev) => !prev)}
          >
            <Image
              src={ManagementIcon}
              alt="manage_icon"
              height={20}
              width={25}
              className="object-contain h-8 w-8"
            />
            <span className="flex-1 items-center ml-4 font-semibold">
              Manage
            </span>
          </div>

          {/* Manage Links (Expanded Menu) */}
          {showManage &&
            manageLinks.map(({ href, label }) => (
              <div
                key={href}
                className={`w-full flex  py-[0.25rem] cursor-pointer hover:bg-mainButtonColor hover:text-white transition-all duration-100 ${
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

      {/*--------------------------------mobile nav----------------------------------------*/}
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
