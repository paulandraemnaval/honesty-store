import ProductForm from "@components/ProductForm";
const page = () => {
  return (
    <div className="w-full px-4 overflow-hidden mt-2">
      <h1 className="text-2xl font-bold">Add Product</h1>
      <p className="text-gray-500">Create a new product</p>
      <div className="w-full border mb-2"></div>

      <div className="hide_scrollbar overflow-y-auto overflow-hidden sm:h-[81vh] h-[71vh] ">
        <ProductForm />
      </div>
    </div>
  );
};

export default page;
