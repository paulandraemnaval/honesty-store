import CategoryForm from "@components/CategoryForm";

const page = () => {
  return (
    <div className="w-full px-4 flex flex-col sm:h-[calc(100vh-6rem)] h-[calc(100vh-10rem)] mt-2">
      <h1 className="text-2xl font-bold">Create Category</h1>
      <p className="text-gray-500">Create a new category</p>
      <div className="w-full border mb-2"></div>
      <div className="overflow-y-auto  flex-1">
        <CategoryForm />
      </div>
    </div>
  );
};

export default page;
