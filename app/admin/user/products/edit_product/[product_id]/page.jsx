import ProductForm from "@components/ProductForm";
import Link from "next/link";
import backIcon from "@public/icons/back_icon.png";
import Image from "next/image";
const Page = ({ params }) => {
  return (
    <div className="w-full px-4 flex flex-col sm:h-[calc(100vh-6rem)] h-[calc(100vh-10rem)] mt-2 z-0">
      <div>
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

      <div className="overflow-y-auto flex-1">
        <ProductForm productID={params.product_id} />
      </div>
    </div>
  );
};

export default Page;
