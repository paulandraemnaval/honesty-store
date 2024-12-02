import SupplierForm from "@components/SupplierForm";

const page = ({ params }) => {
  const supplierID = params.supplier_id;
  const redirectURL = "/admin/user/products";
  return (
    <div className="w-full flex py-2 flex-col sm:h-[calc(100vh-6rem)] h-[calc(100vh-10rem)] mt-2 z-0">
      <div className="px-4">
        <h1 className="text-2xl font-bold">Edit a supplier</h1>
        <p className="text-gray-500 mb-2">Change the details of supplier</p>
        <div className="w-full border mb-2"></div>
      </div>

      <div className="overflow-y-auto flex-1 px-4">
        <SupplierForm supplierID={supplierID} redirectURL={redirectURL} />
      </div>
    </div>
  );
};

export default page;
