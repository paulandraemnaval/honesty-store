"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import Image from "next/image";

const ProductList = () => {
  const [inventories, setInventories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState("");
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [stopFetching, setStopFetching] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const getInventories = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/inventory");
        const data = await response.json();
        if (response.ok) setInventories(data.inventories || []);
      } catch (error) {
        console.error("Failed to fetch inventories:", error);
      } finally {
        setLoading(false);
      }
    };
    getInventories();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/products", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lastVisible: null }),
        });
        const data = await response.json();
        if (response.ok && data.products?.length) {
          setProducts(data.products);
          setLastVisible(data.products[data.products.length - 1].product_id);
        }
      } catch (error) {
        console.log("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const fetchMoreProducts = async () => {
    if (stopFetching || isFetchingMore || !lastVisible) return;
    setIsFetchingMore(true);
    try {
      const response = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lastVisible }),
      });
      const data = await response.json();
      if (response.ok && data.products?.length) {
        setProducts((prevProducts) => [...prevProducts, ...data.products]);
        setLastVisible(data.products[data.products.length - 1].product_id);
      } else if (response.ok && data.products.length === 0) {
        setStopFetching(true);
      }
    } catch (error) {
      console.error("Failed to fetch more products:", error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore) {
          fetchMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [lastVisible, isFetchingMore, stopFetching]);

  const productData = useMemo(() => {
    const map = new Map();
    products.forEach((product) => {
      const productInventories = inventories
        .filter(
          (inventory) =>
            inventory.product_id === product.product_id &&
            !inventory.inventory_soft_deleted &&
            inventory.inventory_total_units > 0
        )
        .sort(
          (a, b) =>
            new Date(a.inventory_timestamp) - new Date(b.inventory_timestamp)
        );

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

  const getPrice = (productId) =>
    productData.get(productId)?.retail_price ?? "unavailable";
  const getStock = (productId) =>
    productData.get(productId)?.total_units ?? "unavailable";

  return (
    <div className="flex flex-col items-center w-full h-full min-h-[80vh] overflow-y-auto ">
      <div className="flex gap-2 flex-wrap items-center justify-center w-full">
        {products.length > 0 && !loading ? (
          products.map((product) => (
            <div
              key={product.product_id}
              className="p-4 shadow-md rounded-md w-fit min-h-[20rem] max-w-[12rem] min-w-[12rem] flex flex-col"
            >
              <div className="flex flex-col justify-center">
                <div className="flex-1 content-center flex justify-center min-h-[12rem] max-h-[12rem]">
                  <Image
                    src={product.product_image_url}
                    alt={product.product_name}
                    width={100}
                    height={100}
                    className="object-cover w-full"
                  />
                </div>
                <div>{product.product_name}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-full w-full">
            <p className="text-xl">Loading...</p>
          </div>
        )}
        {isFetchingMore && (
          <p className="text-center mt-4">Loading more products...</p>
        )}
      </div>
      <div ref={sentinelRef} className="sentinel h-2 w-full"></div>
    </div>
  );
};

export default ProductList;
