import CategoryForm from "@components/CategoryForm";

const page = () => {
  return (
    <div className="w-full px-4 overflow-hidden mt-2">
      <h1 className="text-2xl font-bold">Create Category</h1>
      <p className="text-gray-500">Create a new category</p>
      <div className="w-full border mb-2"></div>
      <div className="hide_scrollbar overflow-y-auto overflow-hidden md:h-[80vh] h-[67vh] ">
        <CategoryForm />
      </div>
    </div>
  );
};

export default page;
