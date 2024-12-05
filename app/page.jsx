"use client";
import { useState, useEffect } from "react";

import ProductList from "@components/ProductList";
import FilterBar from "@components/FilterBar";
import SearchInput from "@components/SearchInput";
import MobileFilter from "@components/MobileFilter";
import ProductInfo from "@components/ProductInfo";
import closeIcon from "@public/icons/close_icon.png";
import Image from "next/image";

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortPriceAsc, setSortPriceAsc] = useState(null);
  const [fetchingProducts, setFetchingProducts] = useState(true);
  const [showingProduct, setShowingProduct] = useState("");
  const [productPrice, setProductPrice] = useState("");

  return (
    <>
      <header className="flex justify-center items-center p-4 bg-gradient-to-r from-gradientStart to-gradientEnd">
        <p className="text-2xl text-white font-bold">HONESTY STORE</p>
      </header>
      <div className="relative w-full flex sm:h-[calc(100vh-4rem)] h-[calc(100vh-5rem)] px-2">
        {/* Modal */}
        {showingProduct && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="flex justify-center items-center relative bg-white rounded-lg shadow-lg w-[90vw] sm:w-[60vw] max-w-[800px] min-h-[90vh] overflow-y-auto p-6 rise-and-fade">
              {/* Close Button */}
              <button
                onClick={() => setShowingProduct("")}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                <Image src={closeIcon} alt="Close" width={30} height={30} />
              </button>
              {/* Product Info */}
              <ProductInfo
                productID={showingProduct}
                productPrice={productPrice}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="sm:flex hidden pr-2 mr-2 mt-2">
          <FilterBar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setSortPriceAsc={setSortPriceAsc}
            fetchingProducts={fetchingProducts}
          />
        </div>
        <div className="flex flex-col w-full gap-2 mt-2">
          <div className="flex gap-1">
            <div className="flex-1">
              <SearchInput
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                fetchingProducts={fetchingProducts}
              />
            </div>
            <div className="sm:hidden block z-20">
              <MobileFilter
                setSelectedCategory={setSelectedCategory}
                selectedCategory={selectedCategory}
                setSortPriceAsc={setSortPriceAsc}
                fetchingProducts={fetchingProducts}
              />
            </div>
          </div>
          <div className="w-full border"></div>
          <div className="overflow-y-auto flex-1">
            <ProductList
              selectedCategory={selectedCategory}
              sortPriceAsc={sortPriceAsc}
              searchKeyword={searchKeyword}
              setFetchingProducts={setFetchingProducts}
              setShowingProduct={setShowingProduct}
              setProductPrice={setProductPrice}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
