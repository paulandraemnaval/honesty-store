"use client";

import { useState, Suspense, lazy, useEffect } from "react";
import FilterBar from "@components/FilterBar";
import SearchInput from "@components/SearchInput";
import MobileFilter from "@components/MobileFilter";

const ProductList = lazy(() => import("@components/ProductList"));
const InventoryForm = lazy(() => import("@components/InventoryForm"));
const ProductForm = lazy(() => import("@components/ProductForm"));
const CategoryForm = lazy(() => import("@components/CategoryForm"));
const SupplierForm = lazy(() => import("@components/SupplierForm"));

const productspage = () => {
  const [filter, setFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [productName, setProductName] = useState("");

  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSupplierForm, setShowSupplierForm] = useState(false);

  useEffect(() => {
    console.log("showSupplierForm", showSupplierForm);
  }, [showSupplierForm]);

  return (
    <div className="w-full px-4 flex sm:h-[calc(100vh-5rem)] h-[calc(100vh-9.5rem)] relative">
      {(showInventoryForm ||
        showProductForm ||
        showCategoryForm ||
        showSupplierForm) && (
        <div className="absolute w-full h-full z-50 border top-0 left-0 bg-[rgba(0,0,0,0.25)]">
          <div className="z-50 sm:w-[calc(100vw-30rem)] w-[calc(100vw)] sm:h-[calc(100vh-10rem)] h-[calc(100vh-6rem)]  rounded-md shadow-md absolute self-center sm:top-[50%] top-0 sm:left-[50%] left-0 smLtransform sm:-translate-x-1/2 sm:-translate-y-1/2 bg-white overflow-y-auto py-6 px-6">
            <Suspense fallback={<Fallback />}>
              {showInventoryForm && (
                <InventoryForm
                  setShowInventoryForm={setShowInventoryForm}
                  productName={productName}
                />
              )}

              {showProductForm && (
                <ProductForm setShowProductForm={setShowProductForm} />
              )}

              {showCategoryForm && (
                <CategoryForm setShowCategoryForm={setShowCategoryForm} />
              )}

              {showSupplierForm && (
                <SupplierForm setShowSupplierForm={setShowSupplierForm} />
              )}
            </Suspense>
          </div>
        </div>
      )}

      <div className="sm:flex hidden pr-2">
        <FilterBar
          setFilter={setFilter}
          setSupplierFilter={setSupplierFilter}
          setShowCategoryForm={setShowCategoryForm}
          setShowSupplierForm={setShowSupplierForm}
        />
      </div>

      <div className="flex flex-col w-full gap-4 pt-2">
        <div className="flex gap-1">
          <div className="flex-1">
            <SearchInput
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
            />
          </div>
          <div className="sm:hidden block">
            <MobileFilter
              setFilter={setFilter}
              filter={filter}
              renderedIn={"admin"}
            />
          </div>
        </div>

        <div className="w-full border border-gray-300"></div>
        <div className="overflow-y-auto flex-1">
          <Suspense fallback={<Fallback />}>
            {!showInventoryForm && !showProductForm && (
              <ProductList
                filter={filter}
                searchKeyword={searchKeyword}
                supplierFilter={supplierFilter}
                setShowInventoryForm={setShowInventoryForm}
                setProductName={setProductName}
                setShowProductForm={setShowProductForm}
              />
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default productspage;

const Fallback = () => {
  return (
    <div className="flex justify-center items-center h-96">
      <span className="spinner-border-blue animate-spin w-10 h-10 border-2 border-mainButtonColor border-t-transparent rounded-full mr-2"></span>
      <p className="text-black">Loading...</p>
    </div>
  );
};
