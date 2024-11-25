import InventoryForm from "@components/InventoryForm";

const Page = ({ params }) => {
  return (
    <div className="w-full px-4 flex flex-col sm:h-[calc(100vh-6rem)] h-[calc(100vh-10rem)] mt-2">
      <h1 className="text-2xl font-bold">{`Create Inventory for ${decodeURIComponent(
        params.product_name
      )}`}</h1>
      <p className="text-gray-500">Create a new inventory</p>
      <div className="w-full border mb-2"></div>

      <div className="overflow-y-auto flex-1 py-2">
        <InventoryForm productName={params.product_name} />
      </div>
    </div>
  );
};

export default Page;
