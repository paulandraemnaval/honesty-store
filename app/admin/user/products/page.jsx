"use client";

import React from "react";
import ProductList from "@components/ProductList";
import { useRouter } from "next/navigation";
import Image from "next/image";
import right_arrow from "@public/icons/right_arrow.png";
import left_arrow from "@public/icons/left_arrow.png";
import Pagination from "@components/Pagination";

const productspage = () => {
  const router = useRouter();
  const [products, setProducts] = React.useState([]);
  const [filteredProducts, setFilteredProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const itemsPerPage = 10;

  React.useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data.data);
      setFilteredProducts(data.data);
    };

    const fetchCategories = async () => {
      const res = await fetch("/api/admin/category");
      const data = await res.json();
      setCategories([{ category_name: "All" }, ...data.data]); // Add "All" as the first option
      setSelectedCategory("All");
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);
    const filtered = products.filter((product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category.category_name);
    setSearch("");
    setCurrentPage(1);
  };

  const categorizedProducts = filteredProducts.filter((product) =>
    selectedCategory === "All"
      ? true
      : product.product_category.category_name === selectedCategory
  );

  return (
    <div className="flex flex-col gap-4 w-full p-2 relative">
      <h1>Products</h1>

      <div className="flex gap-2 h-10">
        <input
          type="text"
          placeholder="search item..."
          value={search}
          onKeyUp={handleSearch}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none outline-none bg-gray-300 rounded-lg p-4 w-full sm:w-full lg:w-fit"
        />
        <button
          onClick={() => {
            router.push("/admin/user/manage");
          }}
          className="bg-customerRibbonGreen px-4 text-white rounded-lg self-center h-10 w-fit items-center ml-auto"
        >
          Add Product
        </button>
      </div>

      <div className="py-1">
        <ul className="border-b border-gray-300 flex">
          {categories.map((category) => (
            <li
              key={category.category_name}
              onClick={() => handleSelectCategory(category)}
              className={`${
                selectedCategory === category.category_name
                  ? "bg-customerRibbonGreen text-white"
                  : "white text-[#146939]"
              } w-fit py-2 px-3 rounded-tr-md rounded-tl-md cursor-pointer`}
            >
              {category.category_name}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4 w-full h-full">
        <button
          className="h-fit w-fit mt-auto mb-auto"
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        >
          <Image src={left_arrow} width={30} height={30} alt="left_arrow" />
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
          <Image src={right_arrow} width={30} height={30} alt="right_arrow" />
        </button>
      </div>
    </div>
  );
};

export default productspage;
