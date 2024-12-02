"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import downArrow from "@public/icons/down_arrow_icon.png";
import upArrow from "@public/icons/up_arrow_icon.png";
import Loading from "./Loading";
import closeIcon from "@public/icons/close_icon.png";
import backArrow from "@public/icons/back_icon.png";
const ProductInventories = ({
  productID = "",
  setShowProductInventories = () => {},
  setShowInventoryForm = () => {},
  setEditingInventoryID = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [productInventories, setProductInventories] = useState([]);
  const [product, setProduct] = useState({});
  const [expandedStates, setExpandedStates] = useState({});

  useEffect(() => {
    const getProductData = async () => {
      try {
        setLoading(true);

        const [productResponse, inventoryResponse] = await Promise.all([
          fetch(`/api/admin/products/${productID}`),
          fetch(`/api/admin/inventory?productId=${productID}`),
        ]);

        const productData = await productResponse.json();
        const inventoryData = await inventoryResponse.json();

        setProduct(productData?.data);
        setProductInventories(
          Array.isArray(inventoryData?.data)
            ? inventoryData?.data.filter(
                (inventory) => inventory.inventory_soft_deleted !== true
              )
            : []
        );
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getProductData();
  }, [productID]);
  const toggleExpand = (inventoryId) => {
    setExpandedStates((prevStates) => ({
      ...prevStates,
      [inventoryId]: !prevStates[inventoryId],
    }));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="w-full flex sm:px-1 mb-2 sm:py-2">
        <div className="w-full flex gap-2">
          <Link
            href="/admin/user/products"
            className="p-2 rounded-sm bg-mainButtonColor sm:hidden h-fit "
          >
            <Image src={backArrow} alt="back" width={16} height={16} />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold mr-auto">
              {product?.product_name}
            </h1>
            <h2 className="text-sm text-gray-600">
              view and edit the inventories of a product
            </h2>
          </div>
        </div>
        <div
          className="w-fit h-fit cursor-pointer sm:block hidden"
          onClick={() => setShowProductInventories(false)}
        >
          <Image
            src={closeIcon}
            alt="close icon"
            width={30}
            height={30}
            className="self-end"
          />
        </div>
      </div>

      <div>
        {productInventories.length === 0 && <div>No inventories found</div>}
        {productInventories.length > 0 && (
          <div className="h-full  flex flex-col">
            {productInventories.map((inventory) => {
              const timestamp = new Date(
                inventory.inventory_timestamp.seconds * 1000
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              });
              const lastupdated = new Date(
                inventory.inventory_last_updated.seconds * 1000
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              });
              const expiration = new Date(
                inventory.inventory_expiration_date.seconds * 1000
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              });

              return (
                <div key={inventory.inventory_id}>
                  {/* Main inventory box */}
                  <div
                    className={`${
                      expandedStates[inventory.inventory_id] ? "mb-0" : "mb-2"
                    } w-full border rounded-sm px-2 py-3 flex flex-col sm:hover:bg-gray-100 duration-100 ease-in-out transition-colors bg-white`}
                    onClick={() => toggleExpand(inventory.inventory_id)}
                  >
                    <div className="flex items-center px-2">
                      <span className="font-semibold sm:inline-block hidden">
                        Inventory created at:{" "}
                      </span>
                      <span className="sm:ml-2 ml-0 mr-4">{timestamp}</span>
                      <div
                        className="text-mainButtonColor mr-auto font-light cursor-pointer hover:underline sm:block hidden"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent toggling expand on edit click
                          setEditingInventoryID(inventory.inventory_id);
                          setShowProductInventories(false);
                          setShowInventoryForm(true);
                        }}
                      >
                        Edit
                      </div>
                      <span className="ml-auto font-light text-sm text-gray-400">
                        {inventory.inventory_id}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent toggling expand on button click
                          toggleExpand(inventory.inventory_id);
                        }}
                        className="ml-2 flex items-center"
                      >
                        <Image
                          src={
                            expandedStates[inventory.inventory_id]
                              ? upArrow
                              : downArrow
                          }
                          alt="Toggle details"
                          width={20}
                          height={20}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {expandedStates[inventory.inventory_id] && (
                    <div className="p-4 sm:bg-backgroundMain bg-gray-50 mb-2 shadow-md">
                      <ul className="flex gap-2 flex-col">
                        <li>
                          <h1 className="font-semibold">Date Info</h1>
                          <div className="w-full border"></div>
                          <ul>
                            <li>
                              <span className="">Created at: </span>
                              {timestamp}
                            </li>
                            <li>
                              <span className="">Last updated: </span>
                              {lastupdated}
                            </li>
                            <li>
                              <span className="">Expiration date: </span>
                              {expiration}
                            </li>
                          </ul>
                        </li>
                        <li>
                          <h1 className="font-semibold">Inventory Info</h1>
                          <div className="w-full border"></div>
                          <ul>
                            <li>
                              <span className="">Quantity: </span>
                              {inventory.inventory_total_units}{" "}
                              {product.product_uom}
                            </li>
                            <li>
                              <span className="">Wholesale Price: </span>₱
                              {inventory.inventory_wholesale_price}
                            </li>
                            <li>
                              <span className="">Retail Price: </span>₱
                              {inventory.inventory_retail_price}
                            </li>
                            <li>
                              <span className="">Profit Margin: </span>₱
                              {inventory.inventory_profit_margin}
                            </li>
                          </ul>
                        </li>
                      </ul>
                      <Link
                        href={`/admin/user/products/edit_inventory/${productID}/${inventory.inventory_id}/${product?.product_name}`}
                        className="flex sm:hidden bg-mainButtonColor px-4 py-2 rounded-md text-white w-fit"
                      >
                        Edit
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductInventories;
