import Image from "next/image";
import PlaceholderImage from "@public/defaultImages/placeholder_image.png";
import Link from "next/link";

import addInventoryIcon from "@public/icons/add_inventory_icon.png";
import editIcon from "@public/icons/edit_icon.png";
import editIconWhite from "@public/icons/edit_icon_white.png";

const ProductCard = ({
  key = "",
  pathName = "",
  editingProductID = "",
  productPrice = "",
  productStock = "",
  product = {},
  setShowInventoryForm = () => {},
  setProductName = () => {},
  setShowProductForm = () => {},
  setEditingProductID = () => {},
  setShowProductInventories = () => {},
}) => {
  const hasNoInventory = productStock === "No inventory";

  return (
    <div
      key={key}
      className={`relative p-4 rounded-smxl shadow-lg border-2 ${
        hasNoInventory ? "bg-gray-100" : "bg-white"
      }`}
    >
      {/* Overlay for No Inventory */}
      {hasNoInventory && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-10 z-10 pointer-events-none"></div>
      )}

      {editingProductID === product.product_id && (
        <div className="absolute top-0 right-0 flex w-full flex-row h-full sm:p-2 p-0 bg-[rgba(171,171,171,0.9)]">
          <div className="bg-mainButtonColor p-2 w-fit h-fit sm:flex hidden flex-col gap-2 rounded-lg ml-auto">
            <div
              className="self-end object-cover p-1 rounded-md flex ring-1 ring-white mb-2"
              onClick={(e) => {
                e.stopPropagation();
                setEditingProductID("");
              }}
            >
              <Image
                src={editIconWhite}
                alt="Edit product"
                width={20}
                height={20}
                className="object-cover w-6 h-6 cursor-pointer"
              ></Image>
            </div>

            <div
              className="w-full text-white cursor-pointer bg-mainButtonColor p-1 rounded-md hover:bg-darkButtonHover"
              onClick={(e) => {
                e.stopPropagation();
                setShowProductForm(true);
              }}
            >
              Edit product
            </div>
            <div
              className="w-full text-white cursor-pointer bg-mainButtonColor p-1 rounded-md hover:bg-darkButtonHover"
              onClick={(e) => {
                e.stopPropagation();
                setShowProductInventories(true);
              }}
            >
              Edit inventories
            </div>
          </div>

          {/* Mobile Dropdown */}
          <div
            className="bg-mainButtonColor p-2 w-full h-fit flex sm:hidden flex-col gap-2 ml-auto"
            onClick={() => {
              setEditingProductID("");
            }}
          >
            <div className="self-end mr-2 mt-2 object-cover p-1 rounded-md flex ring-1 ring-white mb-2">
              <Image
                src={editIconWhite}
                alt="Edit product"
                width={20}
                height={20}
                className="object-cover w-6 h-6 cursor-pointer"
              ></Image>
            </div>

            <Link
              className="w-full text-white cursor-pointer bg-mainButtonColor p-1 rounded-md hover:bg-darkButtonHover"
              href={`/admin/user/products/edit_product/${product.product_id}`}
            >
              Edit product
            </Link>
            <Link
              href={`/admin/user/products/edit_inventory/${product.product_id}`}
              className="w-full text-white cursor-pointer bg-mainButtonColor p-1 rounded-md hover:bg-darkButtonHover"
            >
              Edit inventories
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-col justify-center z-20">
        {pathName.includes("admin") && (
          <div
            className="self-end object-cover p-1 rounded-md flex"
            onClick={() => {
              setEditingProductID(product.product_id);
            }}
          >
            <Image
              src={editIcon}
              alt="Edit product"
              width={20}
              height={20}
              className="object-cover w-6 h-6 cursor-pointer"
            ></Image>
          </div>
        )}
        <div className="flex justify-center sm:h-[10rem] h-[6rem]">
          <Image
            src={product.product_image_url || PlaceholderImage}
            alt={product.product_name}
            width={150}
            height={170}
            className="object-scale-down"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-base truncate">{product.product_name}</span>
          <span className="text-lg font-semibold">{productPrice}</span>
        </div>
        <div className="flex justify-center items-center gap-2">
          {pathName === "/admin/user/products" && (
            <span className="text-sm text-gray-600 w-full">{productStock}</span>
          )}
          {pathName === "/admin/user/products" && (
            <>
              <div className="sm:flex hidden">
                <button
                  className="bg-gray-100 object-cover p-1 rounded-md flex border-dashed border-2 border-mainButtonColor"
                  onClick={() => {
                    setProductName(product.product_name);
                    setShowInventoryForm(true);
                    console.log(product.product_name);
                  }}
                >
                  <Image
                    src={addInventoryIcon}
                    alt="Add inventory"
                    width={30}
                    height={30}
                    className="object-cover w-fit cursor-pointer"
                  />
                </button>
              </div>
              <div className="sm:hidden flex">
                <Link
                  className="bg-gray-100 object-cover p-1 rounded-md flex border-dashed border-2 border-mainButtonColor"
                  href={`/admin/user/manage/create_inventory/${product.product_name}`}
                >
                  <Image
                    src={addInventoryIcon}
                    alt="Add inventory"
                    width={30}
                    height={30}
                    className="object-cover w-fit cursor-pointer"
                  />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
