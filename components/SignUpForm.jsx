import React from "react";
import Image from "next/image";
import defaultImage from "@public/defaultImages/default_profile_image.png";

const SignUpForm = ({
  handleSignUp,
  handleSelectPicture,
  file,
  isProcessing,
}) => {
  return (
    <form action="signup" onSubmit={(e) => handleSignUp(e)}>
      <div className="bg-white px-6 py-2 rounded-sm">
        <div className="mb-4 flex w-full gap-2 items-center">
          <div className="flex rounded-md object-cover border">
            <Image
              src={defaultImage || file.url}
              alt="selected_picture"
              height={40}
              width={40}
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
            className="bg-customerRibbonGreen p-2 rounded-lg text-white cursor-pointer"
          >
            Select A picture
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="role">Role</label>
          <select
            name="role"
            id="role"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="1">Admin</option>
            <option value="2">Auditor</option>
            <option value="2">Secretary</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className="w-full p-2 bg-customerRibbonGreen text-white rounded-md"
          >
            {isProcessing ? "Processing..." : "Sign Up"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
