"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import defaultProfileImage from "@public/defaultImages/default_profile_image.png";

const HeaderBar = () => {
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

  return (
    <div className="bg-gradient-to-r from-gradientStart  to-gradientEnd min-h-[4rem] flex flex-row-reverse">
      <div className="flex items-center md:justify-cente md:w-1/3 w-full px-4 gap-8 flex-row-reverse  text-white">
        <Image
          src={user?.account_profile_url || defaultProfileImage}
          alt="profile_image"
          className="rounded-full h-8 w-8"
          height={40}
          width={40}
        />
        <p>{user?.account_name}</p>
        <p>Notif bell</p>
      </div>
    </div>
  );
};

export default HeaderBar;
