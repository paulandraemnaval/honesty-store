import ProductForm from "@components/ProductForm";
const Page = ({ params }) => {
  return (
    <div className="w-full px-4 flex flex-col sm:h-[calc(100vh-5rem)] h-[calc(100vh-9rem)] mt-2 z-0">
      <div>
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <p className="text-gray-500">Edit the info of a product</p>
        <div className="w-full border mb-2"></div>
      </div>

      <div className="overflow-y-auto flex-1">
        <ProductForm productID={params.product_id} />
      </div>
    </div>
  );
};

export default Page;
