import Image from "next/image";
import Link from "next/link";
import plusIcon from "@public/icons/plus_icon.png";

const AddProductCard = ({ setShowProductForm = () => {} }) => {
  return (
    <>
      <div className="sm:flex hidden">
        <button
          className="flex flex-col justify-center gap-4 py-8 sm:px-8 px-4 w-full  items-center "
          onClick={() => setShowProductForm(true)}
        >
          <div className="flex gap-1 justify-center items-center bg-gray-100 border-2 border-dashed h-full border-mainButtonColor rounded-sm hover:bg-gray-200 cursor-pointer  duration-100 ease-in-out transition-all w-full">
            <span className="text-base font-semibold break-all flex flex-col items-center justify-center text-mainButtonColor">
              Add product
              <Image
                src={plusIcon}
                alt="Add product"
                width={50}
                height={50}
                className="object-cover h-8 w-8"
              />
            </span>
          </div>
        </button>
      </div>
      <div className="sm:hidden flex">
        <Link
          href="/admin/user/manage/add_product/"
          className="flex flex-col justify-center gap-4 py-8 px-4 w-full  items-center "
        >
          <div className="flex gap-1 justify-center items-center bg-gray-100 border-2 border-dashed h-full border-mainButtonColor rounded-sm hover:bg-gray-200 cursor-pointer  duration-100 ease-in-out transition-all w-full ">
            <span className="text-base font-semibold break-all flex flex-col items-center justify-center text-mainButtonColor">
              Add product
              <Image
                src={plusIcon}
                alt="Add product"
                width={50}
                height={50}
                className="object-cover h-8 w-8"
              />
            </span>
          </div>
        </Link>
      </div>
    </>
  );
};

export default AddProductCard;
