"use client";
import React, { Suspense } from "react";
import "../stlyes/globals.css";
import ProductList from "@components/ProductList";
import Image from "next/image";
import right_arrow from "@public/icons/right_arrow.png";
import left_arrow from "@public/icons/left_arrow.png";
import Pagination from "@components/Pagination";

const page = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const handleSelectCategory = (category) => {
    setSelectedCategory(category.category_name);
    setCurrentPage(1);
  };

  const getProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      console.error("Failed to fetch products: ", error);
    }
  };

  const getCategories = async () => {
    let data;
    try {
      const response = await fetch("/api/admin/category");
      data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error("Failed to fetch categories: ", error);
    }
  };

  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);
  React.useEffect(() => {
    getProducts();
    getCategories();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const categorizedProducts = products.filter((product) => {
    return selectedCategory === "All"
      ? true
      : product.product_category.category_name === selectedCategory;
  });

  const paginatedProducts = categorizedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(categorizedProducts.length / itemsPerPage);

  return (
    <>
      <header className="flex justify-center items-center p-4 bg-gradient-to-r from-gradientStart via-gradientMiddle to-gradientEnd">
        <p className="text-2xl text-white font-medium">
          HONESTY STORE | PRODUCTS
        </p>
      </header>

      <main className="flex flex-col px-14 py-4 gap-4 ">
        {isOnline ? (
          <>
            <section className="py-1">
              <ul className="border-b border-gray-300 flex">
                <li
                  onClick={() => handleSelectCategory({ category_name: "All" })}
                  className={`${
                    selectedCategory === "All"
                      ? "bg-customerRibbonGreen text-white"
                      : "white text-[#146939]"
                  } w-fit py-2 px-3 rounded-md rounded-bl-none rounded-br-none cursor-pointer`}
                >
                  All
                </li>
                {categories.map((category) => (
                  <li
                    key={category.category_id}
                    onClick={() => handleSelectCategory(category)}
                    className={`${
                      selectedCategory === category.category_name
                        ? "bg-customerRibbonGreen text-white"
                        : "white text-[#146939]"
                    } w-fit py-2 px-3 rounded-md rounded-bl-none rounded-br-none cursor-pointer`}
                  >
                    {category.category_name}
                  </li>
                ))}
              </ul>
            </section>
            <section className="flex">
              <div className="flex gap-4 w-full h-full">
                <button
                  className="h-fit w-fit mt-auto mb-auto"
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                >
                  <Image
                    src={left_arrow}
                    width={30}
                    height={30}
                    alt="left_arrow"
                  />
                </button>
                <div className="flex flex-col flex-1">
                  <ProductList products={paginatedProducts} />
                  <div className="mr-auto ml-auto">
                    <Pagination
                      itemsCount={categorizedProducts.length}
                      itemsPerPage={itemsPerPage}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
                <button
                  className="h-fit w-fit mt-auto mb-auto"
                  onClick={() =>
                    handlePageChange(Math.min(currentPage + 1, totalPages))
                  }
                >
                  <Image
                    src={right_arrow}
                    width={30}
                    height={30}
                    alt="right_arrow"
                  />
                </button>
              </div>
            </section>
          </>
        ) : (
          <p>You are offline!</p>
        )}
      </main>
    </>
  );
};

export default page;
