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
import Loading from "./Loading";
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

  const mobilelinks = [
    {
      href: "/admin/user",
      icon: pathName === "/admin/user" ? homeIconSelected : homeIcon,
      label: "Dashboard",
    },
    {
      href: "/admin/user/products",
      icon:
        pathName.includes("product") ||
        pathName.includes("category") ||
        pathName.includes("supplier") ||
        pathName.includes("inventory")
          ? productsIconSelected
          : productsIcon,
      label: "Products",
    },
  ];

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
    <nav className="z-50">
      {/* Desktop nav */}
      <div className="px-2 sm:flex hidden h-full items-center flex-col bg-navbarColor gap-3 py-4 w-[12rem]">
        <p className="text-center font-bold text-2xl bg-gradient-to-r from-gradientStart to-gradientEnd bg-clip-text text-transparent flex-start">
          Honesty Store
        </p>
        <div className="flex flex-col items-center justify-center w-full px-6 py-2  border-gray-300 mt-4">
          {loading ? (
            <Loading />
          ) : (
            <>
              {" "}
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
            </>
          )}
        </div>

        {links.map(({ href, icon, label }) => (
          <div
            key={href}
            className={`flex w-full  p-2 hover:bg-mainButtonColor hover:text-white rounded-sm transition duration-100 ${
              href === pathName ? "bg-mainButtonColor text-white" : ""
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
              className="flex-1 items-center flex  text-sm ml-4"
            >
              {label}
            </Link>
          </div>
        ))}

        {/* Manage Button */}
        <div className={`w-full`}>
          <div
            className={`w-full flex p-2 cursor-pointer ${
              showManage
                ? "hover:bg-[#5A96F5] hover:text-white bg-mainButtonColor rounded-b-none"
                : "hover:bg-mainButtonColor hover:text-white"
            } transition-all duration-100 rounded-sm`}
            onClick={() => setShowManage((prev) => !prev)}
          >
            <Image
              src={showManage ? managementIconSelected : managementIcon}
              alt="manage_icon"
              height={20}
              width={25}
            />
            <span
              className={`flex-1 items-center ml-4 text-sm flex ${
                showManage ? "text-white" : "text-black"
              }`}
            >
              Manage
            </span>
          </div>

          {/* Manage Links (Expanded Menu) */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out transform ${
              showManage
                ? "max-h-[300px] scale-y-100 opacity-100"
                : "max-h-0 scale-y-0 opacity-0"
            } origin-top`}
          >
            <div className="bg-mainButtonColor p-2">
              {manageLinks.map(({ href, label }) => (
                <div
                  key={href}
                  className={`w-full flex py-2 cursor-pointer hover:bg-[#5A96F5] text-white transition-all duration-100 text-sm rounded-md mb-[0.2rem] ${
                    pathName === href ? "bg-[#5A96F5] text-white" : ""
                  }`}
                >
                  <Link href={href} className="flex-1 items-center ml-4">
                    {label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Manage Accounts Button */}
        {user?.account_role === "1" && (
          <div className={`w-full`}>
            <div
              className={`w-full flex p-2 cursor-pointer ${
                showManageAccounts
                  ? "hover:bg-[#5A96F5] hover:text-white bg-mainButtonColor rounded-b-none"
                  : "hover:bg-mainButtonColor hover:text-white"
              } transition-all duration-100 rounded-sm text-sm ${
                pathName.startsWith("/admin/user/manage_accounts")
                  ? "text-navbarSelected"
                  : ""
              }`}
              onClick={() => setShowManageAccounts((prev) => !prev)}
            >
              <Image
                src={
                  showManageAccounts
                    ? accountManagementIconSelected
                    : accountManagementIcon
                }
                alt="manage_accounts_icon"
                height={20}
                width={25}
              />
              <span
                className={`flex-1 items-center ml-4 flex justify-center ${
                  showManageAccounts ? "text-white" : "text-black"
                }`}
              >
                Manage Accounts
              </span>
            </div>

            {/* Manage Accounts Links (Expanded Menu) */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out transform ${
                showManageAccounts
                  ? "max-h-[300px] scale-y-100 opacity-100"
                  : "max-h-0 scale-y-0 opacity-0"
              } origin-top`}
            >
              <div className="bg-mainButtonColor p-2">
                {manageAccountsLinks.map(({ href, label }) => (
                  <div
                    key={href}
                    className={`w-full flex py-2 cursor-pointer bg-mainButtonColor text-white hover:bg-[#5A96F5] transition-all duration-100 text-sm rounded-md mb-[0.2rem] ${
                      pathName === href
                        ? "text-navbarSelected bg-[#5A96F5]"
                        : ""
                    }`}
                  >
                    <Link href={href} className="flex-1 items-center ml-4">
                      {label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Mobile nav */}

      {/*--------------------------------mobile nav----------------------------------------*/}

      <div className="sm:hidden fixed bottom-0 w-full z-10 bg-white">
        <div className="relative">
          <div className="flex w-full py-2 px-2 justify-between">
            {mobilelinks.map(({ href, icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`p-4 flex flex-1 items-center justify-center rounded-md ${
                  href.includes("products") &&
                  (pathName.includes("product") ||
                    pathName.includes("supplier") ||
                    pathName.includes("category") ||
                    pathName.includes("inventory"))
                    ? "bg-mainButtonColor"
                    : href === pathName
                    ? "bg-mainButtonColor"
                    : "bg-white"
                }`}
                onClick={() => {
                  setShowManage(false);
                  setShowManageAccounts(false);
                }}
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
              className={`p-4 flex-1 flex items-center justify-center cursor-pointer rounded-md 
              ${
                pathName.includes("create_audit") ||
                pathName.includes("create_report")
                  ? "bg-mainButtonColor"
                  : ""
              }
                `}
              onClick={() => {
                setShowManage((prev) => !prev);
                setShowManageAccounts(false);
              }}
            >
              <Image
                src={
                  pathName.includes("manage/") || pathName.includes("report")
                    ? managementIconSelected
                    : managementIcon
                }
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
          {/* Manage Dropdown (Mobile) */}
          <div
            className={`absolute bottom-full left-0 w-full bg-white overflow-hidden transition-all duration-300 ease-in-out transform ${
              showManage
                ? "max-h-[300px] scale-y-100 opacity-100"
                : "max-h-0 scale-y-0 opacity-0"
            } origin-bottom`}
          >
            {manageLinks.map(({ href, label }) => (
              <div
                key={href}
                className={`w-full flex  p-2 cursor-pointer hover:bg-mainButtonColor text-black transition-all duration-100 ${
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
              className={`absolute bottom-full left-0 w-full bg-white overflow-hidden transition-all duration-300 ease-in-out transform ${
                showManageAccounts
                  ? "max-h-[300px] scale-y-100 opacity-100"
                  : "max-h-0 scale-y-0 opacity-0"
              } origin-bottom`}
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
