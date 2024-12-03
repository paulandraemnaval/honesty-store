import ProductForm from "@components/ProductForm";
const Page = () => {
  return (
    <div className="w-full flex py-2 flex-col sm:h-[calc(100vh-6rem)] h-[calc(100vh-10rem)] mt-2 z-0">
      <div className="px-4">
        <h1 className="text-2xl font-bold">Add Product</h1>
        <p className="text-gray-500 mb-2">Create a new product</p>
        <div className="w-full border mb-2"></div>
      </div>

      <div className="overflow-y-auto flex-1 px-4">
        <ProductForm productID={""} />
      </div>
    </div>
  );
};

export default Page;
