import ButtonLoading from "./ButtonLoading";
const SignInForm = ({ handleSignIn, isProcessing, isCompleted }) => {
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
          required
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
          required
        />
      </div>
      <div className="mt-auto">
        <button
          type="submit"
          className={`w-full p-2 bg-mainButtonColor text-white rounded-md flex items-center justify-center ${
            isProcessing || isCompleted
              ? "opacity-70 cursor-not-allowed"
              : "hover:opacity-90"
          }`}
          disabled={isProcessing || isCompleted}
        >
          {isProcessing ? (
            <ButtonLoading>Signing In...</ButtonLoading>
          ) : (
            "Sign In"
          )}
        </button>
      </div>
    </form>
  );
};

export default SignInForm;
