"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import downArrow from "@public/icons/down_arrow_icon.png";
import upArrow from "@public/icons/up_arrow_icon.png";

const ProductInventories = ({ productId }) => {
  const [loading, setLoading] = useState(false);
  const [productInventories, setProductInventories] = useState([]);
  const [product, setProduct] = useState({});
  const [expandedStates, setExpandedStates] = useState({}); // Tracks expansion states

  useEffect(() => {
    const getProductInventories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/admin/inventory?productId=${productId}`
        );
        const data = await response.json();
        setProductInventories(Array.isArray(data?.data) ? data?.data : []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getProductInventories();
  }, [productId]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/products/${productId}`);
        const data = await response.json();
        setProduct(data?.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [productId]);

  const toggleExpand = (inventoryId) => {
    setExpandedStates((prevStates) => ({
      ...prevStates,
      [inventoryId]: !prevStates[inventoryId],
    }));
  };

  return (
    <div className="flex flex-col w-full gap-2 h-fit px-1">
      <h2 className="text-lg font-semibold">
        Product Name: {loading ? "Loading..." : product?.product_name}
      </h2>
      {loading && <div>Loading...</div>}
      {!loading && productInventories.length === 0 && (
        <div>No inventories found</div>
      )}
      {!loading && productInventories.length > 0 && (
        <div>
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
              <div
                key={inventory.inventory_id}
                className="w-full border rounded-sm px-2 py-3 flex flex-col bg-white"
              >
                <div className="flex items-center">
                  <span className="font-semibold">Inventory created at: </span>
                  <span className="ml-4 mr-auto ">{timestamp}</span>
                  <span className="ml_auto font-light text-sm text-gray-400">
                    {inventory.inventory_id}
                  </span>
                  <button
                    onClick={() => toggleExpand(inventory.inventory_id)}
                    className="ml-4 flex items-center"
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
                {expandedStates[inventory.inventory_id] && (
                  <div className="mt-2">
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
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductInventories;
