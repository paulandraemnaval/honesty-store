"use client";
import { useState } from "react";
import Image from "next/image";
import defaultImage from "@public/defaultImages/default_profile_image.png";
import bcryptjs from "bcryptjs";
import { toast } from "react-hot-toast";

const SignUpForm = () => {
  const [file, setFile] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationMessages, setValidationMessages] = useState({
    email: "\u00A0",
    name: "\u00A0",
    password: "\u00A0",
    confirmPassword: "\u00A0",
  });

  const validateForm = (formData) => {
    const password = formData.get("password").trim();
    const confirmPassword = formData.get("confirmPassword").trim();

    const messages = {
      email: formData.get("email").trim() ? "\u00A0" : "Email is required",
      name: formData.get("name").trim() ? "\u00A0" : "Name is required",
      password: password ? "\u00A0" : "Password is required",
      confirmPassword:
        confirmPassword === password ? "\u00A0" : "Passwords do not match",
    };

    setValidationMessages(messages);

    Object.keys(messages).forEach((key) => {
      const input = document.getElementById(key);
      if (messages[key] !== "\u00A0") {
        input.classList.add("border", "border-red-500");
        input.classList.remove("border-gray-300");
      } else {
        input.classList.add("border-gray-300");
        input.classList.remove("border-red-500");
      }
    });

    return Object.values(messages).every((message) => message === "\u00A0");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    if (!validateForm(formData)) {
      toast.error("Please check the inputs and try again.", {
        duration: 3000,
        style: {
          fontSize: "1.2rem",
          padding: "16px",
        },
      });
      return;
    }

    const password = formData.get("password");
    formData.delete("password");

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    formData.append("password", hashedPassword);
    formData.append("salt", salt);

    // Add file handling logic
    if (!file.file) {
      try {
        const response = await fetch(
          "/defaultImages/default_profile_image.png"
        );
        const data = await response.blob();
        formData.append("file", data, "default_profile_image.png");
      } catch (err) {
        console.error("Failed to fetch default image:", err);
        return;
      }
    } else {
      formData.append("file", file.file);
    }

    try {
      setIsProcessing(true);
      const request = await fetch("/api/admin/signup", {
        method: "POST",
        body: formData,
      });
      const response = await request.json();
      console.log(response);
      if (request.status === 200) {
        toast.success("Account created successfully!", {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        });
        form.reset();
        setFile({});
      } else {
        toast.error("Account creation failed. Please try again.", {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectPicture = (e) => {
    setFile({
      file: e.target.files[0],
      url: URL.createObjectURL(e.target.files[0]),
    });
  };

  return (
    <form action="signup" onSubmit={(e) => handleSignUp(e)}>
      <div className="bg-white px-6 py-2 rounded-sm">
        <div className="mb-4 flex w-full gap-2 h-fit items-center py-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden">
            <Image
              src={file?.url || defaultImage}
              alt="selected_picture"
              layout="fill"
              objectFit="cover"
            />
          </div>

          <input
            type="file"
            className="hidden"
            name="file"
            id="picture"
            onChange={(e) => handleSelectPicture(e)}
          />
          <label
            htmlFor="picture"
            className="bg-customerRibbonGreen p-2 rounded-lg text-white bg-mainButtonColor cursor-pointer"
          >
            Select A picture
          </label>
        </div>

        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-mainButtonColor outline-none"
          />
          <p className="text-red-500 text-sm mb-2">
            {validationMessages.email}
          </p>
        </div>

        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm outline-none focus:ring-1 focus:ring-mainButtonColor"
          />
          <p className="text-red-500 text-sm mb-2">{validationMessages.name}</p>
        </div>

        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm outline-none focus:ring-1 focus:ring-mainButtonColor"
          />
          <p className="text-red-500 text-sm mb-2">
            {validationMessages.password}
          </p>
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm outline-none focus:ring-1 focus:ring-mainButtonColor"
          />
          <p className="text-red-500 text-sm mb-2">
            {validationMessages.confirmPassword}
          </p>
        </div>

        <div className="mb-4">
          <button
            type="submit"
            className={`w-fit p-2 bg-mainButtonColor text-white rounded-md flex items-center justify-center ${
              isProcessing
                ? "opacity-70 cursor-not-allowed"
                : "hover:opacity-90"
            }`}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="spinner-border animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Processing...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
