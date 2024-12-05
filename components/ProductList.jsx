"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Loading from "@components/Loading";
import ProductCard from "@components/ProductCard";
import AddProductCard from "./AddProductCard";
//TODO: display if an inventory of a product is expired
//TODO: tell bea inventories dont return the oldest inventory as expected

const ProductList = ({
  selectedCategory = "all",
  selectedSupplier = "all",
  sortPriceAsc = null,
  sortUnitsAsc = null,
  sortExpirationAsc = null,
  searchKeyword = "",
  editingProductID = "",

  setShowInventoryForm = () => {},
  setProductName = () => {},
  setShowProductForm = () => {},
  setEditingProductID = () => {},
  setShowProductInventories = () => {},
  setShowInventoryReport = () => {},
  setFetchingProducts = () => {},
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

  const [productsWithNoInventories, setProductsWithNoInventories] = useState(
    []
  );

  const [filteredProducts, setFilteredProducts] = useState({
    withInventories: [],
    withoutInventories: [],
  });

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
          body: JSON.stringify({ lastVisible: "" }),
        });
        const data = await response.json();

        if (!response.ok) {
          setProductsWithInventories([]);
          setStopFetchingProductsWithInventories(true);
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

        console.log("data", data);

        setProductsWithNoInventories(data?.noInventory);
      } catch (error) {
        console.log("Failed to fetch products:", error);
      } finally {
        setLoading(false);
        setFetchingProducts(false);
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
  useEffect(() => {
    const withInventories = productsWithInventories
      .filter((inv) => {
        const product = inv.product;
        const inventory = inv.inventory;

        const isCategoryMatch =
          selectedCategory === "all" ||
          product.product_category === selectedCategory;

        const isSupplierMatch =
          selectedSupplier === "all" ||
          inventory.supplier_id === selectedSupplier;

        const isKeywordMatch = product.product_name
          .toLowerCase()
          .includes(searchKeyword.toLowerCase());

        return isCategoryMatch && isSupplierMatch && isKeywordMatch;
      })
      .sort((a, b) => {
        // Sorting logic for price and units
        if (
          sortPriceAsc !== null ||
          sortUnitsAsc !== null ||
          sortExpirationAsc !== null
        ) {
          if (sortPriceAsc === true) {
            return (
              a.inventory.inventory_retail_price -
              b.inventory.inventory_retail_price
            );
          } else if (sortPriceAsc === false) {
            return (
              b.inventory.inventory_retail_price -
              a.inventory.inventory_retail_price
            );
          }

          if (sortUnitsAsc === true) {
            return (
              a.inventory.inventory_total_units -
              b.inventory.inventory_total_units
            );
          } else if (sortUnitsAsc === false) {
            return (
              b.inventory.inventory_total_units -
              a.inventory.inventory_total_units
            );
          }
          if (sortExpirationAsc === true) {
            return (
              a.inventory.inventory_expiration_date.seconds -
              b.inventory.inventory_expiration_date.seconds
            );
          } else if (sortExpirationAsc === false) {
            return (
              b.inventory.inventory_expiration_date.seconds -
              a.inventory.inventory_expiration_date.seconds
            );
          }
        }
        return 0;
      });

    const withoutInventories = productsWithNoInventories.filter((product) => {
      const isSupplierMatch = selectedSupplier === "all";

      const isCategoryMatch =
        selectedCategory === "all" ||
        product.product_category === selectedCategory;

      const isKeywordMatch = product.product_name
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());

      return isCategoryMatch && isKeywordMatch && isSupplierMatch;
    });

    setFilteredProducts({
      withInventories,
      withoutInventories,
    });
  }, [
    selectedCategory,
    selectedSupplier,
    searchKeyword,
    productsWithInventories,
    productsWithNoInventories,
    sortPriceAsc,
    sortUnitsAsc,
    sortExpirationAsc,
  ]);
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
          filteredProducts.withInventories.length > 3
            ? "md:grid-cols-[repeat(auto-fit,minmax(13rem,1fr))]"
            : "md:grid-cols-[repeat(auto-fit,14rem)]"
        }`}
      >
        {pathname.includes("admin") && (
          <AddProductCard setShowProductForm={setShowProductForm} />
        )}
        {filteredProducts.withInventories.length > 0 && !loading
          ? filteredProducts.withInventories.map((prdwinv) => {
              if (prdwinv.product.product_soft_deleted) return null;
              const expirationDateObj =
                prdwinv.inventory.inventory_expiration_date;
              const expdatesec = expirationDateObj.seconds;
              const expirationDate = new Date(expdatesec * 1000);

              return (
                <ProductCard
                  key={prdwinv.inventory.inventory_id}
                  cardkey={prdwinv.product_id}
                  pathName={pathname}
                  editingProductID={editingProductID}
                  productPrice={`₱${prdwinv.inventory.inventory_retail_price}`}
                  productStock={`${prdwinv.inventory.inventory_total_units} units`}
                  productInventoryExpiration={expirationDate}
                  product={prdwinv.product}
                  setShowInventoryForm={setShowInventoryForm}
                  setProductName={setProductName}
                  setShowProductForm={setShowProductForm}
                  setEditingProductID={setEditingProductID}
                  setShowProductInventories={setShowProductInventories}
                  setShowInventoryReport={setShowInventoryReport}
                />
              );
            })
          : null}
        {filteredProducts.withoutInventories.length > 0 &&
          pathname.includes("admin") &&
          stopFetchingProductsWithInventories &&
          !loading &&
          filteredProducts.withoutInventories.map((product) => {
            if (product.product_soft_deleted) return null;
            return (
              <ProductCard
                key={product.product_id}
                cardkey={product.product_id}
                pathName={pathname}
                editingProductID={editingProductID}
                productPrice={`No Price`}
                productStock={`No inventory`}
                product={product}
                setShowInventoryForm={setShowInventoryForm}
                setProductName={setProductName}
                setShowProductForm={setShowProductForm}
                setEditingProductID={setEditingProductID}
                setShowProductInventories={setShowProductInventories}
              />
            );
          })}
      </div>

      <div className="w-full mt-6 flex flex-col items-center">
        {loading ||
          (isFetchingMoreProductsWithInventories && (
            <div className="flex justify-center items-center h-10">
              <span className="spinner-border-blue animate-spin w-8 h-8 border-2 border-mainButtonColor border-t-transparent rounded-full mr-2"></span>
              <p className="text-black">Loading...</p>
            </div>
          ))}
        {!loading &&
          !filteredProducts.withInventories &&
          !filteredProducts.withoutInventories && (
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
