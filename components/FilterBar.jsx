"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import downArrow from "@public/icons/down_arrow_icon.png";
import upArrow from "@public/icons/up_arrow_icon.png";
import plusIcon from "@public/icons/plus_icon.png";
import editIcon from "@public/icons/edit_icon.png";
import Image from "next/image";
import Link from "next/link";
import Loading from "@components/Loading";
const FilterBar = ({
  setSelectedCategory = () => {},
  setSelectedSupplier = () => {},
  setShowCategoryForm = () => {},
  setShowSupplierForm = () => {},
  selectedCategory = "all",
  selectedSupplier = "all",
}) => {
  const [catetories, setCatetories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [supplierDropdownOpen, setSupplierDropdownOpen] = useState(false);
  const [localCategory, setLocalCategory] = useState("all");
  const [localSupplier, setLocalSupplier] = useState("all");
  const [loading, setLoading] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/category");
        const data = await response.json();
        setCatetories(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCatetories([]);
      } finally {
        setLoading(false);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    const getSuppliers = async () => {
      try {
        const response = await fetch("/api/admin/supplier");
        const data = await response.json();
        setSuppliers(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error("Failed to fetch suppliers:", err);
        setSuppliers([]);
      }
    };
    if (pathName.includes("admin")) {
      getSuppliers();
    }
  }, []);

  const handleApplyFilters = () => {
    setSelectedCategory(localCategory);
    setSelectedSupplier(localSupplier);
  };

  return (
    <div className="flex flex-col w-fit gap-2 flex-1 h-full min-w-[14rem] overflow-y-auto overflow-x-hidden p-4 border-r-2 border-gray-300 custom-scrollbar">
      <span className="text-xl">Filters</span>

      {/* Category Filter */}
      <div className="mb-4">
        {pathName.includes("admin") && (
          <div className="w-full flex ">
            <button
              className="w-[80%]  text-sm h-8 rouded-sm font-semibold bg-gray-100  border-2 px-2 flex justify-between items-center border-dashed  text-mainButtonColor transition-all ease-in-out duration-100 border-mainButtonColor hover:bg-gray-200 rounded-sm"
              onClick={() => setShowCategoryForm(true)}
            >
              Create Category
              <Image src={plusIcon} alt="plus" height={20} width={20} />
            </button>
          </div>
        )}
        <button
          className="w-full text-left p-2 flex justify-between items-center object-cover "
          onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
        >
          By Category
          <Image
            src={categoryDropdownOpen ? upArrow : downArrow}
            alt="arrow"
            height={20}
            width={20}
            className="h-4 w-4"
          />
        </button>
        <div className="w-full border mb-2"></div>
        {categoryDropdownOpen && !loading && (
          <div className="mt-2 pl-2 flex flex-col gap-2">
            <label htmlFor="category-all" className="flex items-center">
              <input
                type="radio"
                value="all"
                checked={localCategory === "all"}
                onChange={() => setLocalCategory("all")}
                className="hidden"
                id="category-all"
              />
              <span
                className={`w-4 h-4 mr-2 border-2 rounded-full inline-block ${
                  localCategory === "all"
                    ? "bg-mainButtonColor"
                    : "border-gray-400"
                }`}
              />
              All
            </label>

            {catetories.map((category) => (
              <label
                key={category.category_id}
                className="flex items-center"
                htmlFor={category.category_name}
              >
                <input
                  type="radio"
                  value={category.category_id}
                  checked={localCategory === category.category_id}
                  onChange={() => setLocalCategory(category.category_id)}
                  className="hidden"
                  id={category.category_name}
                />
                <span
                  className={`w-4 h-4 mr-2 border-2 rounded-full inline-block ${
                    localCategory === category.category_id
                      ? "bg-mainButtonColor"
                      : "border-gray-400"
                  }`}
                />
                <span className="mr-auto max-w-[80%]">
                  {category.category_name}
                </span>
                {pathName.includes("admin") &&
                  category.category_id === localCategory && (
                    <Image
                      src={editIcon}
                      alt="edit"
                      height={20}
                      width={20}
                      className="cursor-pointer"
                      onClick={() => setShowCategoryForm(true)}
                    />
                  )}
              </label>
            ))}
          </div>
        )}

        {categoryDropdownOpen && loading && (
          <div className="flex justify-center items-center h-10">
            <span className="spinner-border-blue animate-spin w-10 h-10 border-2 border-mainButtonColor border-t-transparent rounded-full mr-2"></span>
            <p className="text-black">Loading...</p>
          </div>
        )}
      </div>

      {/* Supplier Filter */}

      {pathName.includes("admin") && (
        <div className="mb-2">
          <div className="flex w-full">
            <button
              onClick={() => setShowSupplierForm(true)}
              className="w-[70%] text-sm h-8 rouded-sm font-semibold bg-gray-100 border-mainButtonColor border-2 px-2 flex justify-between items-center border-dashed  text-mainButtonColor transition-all ease-in-out duration-100 hover:bg-gray-200 rounded-sm"
            >
              Add Supplier
              <Image src={plusIcon} alt="plus" height={20} width={20} />
            </button>
          </div>
          <button
            className="w-full text-left p-2 flex justify-between items-center"
            onClick={() => setSupplierDropdownOpen(!supplierDropdownOpen)}
          >
            By Supplier
            <Image
              src={supplierDropdownOpen ? upArrow : downArrow}
              alt="arrow"
              height={15}
              width={15}
            />
          </button>
          <div className="w-full border mb-2"></div>
          {supplierDropdownOpen && (
            <div className="mt-2 pl-2 flex flex-col gap-2">
              <label htmlFor="supplier-all" className="flex items-center">
                <input
                  type="radio"
                  value="all"
                  checked={localSupplier === "all"}
                  onChange={() => setLocalSupplier("all")}
                  className="hidden"
                  id="supplier-all"
                />
                <span
                  className={`w-4 h-4 mr-2 border-2 rounded-full inline-block ${
                    localSupplier === "all"
                      ? "bg-mainButtonColor"
                      : "border-gray-400"
                  }`}
                />
                All
              </label>
              {suppliers.map((supplier) => (
                <label
                  key={supplier.supplier_id}
                  className="flex items-center"
                  htmlFor={supplier.supplier_id}
                >
                  <input
                    type="radio"
                    value={supplier.supplier_id}
                    checked={localSupplier === supplier.supplier_id}
                    onChange={() => setLocalSupplier(supplier.supplier_id)}
                    className="hidden"
                    id={supplier.supplier_id}
                  />
                  <span
                    className={`w-4 h-4 mr-2 border-2 rounded-full inline-block ${
                      localSupplier === supplier.supplier_id
                        ? "bg-mainButtonColor"
                        : "border-gray-400"
                    }`}
                  />
                  <span className="mr-auto max-w-[70%]">
                    {supplier.supplier_name}
                  </span>
                  {pathName.includes("admin") &&
                    localSupplier === supplier.supplier_id && (
                      <Image
                        src={editIcon}
                        alt="edit"
                        height={20}
                        width={20}
                        className="cursor-pointer"
                        onClick={() => setShowSupplierForm(true)}
                      />
                    )}
                </label>
              ))}
              {supplierDropdownOpen && loading && (
                <div className="flex justify-center items-center h-10">
                  <span className="spinner-border-blue animate-spin w-10 h-10 border-2 border-mainButtonColor border-t-transparent rounded-full mr-2"></span>
                  <p className="text-black">Loading...</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Apply Button */}
      <button
        className="bg-mainButtonColor text-white p-2 rounded-md mt-auto"
        onClick={handleApplyFilters}
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterBar;
