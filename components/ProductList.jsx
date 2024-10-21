"use client";

import React from "react";
import Image from "next/image";

const ProductList = ({ products = [], selectedCategory }) => {
  const [inventories, setInventories] = React.useState([]);

  React.useEffect(() => {
    const getInventories = async () => {
      try {
        const response = await fetch("/api/admin/inventory");
        const data = await response.json();
        setInventories(
          data.data.map((inventory) => ({
            inventory_product: inventory.inventory_product,
            inventory_product_price: inventory.retail_price,
            total_units: inventory.total_units,
            createdAt: inventory.createdAt,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch inventories: ", error);
      }
    };
    getInventories();
  }, []);

  console.log(inventories);

  const getPrice = (product) => {
    const availableInventories = inventories
      .filter(
        (inventory) =>
          inventory.inventory_product === product.product_id &&
          inventory.total_units > 0
      )
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return availableInventories.length > 0
      ? availableInventories[0].inventory_product_price
      : "N/A";
  };

  const isOutofStock = (product) => {
    const availableInventories = inventories.filter(
      (inventory) =>
        inventory.inventory_product === product.product_id &&
        inventory.total_units > 0
    );
    return availableInventories.length === 0;
  };

  console.log(products, "products passed to productlist");

  return (
    <ul className="flex-1 flex flex-wrap gap-4">
      {products.length === 0 ? (
        <p className="text-center">No Products Available</p>
      ) : (
        products.map((product, index) => (
          <li
            className="relative max-w-[220px] max-h-[300px] flex flex-col gap-2 border border-gray-400 p-4 rounded-lg -z-10"
            key={index}
          >
            <Image
              height={200}
              width={200}
              src={null || product.product_image_url}
              className="object-cover flex-1"
            />
            <div>
              <h3>{product.product_name}</h3>
              <p className="font-medium">Price: {getPrice(product)}</p>

              <p>{product.product_description}</p>
            </div>

            {isOutofStock(product) && (
              <p className="absolute top-0 right-0 bg-[rgba(217,217,217,0.8)] text-red-600 font-bold p-1 rounded-lg w-full h-full items-center flex justify-center">
                OUT OF STOCK
              </p>
            )}
          </li>
        ))
      )}
    </ul>
  );
};

export default ProductList;
