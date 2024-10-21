import React from "react";

const SignInForm = ({ handleSignIn, isProcessing }) => {
  return (
    <form
      action="signin"
      className="bg-white p-2 rounded-sm h-full"
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
          className="w-full p-2 bg-customerRibbonGreen text-white rounded-md"
        >
          {isProcessing ? "Processing..." : "Sign In"}
        </button>
      </div>
    </form>
  );
};

export default SignInForm;
