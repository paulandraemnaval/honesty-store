"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import defaultProfileImage from "@public/defaultImages/default_profile_image.png";

const HeaderBar = () => {
  //   let accountData = {};
  //   const getUser = async () => {
  //     const loggedinuser = await getLoggedInUser();
  //     accountData = loggedinuser;
  //   };
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

  console.log(user, "headerbar user");
  return (
    <div className="bg-gradient-to-r from-gradientStart  to-gradientEnd min-h-[4rem] flex flex-row-reverse">
      <div className="flex items-center justify-center w-1/3 px-4 gap-8 text-white">
        <p>Notif bell</p>
        <p>{user?.account_name}</p>
        <Image
          src={user?.account_profile_url || defaultProfileImage}
          alt="profile_image"
          className="rounded-full h-8 w-8"
          height={40}
          width={40}
        />
      </div>
    </div>
  );
};

export default HeaderBar;
