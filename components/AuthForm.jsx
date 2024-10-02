"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import bcryptjs from "bcryptjs";
const AuthForm = () => {
  const router = useRouter();

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
      const request = await fetch("/api/admin/signup", {
        method: "POST",
        body: formData,
      });
      const response = await request.json();
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    let request = null;

    try {
      request = await fetch("/api/admin/signin", {
        method: "POST",
        body: formData,
      });
      if (request.ok) {
        router.push("/admin/user");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex gap-4">
      <form
        action="signin"
        className="bg-white p-4 rounded-sm h-full"
        onSubmit={(e) => handleSignIn(e)}
      >
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
        <div className="mt-auto">
          <button
            type="submit"
            className="w-full p-2 bg-indigo-600 text-white rounded-md"
          >
            Sign In
          </button>
        </div>
      </form>

      {/* Sign Up Form */}

      <form action="signup" onSubmit={(e) => handleSignUp(e)}>
        <div className="bg-white px-6 py-4 rounded-sm">
          <div className="mb-4 flex w-full gap-2 items-center">
            <div className="flex rounded-md object-cover border">
              <Image
                src={file.url}
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
              className="bg-indigo-600 p-2 rounded-lg text-white cursor-pointer"
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
              className="w-full p-2 bg-indigo-600 text-white rounded-md"
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
