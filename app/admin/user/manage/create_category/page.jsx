import CategoryForm from "@components/CategoryForm";

const page = () => {
  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold">Create Category</h1>
      <p className="text-gray-500 mb-4">Create a new category</p>
      <div className="w-full border mb-2"></div>

      <CategoryForm />
    </div>
  );
};

export default page;
