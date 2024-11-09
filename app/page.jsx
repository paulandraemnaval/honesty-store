"use client";
import React, { Suspense } from "react";
import "../stlyes/globals.css";
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

  return (
    <>
      <header className="flex justify-center items-center p-4 bg-gradient-to-r from-gradientStart via-gradientMiddle to-gradientEnd">
        <p className="text-2xl text-white font-medium">
          HONESTY STORE | PRODUCTS
        </p>
      </header>
    </>
  );
};

export default page;
