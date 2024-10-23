"use client";

import React from "react";
import Image from "next/image";
import ProductForm from "./ProductForm";
const ProductList = ({ products = [] }) => {
  const [inventories, setInventories] = React.useState([]);
  const [showEdit, setShowEdit] = React.useState(false);
  const [productData, setProductData] = React.useState({});

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

  if (products.length === 0) return <h1>No products available</h1>;

  return (
    <>
      <ul className="relative flex-1 flex flex-wrap gap-4 items-center justify-center mx-auto overflow-hidden max-w-full">
        {products.map((product, index) => (
          <li
            className="relative w-[200px] h-[300px] flex flex-col gap-2 border border-gray-400 p-4 rounded-lg pointer-events-auto" // Fix width and height
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setProductData(product);
              setShowEdit((prev) => !prev);
            }}
          >
            <div className="w-full h-[180px] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
              <Image
                height={180}
                width={180}
                src={product.product_image_url || null}
                className="object-cover w-full h-full" // Ensures the image covers the area without stretching
                alt={product.product_name}
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="truncate">{product.product_name}</h3>
              <p className="font-medium truncate">Price: {getPrice(product)}</p>
              <p className="text-sm truncate">{product.product_description}</p>
            </div>

            {isOutofStock(product) && (
              <p className="absolute top-0 right-0 bg-[rgba(217,217,217,0.8)] text-red-600 font-bold p-1 rounded-lg w-full h-full items-center flex justify-center">
                OUT OF STOCK
              </p>
            )}
          </li>
        ))}
      </ul>

      {/* Centered and Sticky ProductForm */}
      {showEdit && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-[600px] bg-white shadow-lg border p-4 rounded-lg">
          <ProductForm productData={productData} />
        </div>
      )}
    </>
  );
};

export default ProductList;
