"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import PlaceholderImage from "@public/defaultImages/placeholder_image.png";
import Link from "@node_modules/next/link";
import plusIcon from "@public/icons/plus_icon.png";
import addInventoryIcon from "@public/icons/add_inventory_icon.png";
const ProductList = ({
  filter,
  searchKeyword = "",
  supplierFilter = "all",
}) => {
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
        ? productList.filter((product) => {
            const matchesCategory =
              product.product_category === filter || filter === "all";
            const matchesKeyword = product.product_name
              .toLowerCase()
              .includes(searchKeyword.toLowerCase());
            const hasMatchingSupplier =
              supplierFilter === "all" ||
              inventories.some(
                (inventory) =>
                  inventory.product_id === product.product_id &&
                  inventory.supplier_id === supplierFilter
              );
            return matchesCategory && matchesKeyword && hasMatchingSupplier;
          })
        : productList.filter((product) => {
            const matchesKeyword = product.product_name
              .toLowerCase()
              .includes(searchKeyword.toLowerCase());
            const hasMatchingSupplier =
              supplierFilter === "all" ||
              inventories.some(
                (inventory) =>
                  inventory.product_id === product.product_id &&
                  inventory.inventory_supplier === supplierFilter
              );
            return matchesKeyword && hasMatchingSupplier;
          });

    const filteredWithInventory = filterProducts(productsWithInventory);
    const filteredWithoutInventory = filterProducts(productsWithoutInventory);

    if (pathname === "/admin/user/products") {
      return [...filteredWithInventory, ...filteredWithoutInventory];
    }

    return filteredWithInventory;
  }, [
    filter,
    products,
    productData,
    pathname,
    searchKeyword,
    supplierFilter,
    inventories,
  ]);

  return (
    <div className="w-full h-full min-h-fit overflow-y-auto z-0 px-1">
      <div
        className={`grid gap-3 w-full grid-cols-2 ${
          filteredProducts.length > 4
            ? "md:grid-cols-[repeat(auto-fit,minmax(13rem,1fr))]"
            : "md:grid-cols-[repeat(auto-fit,14rem)]"
        }`}
      >
        {filteredProducts.length > 0 && !loading ? (
          <>
            {pathname.includes("admin") && (
              <Link
                className="flex flex-col justify-center gap-4 px-4 py-8"
                href="manage/add_product"
              >
                <div className="flex gap-1 justify-center items-center bg-gray-100 border-2 border-dashed h-full border-mainButtonColor rounded-sm hover:bg-gray-200 cursor-pointer  duration-100 ease-in-out transition-all">
                  <span className="text-base font-semibold break-all flex flex-col items-center justify-center text-mainButtonColor">
                    Add product
                    <Image
                      src={plusIcon}
                      alt="Add product"
                      width={50}
                      height={50}
                      className="object-cover h-8 w-8"
                    />
                  </span>
                </div>
              </Link>
            )}
            {filteredProducts.map((product) => (
              <div
                key={product.product_id}
                className={`bg-white p-4 rounded-smxl shadow-lg relative border-2  `}
              >
                <div className="flex flex-col justify-center gap-4 z-20">
                  <div className="flex justify-center h-[7rem]">
                    <Image
                      src={product.product_image_url || PlaceholderImage}
                      alt={product.product_name}
                      width={150}
                      height={170}
                      className="object-scale-down "
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base  truncate">
                      {product.product_name}
                    </span>
                    <span className="text-lg font-semibold">
                      {getPrice(product.product_id)}
                    </span>
                  </div>
                  <div className="flex justify-center items-center">
                    {pathname === "/admin/user/products" && (
                      <span className="text-sm text-gray-600 w-full">
                        {getStock(product.product_id)}
                      </span>
                    )}
                    {pathname === "/admin/user/products" && (
                      <Link
                        href={`/admin/user/manage/create_inventory/${product.product_name}`}
                        className=" bg-gray-100 object-cover p-1 rounded-md flex border-dashed border-2 border-mainButtonColor"
                      >
                        <Image
                          src={addInventoryIcon}
                          alt="Add inventory"
                          width={30}
                          height={30}
                          className="object-cover w-fit cursor-pointer"
                        />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : null}
      </div>

      <div className="w-full mt-6 flex flex-col items-center">
        {loading ||
          (isFetchingMore && (
            <p className="text-xl text-center">Loading products...</p>
          ))}
        {!loading && filteredProducts.length === 0 && !isFetchingMore && (
          <p className="text-xl text-center">No products found.</p>
        )}
      </div>

      {filteredProducts && (
        <div ref={sentinelRef} className="sentinel h-2 w-full"></div>
      )}
    </div>
  );
};

export default ProductList;
