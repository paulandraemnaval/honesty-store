"use client";
import { useState } from "react";
import InventoryForm from "@components/InventoryForm";
import backIcon from "@public/icons/back_icon.png";
import Image from "next/image";
import Link from "next/link";
import DeleteModal from "@components/DeleteModal";
const page = ({ params }) => {
  const inventoryID = params.inventory_id;
  const productName = decodeURIComponent(params.product_name);
  const productID = params.product_id;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleleteFunc, setDeleteFunc] = useState(null);
  return (
    <div className="w-full py-2 flex flex-col sm:h-[calc(100vh-6rem)] h-[calc(100vh-10rem)] mt-2 z-0">
      <div className="flex gap-2 items-center mb-2 px-4">
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
        </span>
      </div>
      <div className="w-full border mb-2 mr-2"></div>

      <div className="overflow-y-auto flex-1">
        {showDeleteModal && (
          <div className="sticky h-full z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-fit h-fit p-6">
              <DeleteModal
                setShowDeleteModal={setShowDeleteModal}
                handleDeleteEntity={deleleteFunc}
                setDeleteFunc={setDeleteFunc}
                redirect="/admin/user/products"
              />
            </div>
          </div>
        )}

        <InventoryForm
          inventoryID={inventoryID}
          editingInventory={true}
          setShowDeleteModal={setShowDeleteModal}
          setDeleteFunc={setDeleteFunc}
        />
      </div>
    </div>
  );
};

export default page;
