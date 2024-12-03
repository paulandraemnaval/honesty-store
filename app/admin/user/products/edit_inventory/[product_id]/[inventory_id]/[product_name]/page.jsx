import InventoryForm from "@components/InventoryForm";
import backIcon from "@public/icons/back_icon.png";
import Image from "next/image";
import Link from "next/link";
const page = ({ params }) => {
  const inventoryID = params.inventory_id;
  const productName = decodeURIComponent(params.product_name);
  const productID = params.product_id;
  return (
    <div className="w-full px-4 py-2 flex flex-col sm:h-[calc(100vh-6rem)] h-[calc(100vh-10rem)] mt-2 z-0">
      <div className="flex gap-2 items-center mb-2">
        <Link
          href={`/admin/user/products/edit_inventory/${productID}`}
          className=" p-2 rounded-sm bg-mainButtonColor h-10 w-14 mb-8 flex items-center justify-center"
        >
          <Image src={backIcon} alt="back" width={25} height={25} />
        </Link>
        <span className="flex flex-col justify-evenly">
          <h1 className="text-2xl font-bold">
            Edit inventory of {productName}
          </h1>
          <span className="text-sm">Edit inventory details</span>
        </span>
      </div>
      <div className="w-full border mb-2"></div>

      <div className="overflow-y-auto flex-1">
        <InventoryForm inventoryID={inventoryID} editingInventory={true} />
      </div>
    </div>
  );
};

export default page;
