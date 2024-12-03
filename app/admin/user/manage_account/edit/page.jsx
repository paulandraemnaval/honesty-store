import SignUpForm from "@components/SignUpForm";
const page = () => {
  return (
    <div className="w-full px-4 flex flex-col sm:h-[calc(100vh-6rem)] h-[calc(100vh-10rem)] mt-2">
      <h1 className="text-2xl font-bold">Create new Accounts</h1>
      <p className="text-gray-500 mb-2">Create a new account</p>
      <div className="w-full border mb-2"></div>
      <div className="overflow-y-auto  flex-1">
        <SignUpForm />
      </div>
    </div>
  );
};

export default page;
