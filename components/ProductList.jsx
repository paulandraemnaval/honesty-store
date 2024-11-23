"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import PlaceholderImage from "@public/defaultImages/placeholder_image.png";
import Link from "@node_modules/next/link";
import downArrow from "@public/icons/down_arrow_icon.png";
import upArrow from "@public/icons/up_arrow_icon.png";

const ProductList = ({ filter, searchKeyword = "" }) => {
  const [inventories, setInventories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState("");
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [stopFetching, setStopFetching] = useState(false);
  const [showMore, setShowMore] = useState({});
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
          total_units: `${oldestInventory.inventory_total_units} units`,
        });
      }
    });
    return map;
  }, [products, inventories]);

  const getPrice = (productId) =>
    productData?.get(productId)?.retail_price ?? "no price";

  const getStock = (productId) =>
    productData.get(productId)?.total_units ?? "no inventory";

  const filteredProducts = useMemo(() => {
    const productsWithInventory = products
      .filter((product) => productData.has(product.product_id))
      .sort((a, b) => {
        const aUnits = parseInt(
          productData.get(a.product_id)?.total_units || "0",
          10
        );
        const bUnits = parseInt(
          productData.get(b.product_id)?.total_units || "0",
          10
        );
        return bUnits - aUnits;
      });

    const productsWithoutInventory = products.filter(
      (product) => !productData.has(product.product_id)
    );

    const filterProducts = (productList) =>
      filter
        ? productList.filter(
            (product) =>
              (product.product_category === filter || filter === "all") &&
              product.product_name
                .toLowerCase()
                .includes(searchKeyword.toLowerCase())
          )
        : productList.filter((product) =>
            product.product_name
              .toLowerCase()
              .includes(searchKeyword.toLowerCase())
          );

    const filteredWithInventory = filterProducts(productsWithInventory);
    const filteredWithoutInventory = filterProducts(productsWithoutInventory);

    if (pathname === "/admin/user/products") {
      return [...filteredWithInventory, ...filteredWithoutInventory];
    }

    return filteredWithInventory;
  }, [filter, products, productData, pathname, searchKeyword]);

  const handleSetShowMore = (productId) => {
    setShowMore((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  return (
    <div className="w-full h-full min-h-fit overflow-y-auto">
      <div
        className={`grid gap-2 w-full grid-cols-2 ${
          filteredProducts.length > 4
            ? "md:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))]"
            : "md:grid-cols-[repeat(auto-fit,14rem)]"
        }`}
      >
        {filteredProducts.length > 0 && !loading
          ? filteredProducts.map((product) => (
              <div
                key={product.product_id}
                className={`bg-white p-4 rounded-smxl shadow-lg relative border-2`}
              >
                {/* Dark Overlay */}
                {showMore[product.product_id] && (
                  <div className="absolute inset-0 bg-black opacity-20 z-10"></div>
                )}

                {/* Overlay Trigger */}
                {pathname === "/admin/user/products" && (
                  <>
                    <div className="w-full flex justify-end z-20 mb-1">
                      <Image
                        src={downArrow}
                        alt="down_arrow"
                        width={20}
                        height={20}
                        className="cursor-pointer"
                        onClick={() => handleSetShowMore(product.product_id)}
                      />
                    </div>

                    {/* Overlay Menu */}
                    {showMore[product.product_id] && (
                      <div className="absolute top-0 right-0 mt-0 bg-white shadow-lg md w-full flex flex-col z-20">
                        <div className="w-full pt-4 px-4">
                          <Image
                            src={upArrow}
                            alt="up_arrow"
                            width={20}
                            height={20}
                            onClick={() =>
                              handleSetShowMore(product.product_id)
                            }
                            className="ml-auto cursor-pointer"
                          />
                        </div>
                        <Link
                          href={`/admin/user/products/edit_product/${product.product_id}`}
                          className="block text-sm text-gray-700 hover:bg-mainButtonColor hover:text-white mb-2 p-2"
                        >
                          Edit Product Info
                        </Link>
                        <Link
                          href={`/admin/user/products/edit_inventory/${product.product_id}`}
                          className="block text-sm text-gray-700 hover:bg-mainButtonColor hover:text-white p-2"
                        >
                          See Inventories
                        </Link>
                      </div>
                    )}
                  </>
                )}
                <div className="flex flex-col justify-center gap-4 z-20">
                  <div className="flex justify-center h-[8rem]">
                    <Image
                      src={product.product_image_url || PlaceholderImage}
                      alt={product.product_name}
                      width={150}
                      height={170}
                      className="object-scale-down "
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
                      {getStock(product.product_id)}
                    </span>
                  )}
                </div>
              </div>
            ))
          : null}
      </div>

      <div className="w-full mt-6 flex flex-col items-center">
        {!loading && filteredProducts.length === 0 && (
          <p className="text-xl text-center">No products found.</p>
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
