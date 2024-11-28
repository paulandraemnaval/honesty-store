"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import PlaceholderImage from "@public/defaultImages/placeholder_image.png";
import Link from "@node_modules/next/link";
import plusIcon from "@public/icons/plus_icon.png";
import addInventoryIcon from "@public/icons/add_inventory_icon.png";
import editIcon from "@public/icons/edit_icon.png";
import editIconWhite from "@public/icons/edit_icon_white.png";
import Loading from "@components/Loading";

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
      const productInventory = inventories.find(
        (inventory) => product.product_id === inventory.product_id
      );

      if (productInventory) {
        map.set(product.product_id, {
          product_name: product.product_name,
          product_image_url: product.product_image_url,
          retail_price: `₱${productInventory.inventory_retail_price}`,
          total_units: `${productInventory.inventory_total_units} units`,
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

      //check if a product has an inventory
      .filter((product) => productData.has(product.product_id))

      //most units first
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
      selectedCategory
        ? productList.filter((product) => {
            const matchesCategory =
              product.product_category === selectedCategory ||
              selectedCategory === "all";
            const matchesKeyword = product.product_name
              .toLowerCase()
              .includes(searchKeyword.toLowerCase());
            const hasMatchingSupplier =
              selectedSupplier === "all" ||
              inventories.some(
                (inventory) =>
                  inventory.product_id === product.product_id &&
                  inventory.supplier_id === selectedSupplier
              );
            return matchesCategory && matchesKeyword && hasMatchingSupplier;
          })
        : productList.filter((product) => {
            const matchesKeyword = product.product_name
              .toLowerCase()
              .includes(searchKeyword.toLowerCase());
            const hasMatchingSupplier =
              selectedSupplier === "all" ||
              inventories.some(
                (inventory) =>
                  inventory.product_id === product.product_id &&
                  inventory.inventory_supplier === selectedSupplier
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
    selectedSupplier,
    selectedCategory,
    searchKeyword,
    products,
    productData,
    pathname,
    inventories,
  ]);
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-full min-h-fit overflow-y-auto z-0 px-1 py-2">
      <div
        className={`grid gap-3 w-full grid-cols-2 ${
          filteredProducts.length > 3
            ? "md:grid-cols-[repeat(auto-fit,minmax(13rem,1fr))]"
            : "md:grid-cols-[repeat(auto-fit,14rem)]"
        }`}
      >
        {filteredProducts.length > 0 && !loading ? (
          <>
            {pathname.includes("admin") && (
              <>
                <div className="sm:flex hidden">
                  <button
                    className="flex flex-col justify-center gap-4 py-8 sm:px-8 px-4 w-full  items-center "
                    onClick={() => setShowProductForm(true)}
                  >
                    <div className="flex gap-1 justify-center items-center bg-gray-100 border-2 border-dashed h-full border-mainButtonColor rounded-sm hover:bg-gray-200 cursor-pointer  duration-100 ease-in-out transition-all w-full">
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
                  </button>
                </div>
                <div className="sm:hidden flex">
                  <Link
                    href="/admin/user/manage/add_product/"
                    className="flex flex-col justify-center gap-4 py-8 px-4 w-full  items-center "
                  >
                    <div className="flex gap-1 justify-center items-center bg-gray-100 border-2 border-dashed h-full border-mainButtonColor rounded-sm hover:bg-gray-200 cursor-pointer  duration-100 ease-in-out transition-all w-full ">
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
                </div>
              </>
            )}
            {filteredProducts.map((product) => (
              <div
                key={product.product_id}
                className={`bg-white p-4 rounded-smxl shadow-lg relative border-2  `}
              >
                {editingProductID === product.product_id && (
                  <div className="absolute top-0 right-0 flex  w-full flex-row h-full sm:p-2 p-0 bg-[rgba(120,120,120,0.15)]">
                    <div className="bg-mainButtonColor p-2 w-fit h-fit sm:flex hidden flex-col gap-2 rounded-lg ml-auto">
                      <div
                        className="self-end   object-cover p-1 rounded-md flex ring-1 ring-white mb-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProductID("");
                        }}
                      >
                        <Image
                          src={editIconWhite}
                          alt="Edit product"
                          width={20}
                          height={20}
                          className="object-cover w-6 h-6 cursor-pointer"
                        ></Image>
                      </div>

                      <div
                        className="w-full text-white cursor-pointer bg-mainButtonColor p-1 rounded-md hover:bg-darkButtonHover "
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowProductForm(true);
                        }}
                      >
                        Edit product
                      </div>
                      <div
                        className="w-full text-white cursor-pointer bg-mainButtonColor p-1 rounded-md hover:bg-darkButtonHover "
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowProductInventories(true);
                        }}
                      >
                        Edit inventories
                      </div>
                    </div>

                    {/* MOBILE DROPDOWN */}

                    <div
                      className="bg-mainButtonColor p-2 w-full h-fit flex sm:hidden flex-col gap-2  ml-auto"
                      onClick={() => {
                        setEditingProductID("");
                      }}
                    >
                      <div className="self-end mr-2 mt-2 object-cover p-1 rounded-md flex ring-1 ring-white mb-2">
                        <Image
                          src={editIconWhite}
                          alt="Edit product"
                          width={20}
                          height={20}
                          className="object-cover w-6 h-6 cursor-pointer"
                        ></Image>
                      </div>

                      <Link
                        className="w-full text-white cursor-pointer bg-mainButtonColor p-1 rounded-md hover:bg-darkButtonHover "
                        href={`/admin/user/products/edit_product/${product.product_id}`}
                      >
                        Edit product
                      </Link>
                      <Link
                        href={`/admin/user/products/edit_inventory/${product.product_id}`}
                        className="w-full text-white cursor-pointer bg-mainButtonColor p-1 rounded-md hover:bg-darkButtonHover "
                      >
                        Edit inventories
                      </Link>
                    </div>
                  </div>
                )}
                <div className="flex flex-col justify-center z-20">
                  {pathname.includes("admin") && (
                    <div
                      className="self-end object-cover p-1 rounded-md flex"
                      onClick={() => {
                        setEditingProductID(product.product_id);
                      }}
                    >
                      <Image
                        src={editIcon}
                        alt="Edit product"
                        width={20}
                        height={20}
                        className="object-cover w-6 h-6 cursor-pointer"
                      ></Image>
                    </div>
                  )}
                  <div className="flex justify-center sm:h-[10rem] h-[6rem] ">
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
                  <div className="flex justify-center items-center gap-2">
                    {pathname === "/admin/user/products" && (
                      <span className="text-sm text-gray-600 w-full">
                        {getStock(product.product_id)}
                      </span>
                    )}
                    {pathname === "/admin/user/products" && (
                      <>
                        <div className="sm:flex hidden">
                          <button
                            className=" bg-gray-100 object-cover p-1 rounded-md flex border-dashed border-2 border-mainButtonColor"
                            onClick={() => {
                              setProductName(product.product_name);
                              setShowInventoryForm(true);
                              console.log(product.product_name);
                            }}
                          >
                            <Image
                              src={addInventoryIcon}
                              alt="Add inventory"
                              width={30}
                              height={30}
                              className="object-cover w-fit cursor-pointer"
                            />
                          </button>
                        </div>
                        <div className="sm:hidden flex">
                          <Link
                            className=" bg-gray-100 object-cover p-1 rounded-md flex border-dashed border-2 border-mainButtonColor"
                            href={`/admin/user/manage/create_inventory/${product.product_name}`}
                          >
                            <Image
                              src={addInventoryIcon}
                              alt="Add inventory"
                              width={30}
                              height={30}
                              className="object-cover w-fit cursor-pointer"
                            />
                          </Link>
                        </div>
                      </>
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
            <div className="flex justify-center items-center h-10">
              <span className="spinner-border-blue animate-spin w-8 h-8 border-2 border-mainButtonColor border-t-transparent rounded-full mr-2"></span>
              <p className="text-black">Loading...</p>
            </div>
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
