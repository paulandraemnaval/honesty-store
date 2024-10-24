"use client";

import React from "react";
import { useRouter } from "next/navigation";
import bcryptjs from "bcryptjs";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
const AuthForm = () => {
  const router = useRouter();

  const [authMethod, setAuthMethod] = React.useState("signin");
  const [isProcessing, setIsProcessing] = React.useState(false);

  const [file, setFile] = React.useState({
    file: null,
    url: "",
  });

  const handleSelectPicture = (e) => {
    setFile({
      file: e.target.files[0],
      url: URL.createObjectURL(e.target.files[0]),
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const password = formData.get("password");
    formData.delete("password");

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    formData.append("password", hashedPassword);
    formData.append("salt", salt);

    try {
      setIsProcessing(true);
      const request = await fetch("/api/admin/signup", {
        method: "POST",
        body: formData,
      });
      const response = await request.json();
      console.log(response);
    } catch (err) {
      console.log(err);
    } finally {
      setIsProcessing(false);
    }
  };

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
      <h1 className="text-center font-bold text-[2rem]">HONESTY STORE</h1>
      {/* <ul className="flex">
        <li
          className={`text-center cursor-pointer rounded-sm py-1 ${
            authMethod === "signin" ? "bg-customerRibbonGreen text-white" : ""
          } flex-1`}
          onClick={() => setAuthMethod("signin")}
        >
          Sign In
        </li>
        <li
          className={`text-center cursor-pointer rounded-sm py-1 ${
            authMethod === "signup" ? "bg-customerRibbonGreen text-white" : ""
          } flex-1`}
          onClick={() => setAuthMethod("signup")}
        >
          Sign Up
        </li>
      </ul> */}
      <SignInForm handleSignIn={handleSignIn} isProcessing={isProcessing} />

      {/* {authMethod === "signup" && (
        <SignUpForm
          handleSignUp={handleSignUp}
          handleSelectPicture={handleSelectPicture}
          file={file}
          isProcessing={isProcessing}
        />
      )} */}
      <p className=" underline text-center mb-1 cursor-pointer">
        Forgot Password?
      </p>
    </div>
  );
};

export default AuthForm;
