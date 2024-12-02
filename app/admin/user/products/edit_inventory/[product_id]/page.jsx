import ProductInventories from "@components/ProductInventories";
const page = ({ params }) => {
  return (
    <div className="w-full px-4 flex flex-col sm:h-[calc(100vh-6rem)] h-[calc(100vh-10rem)] mt-2">
      <div className="overflow-y-auto flex-1 py-2">
        <ProductInventories productID={params.product_id} />
      </div>
    </div>
  );
};

export default page;
