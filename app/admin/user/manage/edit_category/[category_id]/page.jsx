"use client";
import { useState } from "react";
import DeleteModal from "@components/DeleteModal";
import CategoryForm from "@components/CategoryForm";
const page = ({ params }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleleteFunc, setDeleteFunc] = useState(null);
  const categoryID = params.category_id;
  const redirectURL = "/admin/user/products";
  return (
    <div className="w-full flex py-2 flex-col sm:h-[calc(100vh-6rem)] h-[calc(100vh-10rem)] mt-2 z-0">
      <div className="px-4">
        <h1 className="text-2xl font-bold">Edit a category</h1>
        <p className="text-gray-500 mb-2">Change the details of category</p>
        <div className="w-full border mb-2"></div>
      </div>

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

        <CategoryForm
          categoryID={categoryID}
          redirectURL={redirectURL}
          setShowDeleteModal={setShowDeleteModal}
          setDeleteFunc={setDeleteFunc}
        />
      </div>
    </div>
  );
};

export default page;
