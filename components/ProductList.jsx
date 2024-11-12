"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import Image from "next/image";
import ProductForm from "./ProductForm";
import { usePathname } from "next/navigation";

const ProductList = () => {
  const [inventories, setInventories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = React.useState("");
  const [isLastItemVisible, setIsLastItemVisible] = useState(false);
  const pathName = usePathname();
  const lastProductRef = useRef(null);

  useEffect(() => {
    const getInventories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/inventory");
        const data = await response.json();
        if (response.status === 200) {
          setInventories(data?.inventories);
        } else {
          setInventories([]);
        }
      } catch (error) {
        console.error("Failed to fetch inventories: ", error);
      } finally {
        setLoading(false);
      }
    };
    getInventories();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch("/api/admin/products", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lastVisible: lastVisible || null,
          }),
        });
        const data = await response.json();
        if (response.status === 200) {
          setProducts(data?.products);
        }
      } catch (err) {
        console.log("Failed to fetch products: ", err);
        setProducts([]);
      }
    };
    getProducts();
  }, []);

  const productData = useMemo(() => {
    const map = new Map();
    products.forEach((product) => {
      const productInventories = inventories
        .filter(
          (inventory) =>
            inventory.inventory_product === product.product_id &&
            !inventory.inventory_soft_deleted &&
            inventory.inventory_total_units > 0
        )
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      if (productInventories.length > 0) {
        const oldestInventory = productInventories[0];
        map.set(product.product_id, {
          product_name: product.product_name,
          product_image_url: product.product_image_url,
          retail_price: oldestInventory.retail_price,
          total_units: oldestInventory.total_units,
        });
      }
    });
    return map;
  }, [products, inventories]);

  const getPrice = (productId) => {
    return productData.get(productId)?.retail_price ?? "unavailable";
  };

  const getStock = (productId) => {
    return productData.get(productId)?.total_units ?? "unavailable";
  };

  const LoadingDiv = () => (
    <div className="flex justify-center items-center h-96">
      <p className="text-xl">Loading...</p>
    </div>
  );

  useEffect(() => {
    if (!lastProductRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsLastItemVisible(entry.isIntersecting);
      },
      { threshold: 1.0 }
    );

    observer.observe(lastProductRef.current);

    return () => {
      if (lastProductRef.current) {
        observer.unobserve(lastProductRef.current);
      }
    };
  }, [products]);

  return (
    <div className="flex gap-2 w-full h-full">
      {products?.length > 0 && !loading ? (
        products?.map((product, index) => (
          <div
            key={product?.product_id}
            ref={index === products.length - 1 ? lastProductRef : null} // Attach ref to the last item
            className="p-4 shadow-md rounded-md w-fit min-h-[20rem] max-w-[12rem] min-w-[12rem] flex flex-col"
          >
            <div className="flex flex-col justify-center">
              <div className="flex-1 content-center flex justify-center min-h-[10rem] max-h-[10rem]">
                <Image
                  src={product?.product_image_url}
                  alt={product?.product_name}
                  width={100}
                  height={100}
                  className="object-cover w-full"
                />
              </div>
              <div>{product?.product_name}</div>
            </div>

            <div className="mt-auto min-h-[2rem]">
              <div>Price: {getPrice(product?.product_id)}</div>
              <div>
                Stock:
                {getStock(product?.product_id) === 0
                  ? "Out of Stock"
                  : getStock(product?.product_id)}
              </div>
            </div>
          </div>
        ))
      ) : (
        <LoadingDiv />
      )}
      {isLastItemVisible && <p className="text-center mt-4">End of list</p>}
    </div>
  );
};

export default ProductList;
