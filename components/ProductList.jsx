"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import PlaceholderImage from "@public/defaultImages/placeholder_image.png";

const ProductList = ({ filter, searchKeyword = "", renderMethod }) => {
  const [inventories, setInventories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState("");
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [stopFetching, setStopFetching] = useState(false);
  const pathname = usePathname();
  const sentinelRef = useRef(null);

  useEffect(() => {
    const getInventories = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/inventory");
        const data = await response.json();
        setInventories(
          Array.isArray(data?.inventories) ? data.inventories : []
        );
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
        if (response.ok && data?.products?.length) {
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
      if (response.ok && data?.products?.length) {
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
          retail_price: `₱${oldestInventory.inventory_retail_price}`,
          total_units: oldestInventory.inventory_total_units,
        });
      }
    });
    return map;
  }, [products, inventories]);

  const getPrice = (productId) =>
    productData?.get(productId)?.retail_price ?? "unavailable";

  const getStock = (productId) =>
    productData.get(productId)?.total_units ?? "unavailable";

  const filteredProducts = useMemo(() => {
    const productsWithInventory = products.filter((product) =>
      productData.has(product.product_id)
    );

    const productsWithoutInventory = products.filter(
      (product) => !productData.has(product.product_id)
    );

    const result = filter
      ? productsWithInventory.filter(
          (product) =>
            (product.product_category === filter || filter === "all") &&
            product.product_name
              .toLowerCase()
              .includes(searchKeyword.toLowerCase())
        )
      : productsWithInventory.filter((product) =>
          product.product_name
            .toLowerCase()
            .includes(searchKeyword.toLowerCase())
        );

    if (pathname === "/admin/user/products") {
      return [...result, ...productsWithoutInventory];
    }

    return result;
  }, [filter, products, productData, pathname, searchKeyword]);

  return (
    <div className="w-full h-full min-h-fit overflow-y-auto">
      <div
        className={`grid gap-4 w-full px-2 ${renderMethod}`}
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
        }}
      >
        {filteredProducts.length > 0 && !loading ? (
          filteredProducts.map((product) => (
            <div
              key={product.product_id}
              className="p-6 shadow-md rounded-sm bg-white flex flex-col"
            >
              <div className="flex flex-col justify-center gap-4">
                <div className="flex justify-center h-[8rem]">
                  <Image
                    src={product.product_image_url || PlaceholderImage}
                    alt={product.product_name}
                    width={200}
                    height={200}
                    className="object-cover w-full"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-semibold truncate">
                    {product.product_name}
                  </span>
                  <span className="text-lg font-bold">
                    {getPrice(product.product_id)}
                  </span>
                </div>
                {pathname === "/admin/user/products" && (
                  <span className="text-sm text-gray-600">
                    {getStock(product.product_id)} units
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-full w-full">
            <p className="text-xl">No products found.</p>
          </div>
        )}
        {isFetchingMore && (
          <p className="text-center mt-4">Loading more products...</p>
        )}
      </div>

      {filteredProducts && (
        <div ref={sentinelRef} className="sentinel h-2 w-full"></div>
      )}
    </div>
  );
};

export default ProductList;
