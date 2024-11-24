"use client";
import { useState } from "react";
import Image from "next/image";
import defaultImage from "@public/defaultImages/default_profile_image.png";
import bcryptjs from "bcryptjs";
import { toast } from "react-hot-toast";
const SignUpForm = () => {
  const [file, setFile] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

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
          <label htmlFor="role">Role</label>
          <select
            name="role"
            id="role"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm outline-none focus:ring-1 focus:ring-mainButtonColor"
            required
          >
            <option value="1">C.E.O.</option>
            <option value="2">Treasurer</option>
            <option value="3">Auditor</option>
            <option value="4">Secretary</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-mainButtonColor outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm outline-none focus:ring-1 focus:ring-mainButtonColor"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm outline-none focus:ring-1 focus:ring-mainButtonColor"
          />
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
