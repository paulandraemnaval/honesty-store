"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Loading from "@components/Loading";
import ProductCard from "@components/ProductCard";
import AddProductCard from "./AddProductCard";
//TODO: display if an inventory of a product is expired

const ProductList = ({
  selectedCategory = "all",
  selectedSupplier = "all",
  searchKeyword = "",
  editingProductID = "",

  setShowInventoryForm = () => {},
  setProductName = () => {},
  setShowProductForm = () => {},
  setEditingProductID = () => {},
  setShowProductInventories = () => {},
}) => {
  const [productsWithInventories, setProductsWithInventories] = useState([]);

  const [
    stopFetchingProductsWithInventories,
    setStopFetchingProductsWithInventories,
  ] = useState(false);

  const [
    isFetchingMoreProductsWithInventories,
    setIsFetchingMoreProductsWithInventories,
  ] = useState(false);

  const [lastVisible, setLastVisible] = useState("");

  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const sentinelRef = useRef(null);

  useEffect(() => {
    const getProductsWithInventories = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/inventory", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lastVisible: null }),
        });
        const data = await response.json();

        if (!response.ok) {
          setInventories([]);
          setStopFetching(true);
          return;
        }

        setProductsWithInventories((prev) => {
          const existingIds = new Set(
            prev.map((inv) => inv.inventory.inventory_id)
          );

          const newInventories = data.inventories.filter(
            (inv) => !existingIds.has(inv.inventory.inventory_id)
          );

          return [...prev, ...newInventories];
        });

        setLastVisible(
          data?.inventories[data.inventories.length - 1]?.inventory.inventory_id
        );
      } catch (error) {
        console.log("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    getProductsWithInventories();
  }, []);

  const fetchMoreProductsWithInventories = async () => {
    if (
      stopFetchingProductsWithInventories ||
      isFetchingMoreProductsWithInventories ||
      !lastVisible
    )
      return;
    setIsFetchingMoreProductsWithInventories(true);
    try {
      const response = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lastVisible }),
      });
      const data = await response.json();
      if (response.ok && data?.inventories.length) {
        setProductsWithInventories((prev) => {
          const existingIds = new Set(
            prev.map((inv) => inv.inventory.inventory_id)
          );

          const newInventories = data.inventories.filter(
            (inv) => !existingIds.has(inv.inventory.inventory_id)
          );

          return [...prev, ...newInventories];
        });

        setLastVisible(
          data?.inventories[data.inventories.length - 1]?.inventory.inventory_id
        );
      } else if (response.status === 404 && !data?.inventories) {
        setStopFetchingProductsWithInventories(true);
        setLastVisible("");
      }
    } catch (error) {
      console.error("Failed to fetch more products:", error);
    } finally {
      setIsFetchingMoreProductsWithInventories(false);
    }
  };

  // const filteredProducts = useMemo(() => {
  //   const filterProducts = (productList) => {
  //     const isMatchingProduct = (product) => {
  //       const matchesCategory =
  //         selectedCategory === "all" ||
  //         product.product_category === selectedCategory;

  //       const matchesKeyword = product.product_name
  //         .toLowerCase()
  //         .includes(searchKeyword.toLowerCase());

  //       const hasMatchingSupplier =
  //         selectedSupplier === "all" ||
  //         inventories.some(
  //           (inventory) =>
  //             inventory.product_id === product.product_id &&
  //             inventory.supplier_id === selectedSupplier
  //         );

  //       return matchesCategory && matchesKeyword && hasMatchingSupplier;
  //     };

  //     // Filter product list based on category and supplier
  //     return productList.filter((product) => isMatchingProduct(product));
  //   };

  //   const filteredWithInventory = filterProducts(productsWithInventories);
  //   const filteredWithoutInventory = filterProducts(productsWithNoInventories);

  //   if (pathname === "/admin/user/products") {
  //     return [...filteredWithInventory, ...filteredWithoutInventory];
  //   }
  //   return filteredWithInventory;
  // }, [
  //   selectedSupplier,
  //   selectedCategory,
  //   searchKeyword,
  //   pathname,
  //   productsWithInventories,
  //   productsWithNoInventories,
  // ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isFetchingMoreProductsWithInventories &&
          !stopFetchingProductsWithInventories
        ) {
          fetchMoreProductsWithInventories();
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
  }, [
    lastVisible,
    isFetchingMoreProductsWithInventories,
    stopFetchingProductsWithInventories,
  ]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-full overflow-y-auto z-0 px-1 py-2 ">
      <div
        className={`grid gap-3 w-full grid-cols-2 ${
          productsWithInventories.length > 3
            ? "md:grid-cols-[repeat(auto-fit,minmax(13rem,1fr))]"
            : "md:grid-cols-[repeat(auto-fit,14rem)]"
        }`}
      >
        {pathname.includes("admin") && (
          <AddProductCard setShowProductForm={setShowProductForm} />
        )}
        {productsWithInventories.length > 0 && !loading
          ? productsWithInventories.map((invwprd) => (
              <ProductCard
                key={invwprd.product_id}
                pathName={pathname}
                editingProductID={editingProductID}
                productPrice={`${invwprd.inventory.inventory_retail_price}₱`}
                productStock={`${invwprd.inventory.inventory_total_units} units`}
                product={invwprd.product}
                setShowInventoryForm={setShowInventoryForm}
                setProductName={setProductName}
                setShowProductForm={setShowProductForm}
                setEditingProductID={setEditingProductID}
                setShowProductInventories={setShowProductInventories}
              />
            ))
          : null}
      </div>

      <div className="w-full mt-6 flex flex-col items-center">
        {loading ||
          ((isFetchingMoreProductsWithInventories ||
            isFetchingMoreProducts) && (
            <div className="flex justify-center items-center h-10">
              <span className="spinner-border-blue animate-spin w-8 h-8 border-2 border-mainButtonColor border-t-transparent rounded-full mr-2"></span>
              <p className="text-black">Loading...</p>
            </div>
          ))}
        {!loading &&
          !productsWithInventories &&
          !isFetchingMoreProductsWithInventories && (
            <p className="text-xl text-center">No products found.</p>
          )}
      </div>

      {productsWithInventories && (
        <div ref={sentinelRef} className="sentinel h-2 w-full"></div>
      )}
    </div>
  );
};

export default ProductList;
