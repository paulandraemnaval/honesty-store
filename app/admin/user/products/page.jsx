"use client";

import { useState, Suspense, lazy, useEffect } from "react";
import FilterBar from "@components/FilterBar";
import SearchInput from "@components/SearchInput";
import MobileFilter from "@components/MobileFilter";
import Loading from "@components/Loading";

const ProductList = lazy(() => import("@components/ProductList"));
const InventoryForm = lazy(() => import("@components/InventoryForm"));
const ProductForm = lazy(() => import("@components/ProductForm"));
const CategoryForm = lazy(() => import("@components/CategoryForm"));
const SupplierForm = lazy(() => import("@components/SupplierForm"));
const ProductInventories = lazy(() => import("@components/ProductInventories"));

const productspage = () => {
  //these states store IDS of the selected category and supplier

  const [searchKeyword, setSearchKeyword] = useState("");

  //edit states
  const [productName, setProductName] = useState("");

  //technically, these states are not needed, but they are used to keep track of the ID of the entity being edited
  //in the future adjust the logic in filter application and product list to use the ID directly
  const [editingInventoryID, setEditingInventoryID] = useState("");
  const [editingProductID, setEditingProductID] = useState("");
  const [editingCategoryID, setEditingCategoryID] = useState("");
  const [editingSupplierID, setEditingSupplierID] = useState("");

  //instead of adding "editing_X_ID" state, we can use the ID directly in the filter application and product list. but for now, we will keep it this way
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState("all");

  const [sortUnitsAsc, setSortUnitsAsc] = useState(null); //null for deselected, true for ascending, false for descending
  const [sortPriceAsc, setSortPriceAsc] = useState(null);
  const [sortExpirationAsc, setSortExpirationAsc] = useState(null);

  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [showProductInventories, setShowProductInventories] = useState(false);

  const showPopover =
    showInventoryForm ||
    showProductForm ||
    showCategoryForm ||
    showSupplierForm ||
    showProductInventories;

  useEffect(() => {
    showProductInventories;
  }, [showProductInventories]);

  return (
    <div className="w-full px-2 flex sm:h-[calc(100vh-5rem)] h-[calc(100vh-9.5rem)] relative">
      {showPopover && (
        <div className="absolute w-full h-full z-50 border top-0 left-0 bg-[rgba(0,0,0,0.25)]">
          <div className="z-50 sm:w-[calc(100vw-30rem)] w-[calc(100vw)] sm:h-[calc(100vh-10rem)] h-[calc(100vh-6rem)]  rounded-md shadow-md absolute self-center sm:top-[50%] top-0 sm:left-[50%] left-0 smLtransform sm:-translate-x-1/2 sm:-translate-y-1/2 bg-white overflow-y-auto py-6 px-6">
            <Suspense fallback={<Loading />}>
              {showInventoryForm && (
                <InventoryForm
                  setShowInventoryForm={setShowInventoryForm}
                  productName={productName}
                  inventoryID={editingInventoryID}
                  setEditingInventoryID={setEditingInventoryID}
                  setShowProductInventories={setShowProductInventories}
                />
              )}

              {showProductForm && (
                <ProductForm
                  productID={editingProductID}
                  setShowProductForm={setShowProductForm}
                  setEditingProductID={setEditingProductID}
                />
              )}

              {showCategoryForm && (
                <CategoryForm
                  setShowCategoryForm={setShowCategoryForm}
                  categoryID={editingCategoryID}
                  redirectURL=""
                />
              )}

              {showSupplierForm && (
                <SupplierForm
                  setShowSupplierForm={setShowSupplierForm}
                  supplierID={editingSupplierID}
                  redirectURL=""
                />
              )}

              {showProductInventories && (
                <ProductInventories
                  productID={editingProductID}
                  setShowProductInventories={setShowProductInventories}
                  setShowInventoryForm={setShowInventoryForm}
                  setEditingInventoryID={setEditingInventoryID}
                />
              )}
            </Suspense>
          </div>
        </div>
      )}

      <div className="sm:flex hidden pr-2">
        <FilterBar
          setSelectedCategory={setSelectedCategory}
          setSelectedSupplier={setSelectedSupplier}
          setShowCategoryForm={setShowCategoryForm}
          setShowSupplierForm={setShowSupplierForm}
          setSortUnitsAsc={setSortUnitsAsc}
          setSortPriceAsc={setSortPriceAsc}
          setSortExpirationAsc={setSortExpirationAsc}
          setEditingCategoryID={setEditingCategoryID}
          setEditingSupplierID={setEditingSupplierID}
        />
      </div>

      <div className="flex flex-col w-full pt-4">
        <div className="flex gap-1">
          <div className="flex-1 mb-4">
            <SearchInput
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
            />
          </div>
          <div className="sm:hidden block mb-4">
            <MobileFilter
              setSelectedCategory={setSelectedCategory}
              setSelectedSupplier={setSelectedSupplier}
              setSortUnitsAsc={setSortUnitsAsc}
              setSortPriceAsc={setSortPriceAsc}
              setSortExpirationAsc={setSortExpirationAsc}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border border-mainButtonColorDisabled"></div>
        {/* Divider */}

        <div className="overflow-y-auto flex-1 ">
          <Suspense fallback={<Loading />}>
            {!showInventoryForm && !showProductForm && (
              <ProductList
                selectedCategory={selectedCategory}
                selectedSupplier={selectedSupplier}
                sortPriceAsc={sortPriceAsc}
                sortUnitsAsc={sortUnitsAsc}
                sortExpirationAsc={sortExpirationAsc}
                searchKeyword={searchKeyword}
                editingProductID={editingProductID}
                setShowInventoryForm={setShowInventoryForm}
                setProductName={setProductName}
                setShowProductForm={setShowProductForm}
                setEditingProductID={setEditingProductID}
                setShowProductInventories={setShowProductInventories}
              />
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default productspage;
