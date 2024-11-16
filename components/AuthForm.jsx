"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SignInForm from "./SignInForm";
const AuthForm = () => {
  const router = useRouter();

  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      setIsProcessing(true);
      const request = await fetch("/api/admin/signin", {
        method: "POST",
        body: formData,
      });
      if (request.ok) {
        router.push("/admin/user");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white p-2 min-w-[30dvw] custom_shadow rounded-md">
      <h1 className="text-center font-bold text-[2rem] bg-gradient-to-r from-gradientStart to-gradientEnd bg-clip-text text-transparent">
        Honesty Store
      </h1>
      <SignInForm handleSignIn={handleSignIn} isProcessing={isProcessing} />

      <p className=" underline text-center mb-1 cursor-pointer">
        Forgot Password?
      </p>
    </div>
  );
};

export default AuthForm;
