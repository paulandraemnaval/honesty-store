"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import defaultProfileImage from "@public/defaultImages/default_profile_image.png";
import bellIcon from "@public/icons/bell_icon.png";
const HeaderBar = () => {
  const [user, setUser] = useState({});
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const router = useRouter();
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

  const handleUserLogOut = async () => {
    try {
      const response = await fetch("/api/admin/signout", {
        method: "POST",
        body: JSON.stringify({}),
      });
      if (response.ok) {
        setUser(null);
        router.push("/admin/");
        console.log("Log out successful.");
      }
    } catch (err) {
      console.error("Failed to log out: ", err);
    }
  };

  const getRole = () => {
    if (user?.account_role === "1") return "C.E.O";
    if (user?.account_role === "2") return "Treasurer";
    if (user?.account_role === "3") return "Auditor";
    if (user?.account_role === "4") return "Secretary";
  };

  return (
    <div className="bg-gradient-to-r from-gradientStart  to-gradientEnd min-h-[5rem] flex flex-row-reverse sticky top-0 z-20">
      <div className="flex items-center md:justify-cente md:w-1/3 w-full px-4 gap-2 flex-row-reverse  text-white">
        <div
          className={`p-1 rounded-tr-md rounded-tl-md ${
            userMenuVisible
              ? "bg-white rounded-tr-sm rounded-tl-sm"
              : "bg-transparent"
          }`}
        >
          <div className="rounded-full bg-white p-[0.1rem] flex items-center justify-center">
            <Image
              src={user?.account_profile_url || defaultProfileImage}
              alt="profile_image"
              className="object-cover rounded-full h-10 w-10 cursor-pointer"
              height={70}
              width={70}
              onClick={() => setUserMenuVisible((prev) => !prev)}
            />
          </div>
        </div>
        <Image
          src={bellIcon}
          alt="notification_icon"
          className="cursor-pointer"
          height={25}
          width={25}
        />
      </div>
      {userMenuVisible && (
        <div className="absolute top-[4rem] right-4 bg-white rounded-tr-none rounded-tl-sm rounded-br-sm rounded-bl-sm shadow-md p-2 w-[14rem] flex flex-col gap-2 z-20">
          <div className="roudned-md p-2 shadow-md bg-mainButtonColor">
            <p className="text-xl text-gray-800 font-semibold">
              Hello, {user?.account_name}
            </p>
            <p className="text-xs text-gray-600">{user?.account_email}</p>
            <p className="text-xs text-gray-600">{getRole()}</p>
          </div>
          <button
            onClick={() => handleUserLogOut()}
            className="px-2 py-1 text-semibold text-white rounded-sm bg-red-500 w-full hover:bg-red-600"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default HeaderBar;
