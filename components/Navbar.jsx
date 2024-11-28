"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import defaultProfileImage from "@public/defaultImages/default_profile_image.png";
import homeIcon from "@public/icons/home_icon.png";
import homeIconSelected from "@public/icons/home_icon_selected.png";
import productsIcon from "@public/icons/products_icon.png";
import productsIconSelected from "@public/icons/products_icon_selected.png";
import managementIcon from "@public/icons/manage_icon.png";
import managementIconSelected from "@public/icons/manage_icon_selected.png";
import accountManagementIcon from "@public/icons/accounts_icon.png";
import accountManagementIconSelected from "@public/icons/accounts_icon_selected.png";
const Navbar = () => {
  const pathName = usePathname();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const [showManage, setShowManage] = useState(false);
  const [showManageAccounts, setShowManageAccounts] = useState(false); // State for "Manage Accounts" dropdown

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
        pathName.includes("edit_product") || pathName.includes("products")
          ? productsIconSelected
          : productsIcon,
      label: "Products",
    },
  ];

  const manageLinks = [
    { href: "/admin/user/manage/create_audit", label: "Audits" },
    { href: "/admin/user/manage/create_report", label: "Reports" },
  ];

  const manageAccountsLinks = [
    { href: "/admin/user/manage_account/create", label: "Create New Account" },
    {
      href: "/admin/user/manage_account/edit",
      label: "Edit Existing Accounts",
    },
  ];

  return (
    <nav>
      {/* Desktop nav */}
      <div className="p-2 sm:flex hidden h-full items-center flex-col bg-navbarColor gap-3 py-4 w-[14rem]">
        <p className="text-center font-bold text-2xl bg-gradient-to-r from-gradientStart to-gradientEnd bg-clip-text text-transparent flex-start">
          Honesty Store
        </p>
        <div className="flex flex-col items-center justify-center w-full px-6 py-2  border-gray-300 mt-4">
          <div className="w-full flex justify-center items-center ">
            <Image
              src={user?.account_profile_url || defaultProfileImage}
              alt="profile_image"
              height={60}
              width={60}
              className=" rounded-full object-cover"
            />
          </div>
          <p className="text-left font-semibold">
            {loading ? "loading..." : user?.account_name}
          </p>
          <p className="text-left font-thin">
            {loading ? "loading..." : getUserRole()}
          </p>
        </div>

        {links.map(({ href, icon, label }) => (
          <div
            key={href}
            className={`flex w-full  p-2 hover:bg-mainButtonColor hover:text-white rounded-sm transition duration-100 ${
              href === pathName ? "bg-mainButtonColor" : ""
            }`}
          >
            <Image
              src={icon}
              alt={`${label}_icon`}
              height={20}
              width={25}
              className="object-contain"
            />
            <Link href={href} className="flex-1 items-center ml-4">
              {label}
            </Link>
          </div>
        ))}

        {/* Manage Dropdown */}
        <div className={`w-full`}>
          <div
            className={`w-full flex  p-2 cursor-pointer hover:bg-mainButtonColor hover:text-white transition-all duration-100 rounded-sm 
            `}
            onClick={() => setShowManage((prev) => !prev)}
          >
            <Image
              src={managementIcon}
              alt="manage_icon"
              height={20}
              width={25}
            />
            <span className="flex-1 items-center ml-4 ">Manage</span>
          </div>

          {/* Manage Links (Expanded Menu) */}
          {showManage &&
            manageLinks.map(({ href, label }) => (
              <div
                key={href}
                className={`w-full flex py-[0.25rem] cursor-pointer hover:bg-mainButtonColor hover:text-white transition-all duration-100 ${
                  pathName === href ? "bg-mainButtonColor text-white" : ""
                }`}
              >
                <Link href={href} className="flex-1 items-center ml-4 ">
                  {label}
                </Link>
              </div>
            ))}
        </div>

        {/* Manage Accounts Dropdown */}
        {user?.account_role === "1" && (
          <div className={`w-full`}>
            <div
              className={`w-full flex bg-white p-2 cursor-pointer hover:bg-mainButtonColor hover:text-white transition-all duration-100 rounded-sm ${
                pathName.startsWith("/admin/user/manage_accounts")
                  ? "text-navbarSelected"
                  : ""
              }`}
              onClick={() => setShowManageAccounts((prev) => !prev)}
            >
              <Image
                src={accountManagementIcon}
                alt="manage_accounts_icon"
                height={20}
                width={25}
              />
              <span className="flex-1 items-center ml-4 ">Manage Accounts</span>
            </div>

            {/* Manage Accounts Links (Expanded Menu) */}
            {showManageAccounts &&
              manageAccountsLinks.map(({ href, label }) => (
                <div
                  key={href}
                  className={`w-full flex py-[0.25rem] cursor-pointer hover:bg-mainButtonColor hover:text-white transition-all duration-100 ${
                    pathName === href ? "text-navbarSelected" : ""
                  }`}
                >
                  <Link href={href} className="flex-1 items-center ml-4 ">
                    {label}
                  </Link>
                </div>
              ))}
          </div>
        )}
      </div>
      {/* Mobile nav */}
      {/*--------------------------------mobile nav----------------------------------------*/}
      <div className="sm:hidden fixed bottom-0 w-full z-10 bg-white">
        <div className="relative">
          <div className="flex w-full py-2 px-2 justify-between">
            {links.map(({ href, icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`p-4 flex flex-1 items-center justify-center rounded-md ${
                  href.includes("products") &&
                  pathName.includes("/edit_" || "/create_")
                    ? "bg-mainButtonColor"
                    : href === pathName
                    ? "bg-mainButtonColor"
                    : ""
                }`}
              >
                <Image
                  src={icon}
                  alt={`${label}_icon`}
                  height={20}
                  width={25}
                />
              </Link>
            ))}

            {/* Manage Dropdown Trigger */}
            <div
              className={`p-4 flex-1 flex items-center justify-center cursor-pointer rounded-md `}
              onClick={() => {
                setShowManage((prev) => !prev);
                setShowManageAccounts(false);
              }}
            >
              <Image
                src={managementIcon}
                alt="manage_icon"
                height={20}
                width={25}
              />
            </div>

            {/* Manage Accounts Dropdown Trigger */}
            {user?.account_role === "1" && (
              <div
                className={`p-4 flex-1 flex items-center justify-center cursor-pointer rounded-md ${
                  pathName.includes("manage_account")
                    ? "bg-mainButtonColor"
                    : ""
                }`}
                onClick={() => {
                  setShowManageAccounts((prev) => !prev);
                  setShowManage(false);
                }}
              >
                <Image
                  src={
                    pathName.includes("manage_account")
                      ? accountManagementIconSelected
                      : accountManagementIcon
                  }
                  alt="manage_accounts_icon"
                  height={20}
                  width={25}
                />
              </div>
            )}
          </div>

          {/* Manage Dropdown (Expanded Menu) */}
          <div
            className={`absolute bottom-full left-0 w-full bg-white transition-all duration-300 ease-in-out ${
              showManage ? "flex flex-col" : "hidden"
            }`}
          >
            {manageLinks.map(({ href, label }) => (
              <div
                key={href}
                className={`w-full flex  p-2 cursor-pointer ${
                  pathName === href ? "bg-mainButtonColor text-white" : ""
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

          {/* Manage Accounts Dropdown (Expanded Menu) */}
          {user?.account_role === "1" && (
            <div
              className={`absolute bottom-full left-0 w-full bg-white  ${
                showManageAccounts ? "flex flex-col" : "hidden"
              }`}
            >
              {manageAccountsLinks.map(({ href, label }) => (
                <div
                  key={href}
                  className={`w-full flex p-2 cursor-pointer  ${
                    pathName === href ? "bg-mainButtonColor text-white" : ""
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
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
