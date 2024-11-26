"use client";

import Image from "next/image";
import FilterIcon from "@public/icons/filter_icon.png";
import closeIcon from "@public/icons/close_icon.png";
import { useEffect, useState } from "react";
import plusIcon from "@public/icons/plus_icon.png";
import Link from "next/link";
const MobileFilter = ({
  setFilter,
  filter,
  setSupplierFilter = () => {},
  supplierFilter = "all",
  renderedIn,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [localFilter, setLocalFilter] = useState(filter);
  const [localSupplierFilter, setLocalSupplierFilter] =
    useState(supplierFilter);

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch("/api/admin/category");
        const data = await response.json();
        setFilters(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setFilters([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    const getSuppliers = async () => {
      try {
        setLoadingSuppliers(true);
        const response = await fetch("/api/admin/supplier");
        const data = await response.json();
        setSuppliers(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error("Failed to fetch suppliers:", err);
        setSuppliers([]);
      } finally {
        setLoadingSuppliers(false);
      }
    };

    if (renderedIn === "admin") {
      getSuppliers();
    }
  }, [renderedIn]);

  const handleApplyFilters = () => {
    setFilter(localFilter);
    setSupplierFilter(localSupplierFilter);
    setIsExpanded(false);
  };

  return (
    <>
      <div
        className="object-cover flex gap-1 items-center justify-center px-2 py-2 bg-mainButtonColor rounded-md font-semibold text-white"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <span>Filter</span>
        <Image src={FilterIcon} height={20} width={20} alt="filter_icon" />
      </div>
      {isExpanded && (
        <div
          className={`${
            renderedIn === "customer" ? "h-[100vh]" : "h-[calc(100vh-9.5rem)]"
          } w-[100vw] fixed top-[5rem] right-0 bg-[rgba(120,120,120,0.75)] flex flex-col items-end z-10 `}
        >
          <div className="w-[70vw] flex flex-col bg-white h-full overflow-y-auto">
            {/* Header */}
            <div className="flex py-2 px-4 justify-center items-center">
              <span className="mr-auto font-semibold text-xl">Filter</span>
              <div
                className="object-cover"
                onClick={() => setIsExpanded(false)}
              >
                <Image
                  src={closeIcon}
                  height={25}
                  width={25}
                  alt="close_icon"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex px-4 flex-col gap-2">
              <span>By Category</span>
              <div className="grid gap-1 w-full grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]">
                <Link
                  className="flex items-center justify-center gap-2 py-2 border-dashed border text-mainButtonColor transition-all ease-in-out duration-100 border-mainButtonColor hover:bg-gray-200 rounded-sm col-span-2"
                  href="/admin/user/manage/create_category/"
                >
                  <span>Create Category</span>
                  <Image src={plusIcon} alt="plus" height={20} width={20} />
                </Link>
                {loadingCategories ? (
                  <div className="col-span-2 flex items-center justify-center gap-2">
                    <span className="spinner-border-blue animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2 "></span>
                    Loading Categories...
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setLocalFilter("all")}
                      className={`p-2 text-center font-semibold rounded-sm ${
                        localFilter === "all"
                          ? "bg-mainButtonColor text-white"
                          : "text-black bg-gray-200"
                      }`}
                    >
                      All
                    </button>

                    {filters.map((filter) => (
                      <button
                        key={filter.category_id}
                        onClick={() => setLocalFilter(filter.category_id)}
                        className={`p-2 text-center font-semibold rounded-sm ${
                          localFilter === filter.category_id
                            ? "bg-mainButtonColor text-white"
                            : "text-black bg-gray-200"
                        }`}
                      >
                        {filter.category_name}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Suppliers */}
            {renderedIn === "admin" && (
              <div className="flex px-4 flex-col gap-2 mt-4">
                <span>By Supplier</span>
                <div className="grid gap-1 w-full grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]">
                  <Link
                    href={"/admin/user/manage/add_supplier/"}
                    className="flex items-center justify-center gap-2 py-2 border-dashed border text-mainButtonColor transition-all ease-in-out duration-100 border-mainButtonColor hover:bg-gray-200 rounded-sm col-span-2"
                  >
                    <span>Create Supplier</span>
                    <Image src={plusIcon} alt="plus" height={20} width={20} />
                  </Link>
                  {loadingSuppliers ? (
                    <div className="col-span-2 flex items-center justify-center gap-2">
                      <span className="spinner-border-blue animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2 "></span>
                      Loading Suppliers...
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setLocalSupplierFilter("all")}
                        className={`p-2 text-center font-semibold rounded-sm ${
                          localSupplierFilter === "all"
                            ? "bg-mainButtonColor text-white"
                            : "text-black bg-gray-200"
                        }`}
                      >
                        All
                      </button>
                      {suppliers.map((supplier) => (
                        <button
                          key={supplier.supplier_id}
                          onClick={() =>
                            setLocalSupplierFilter(supplier.supplier_id)
                          }
                          className={`p-2 text-center font-semibold rounded-sm ${
                            localSupplierFilter === supplier.supplier_id
                              ? "bg-mainButtonColor text-white"
                              : "text-black bg-gray-200"
                          }`}
                        >
                          {supplier.supplier_name}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Apply Button */}
            <div className="w-full px-4 py-2 mt-auto flex flex-row-reverse z-0">
              <button
                className="bg-mainButtonColor text-white p-2 rounded-md"
                onClick={handleApplyFilters}
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileFilter;
