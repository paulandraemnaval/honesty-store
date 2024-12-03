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

//TODO: add indicator how many filters are active

const FilterBar = ({
  setSelectedCategory = () => {},
  setSelectedSupplier = () => {},
  setShowCategoryForm = () => {},
  setShowSupplierForm = () => {},
  setSortUnitsAsc = () => {},
  setSortPriceAsc = () => {},
  setSortExpirationAsc = () => {},
  setEditingCategoryID = () => {},
  setEditingSupplierID = () => {},
}) => {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [supplierDropdownOpen, setSupplierDropdownOpen] = useState(false);
  const [localCategory, setLocalCategory] = useState("all");
  const [localSupplier, setLocalSupplier] = useState("all");
  const [localSortUnitsAsc, setLocalSortUnitsAsc] = useState(null);
  const [localSortPriceAsc, setLocalSortPriceAsc] = useState(null);
  const [localSortExpAsc, setLocalSortExpAsc] = useState(null);
  const [loading, setLoading] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/category");
        const data = await response.json();
        setCategories(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
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
    setSortUnitsAsc(localSortUnitsAsc);
    setSortPriceAsc(localSortPriceAsc);
    setSortExpirationAsc(localSortExpAsc);
  };

  return (
    <div className="flex flex-col w-fit gap-2 flex-1 h-full min-w-[14rem] overflow-y-auto overflow-x-hidden p-4 border-r border-gray-300 custom-scrollbar">
      <span className="text-xl mb-2">Filters</span>
      {/* Category Filter */}
      <div className="mb-4">
        {pathName.includes("admin") && (
          <div className="w-full flex ">
            <button
              className="w-[80%]  text-sm h-8 rouded-sm font-semibold bg-gray-100  border-2 px-2 flex justify-between items-center border-dashed  text-mainButtonColor transition-all ease-in-out duration-100 border-mainButtonColor hover:bg-gray-200 rounded-sm"
              onClick={() => {
                setShowCategoryForm(true);
                setEditingCategoryID("");
              }}
            >
              Create Category
              <Image src={plusIcon} alt="plus" height={20} width={20} />
            </button>
          </div>
        )}
        <button
          className="w-full text-left p-2 flex justify-between items-center object-cover "
          onClick={() => setCategoryDropdownOpen((prev) => !prev)}
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

            {categories.map((category) => {
              if (category.category_soft_deleted) return;
              return (
                <label
                  key={category.category_id}
                  className="flex items-center"
                  htmlFor={category.category_name}
                >
                  <input
                    type="radio"
                    value={category.category_id}
                    checked={localCategory === category.category_id}
                    onChange={() => {
                      setLocalCategory(category.category_id);
                      setEditingCategoryID(category.category_id);
                    }}
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
                        onClick={() => {
                          setEditingCategoryID(category.category_id);
                          setShowCategoryForm(true);
                        }}
                      />
                    )}
                </label>
              );
            })}
          </div>
        )}
        {!categoryDropdownOpen && (
          <div className="w-full px-2 text-mainButtonColor font-thin">
            {localCategory === "all"
              ? "All"
              : categories.find((cat) => cat.category_id === localCategory)
                  ?.category_name}
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
        <>
          <div className="mb-2">
            <div className="flex w-full">
              <button
                onClick={() => {
                  setShowSupplierForm(true);
                  setEditingSupplierID("");
                }}
                className="w-[70%] text-sm h-8 rouded-sm font-semibold bg-gray-100 border-mainButtonColor border-2 px-2 flex justify-between items-center border-dashed  text-mainButtonColor transition-all ease-in-out duration-100 hover:bg-gray-200 rounded-sm"
              >
                Add Supplier
                <Image src={plusIcon} alt="plus" height={20} width={20} />
              </button>
            </div>
            <button
              className="w-full text-left p-2 flex justify-between items-center"
              onClick={() => setSupplierDropdownOpen((prev) => !prev)}
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
                {suppliers.map((supplier) => {
                  if (supplier.supplier_soft_deleted) return null;
                  return (
                    <label
                      key={supplier.supplier_id}
                      className="flex items-center"
                      htmlFor={supplier.supplier_name}
                    >
                      <input
                        type="radio"
                        value={supplier.supplier_id}
                        checked={localSupplier === supplier.supplier_id}
                        onChange={() => {
                          setLocalSupplier(supplier.supplier_id);
                          setEditingSupplierID(supplier.supplier_id);
                        }}
                        className="hidden"
                        id={supplier.supplier_name}
                      />
                      <span
                        className={`w-4 h-4 mr-2 border-2 rounded-full inline-block ${
                          localSupplier === supplier.supplier_id
                            ? "bg-mainButtonColor"
                            : "border-gray-400"
                        }`}
                      />
                      <span className="mr-auto max-w-[80%]">
                        {supplier.supplier_name}
                      </span>
                      {supplier.supplier_id === localSupplier && (
                        <Image
                          src={editIcon}
                          alt="edit"
                          height={20}
                          width={20}
                          className="cursor-pointer"
                          onClick={() => {
                            setEditingSupplierID(supplier.supplier_id);
                            setShowSupplierForm(true);
                          }}
                        />
                      )}
                    </label>
                  );
                })}
                {supplierDropdownOpen && loading && (
                  <div className="flex justify-center items-center h-10">
                    <span className="spinner-border-blue animate-spin w-10 h-10 border-2 border-mainButtonColor border-t-transparent rounded-full mr-2"></span>
                    <p className="text-black">Loading...</p>
                  </div>
                )}
              </div>
            )}
            {!supplierDropdownOpen && (
              <div className="px-2 w-full text-mainButtonColor font-thin">
                {localSupplier === "all"
                  ? "All"
                  : suppliers.find((sup) => sup.supplier_id === localSupplier)
                      ?.supplier_name}
              </div>
            )}
          </div>

          {/* --------------------------------ASC/DESC----------------------------------- */}
          <div className="mb-2">
            <span className="w-full text-left px-2 flex justify-between items-center object-cover">
              By Units
            </span>
            <div className="w-full border mb-2"></div>

            <div className="w-full px-2">
              <label
                htmlFor="units_ascending"
                className="flex items-center flex-1 mb-2"
              >
                <input
                  type="checkbox"
                  id="units_ascending"
                  checked={localSortUnitsAsc === true}
                  onChange={() => {
                    const newSortUnitsAsc =
                      localSortUnitsAsc === true ? null : true;
                    setLocalSortUnitsAsc(newSortUnitsAsc);
                    if (newSortUnitsAsc === true) {
                      setLocalSortPriceAsc(null);
                      setLocalSortExpAsc(null);
                    }
                  }}
                  className="hidden"
                />
                <span
                  className={`w-4 h-4 mr-2 border-2 rounded-full inline-block ${
                    localSortUnitsAsc === true
                      ? "bg-mainButtonColor"
                      : "border-gray-400"
                  }`}
                />
                Ascending
              </label>
              <label
                htmlFor="units_descending"
                className="flex items-center flex-1"
              >
                <input
                  type="checkbox"
                  id="units_descending"
                  checked={localSortUnitsAsc === false}
                  onChange={() => {
                    const newSortUnitsAsc =
                      localSortUnitsAsc === false ? null : false;
                    setLocalSortUnitsAsc(newSortUnitsAsc);
                    if (newSortUnitsAsc === false) {
                      setLocalSortPriceAsc(null);
                      setLocalSortExpAsc(null);
                    }
                  }}
                  className="hidden"
                />
                <span
                  className={`w-4 h-4 mr-2 border-2 rounded-full inline-block ${
                    localSortUnitsAsc === false
                      ? "bg-mainButtonColor"
                      : "border-gray-400"
                  }`}
                />
                Descending
              </label>
            </div>
          </div>

          {/* exp sort */}
          <div className="mb-2">
            <span className="w-full text-left px-2 flex justify-between items-center object-cover">
              By Expiry
            </span>
            <div className="w-full border mb-2"></div>

            <div className="w-full px-2">
              <label
                htmlFor="expiry_ascending"
                className="flex items-center flex-1 mb-2"
              >
                <input
                  type="checkbox"
                  id="expiry_ascending"
                  checked={localSortExpAsc === true}
                  onChange={() => {
                    const newSortExpAsc =
                      localSortExpAsc === true ? null : true;
                    setLocalSortExpAsc(newSortExpAsc);
                    if (newSortExpAsc === true) {
                      setLocalSortPriceAsc(null);
                      setLocalSortUnitsAsc(null);
                    }
                  }}
                  className="hidden"
                />
                <span
                  className={`w-4 h-4 mr-2 border-2 rounded-full inline-block ${
                    localSortExpAsc === true
                      ? "bg-mainButtonColor"
                      : "border-gray-400"
                  }`}
                />
                Ascending
              </label>
              <label
                htmlFor="expiry_descending"
                className="flex items-center flex-1"
              >
                <input
                  type="checkbox"
                  id="expiry_descending"
                  checked={localSortExpAsc === false}
                  onChange={() => {
                    const newSortExpAsc =
                      localSortExpAsc === false ? null : false;
                    setLocalSortExpAsc(newSortExpAsc);
                    if (newSortExpAsc === false) {
                      setLocalSortPriceAsc(null);
                      setLocalSortUnitsAsc(null);
                    }
                  }}
                  className="hidden"
                />
                <span
                  className={`w-4 h-4 mr-2 border-2 rounded-full inline-block ${
                    localSortExpAsc === false
                      ? "bg-mainButtonColor"
                      : "border-gray-400"
                  }`}
                />
                Descending
              </label>
            </div>
          </div>
        </>
      )}
      <div className="mb-2">
        <span className="w-full text-left px-2 flex justify-between items-center object-cover">
          By Price
        </span>
        <div className="w-full border mb-2"></div>

        <div className="w-full px-2">
          <label
            htmlFor="price_ascending"
            className="flex items-center flex-1 mb-2"
          >
            <input
              type="checkbox"
              id="price_ascending"
              checked={localSortPriceAsc === true}
              onChange={() => {
                const newSortPriceAsc =
                  localSortPriceAsc === true ? null : true;
                setLocalSortPriceAsc(newSortPriceAsc);
                if (newSortPriceAsc === true) {
                  setLocalSortUnitsAsc(null);
                  setLocalSortExpAsc(null);
                }
              }}
              className="hidden"
            />
            <span
              className={`w-4 h-4 mr-2 border-2 rounded-full inline-block ${
                localSortPriceAsc === true
                  ? "bg-mainButtonColor"
                  : "border-gray-400"
              }`}
            />
            Ascending
          </label>
          <label
            htmlFor="price_descending"
            className="flex items-center flex-1"
          >
            <input
              type="checkbox"
              id="price_descending"
              checked={localSortPriceAsc === false}
              onChange={() => {
                const newSortPriceAsc =
                  localSortPriceAsc === false ? null : false;
                setLocalSortPriceAsc(newSortPriceAsc);
                if (newSortPriceAsc === false) {
                  setLocalSortUnitsAsc(null);
                  setLocalSortExpAsc(null);
                }
              }}
              className="hidden"
            />
            <span
              className={`w-4 h-4 mr-2 border-2 rounded-full inline-block ${
                localSortPriceAsc === false
                  ? "bg-mainButtonColor"
                  : "border-gray-400"
              }`}
            />
            Descending
          </label>
        </div>
      </div>
      {/* Apply Button */}
      <button
        className="bg-mainButtonColor text-white p-2 rounded-md mt-auto"
        onClick={() => {
          handleApplyFilters();
        }}
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterBar;
