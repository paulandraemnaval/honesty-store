import ProductForm from "@components/ProductForm";
const Page = () => {
  return (
    <div className="w-full px-4 flex flex-col sm:h-[calc(100vh-6rem)] h-[calc(100vh-10rem)] mt-2 z-0">
      <div>
        <h1 className="text-2xl font-bold">Add Product</h1>
        <p className="text-gray-500">Create a new product</p>
        <div className="w-full border mb-2"></div>
      </div>

      <div className="overflow-y-auto flex-1">
        <ProductForm productID={""} />
      </div>
    </div>
  );
};

export default Page;
