"use client";
import { useState } from "react";
import ProductForm from "@components/ProductForm";
import Link from "next/link";
import backIcon from "@public/icons/back_icon.png";
import Image from "next/image";
import DeleteModal from "@components/DeleteModal";
const Page = ({ params }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleleteFunc, setDeleteFunc] = useState(null);
  return (
    <div className="w-full flex flex-col sm:h-[calc(100vh-6rem)] h-[calc(100vh-10rem)] mt-2 z-0">
      <div className="px-4">
        <span className="flex gap-2 items-center mb-2">
          <Link
            href="/admin/user/products"
            className=" p-2 rounded-sm bg-mainButtonColor"
          >
            <Image src={backIcon} alt="back" width={25} height={25} />
          </Link>
          <span className="flex flex-col justify-evenly">
            <h1 className="text-2xl font-bold">Edit Product</h1>
            <span className="text-sm">Edit product details</span>
          </span>
        </span>
        <div className="w-full border mb-2"></div>
      </div>

      <div className="overflow-y-auto flex-1 relative">
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
        <ProductForm
          productID={params.product_id}
          setShowDeleteModal={setShowDeleteModal}
          setDeleteFunc={setDeleteFunc}
        />
      </div>
    </div>
  );
};

export default Page;
