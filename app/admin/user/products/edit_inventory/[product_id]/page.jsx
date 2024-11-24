import ProductInventories from "@components/ProductInventories";
const page = ({ params }) => {
  return (
    <div className="w-full px-4 flex flex-col sm:h-[calc(100vh-6rem)] h-[calc(100vh-10rem)] mt-2">
      <h1 className="text-2xl font-bold">Product Inventories</h1>
      <p className="text-gray-500">Browse the product's inventories</p>
      <div className="w-full border mb-2"></div>

      <div className="overflow-y-auto flex-1 py-2">
        <ProductInventories productId={params.product_id} />
      </div>
    </div>
  );
};

export default page;
