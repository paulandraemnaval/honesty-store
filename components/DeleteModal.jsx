"use client";
import Image from "next/image";
import closeIcon from "@public/icons/close_icon.png";
import { useRouter } from "next/navigation";
const DeleteModal = ({
  setShowDeleteModal = () => {},
  handleDeleteEntity = () => {},
  setDeleteFunc = () => {},
  redirect = "",
}) => {
  const router = useRouter();
  return (
    <div className="flex gap-4 flex-col mt-auto py-2">
      <h1 className="text-lg font-semibold">
        Are you sure you want to delete this?
      </h1>
      <div className="flex w-full items-end">
        <button
          onClick={() => setShowDeleteModal((prev) => !prev)}
          className="text-mainButtonColor px-4 py-2 rounded-md ml-auto"
        >
          cancel
        </button>

        <button
          onClick={() => {
            handleDeleteEntity();
            if (redirect) {
              router.push(redirect);
            }
            setDeleteFunc(null);
            setShowDeleteModal((prev) => !prev);
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-md"
        >
          delete
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;
