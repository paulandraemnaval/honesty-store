import ProductForm from "@components/ProductForm";

const page = () => {
  return (
    <div className="w-full p-4 overflow-hidden">
      <h1 className="text-2xl font-bold">Add Product</h1>
      <p className="text-gray-500 mb-4">Add a new product to the inventory</p>
      <div className="w-full border mb-2"></div>

      <div className="overflow-y-auto overflow-hidden h-[75vh]">
        <ProductForm />
      </div>
    </div>
  );
};

export default page;
