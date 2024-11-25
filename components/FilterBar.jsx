"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import downArrow from "@public/icons/down_arrow_icon.png";
import upArrow from "@public/icons/up_arrow_icon.png";
import plusIcon from "@public/icons/plus_icon.png";
import Image from "next/image";

const FilterBar = ({
  setFilter,
  filter,
  setSupplierFilter = () => {},
  supplierFilter = "all",
}) => {
  const [filters, setFilters] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [supplierDropdownOpen, setSupplierDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const pathName = usePathname();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetch("/api/admin/category");
        const data = await response.json();
        setFilters(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setFilters([]);
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
    setFilter(selectedCategory);
    setSupplierFilter(selectedSupplier);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSupplierSelect = (supplierId) => {
    setSelectedSupplier(supplierId);
  };

  return (
    <div className="flex flex-col w-fit gap-2 flex-1 h-full min-w-[14rem] overflow-y-auto overflow-x-hidden p-4 border-r-2 border-gray-300">
      <span className="text-xl">Filters</span>

      {/* Category Filter */}
      <div className="mb-4">
        {pathName.includes("admin") && (
          <button className="w-full h-10 rouded-sm font-semibold bg-gray-100  border-2 px-2 flex justify-between items-center border-dashed  text-mainButtonColor transition-all ease-in-out duration-100 border-mainButtonColor hover:bg-gray-200 rounded-sm">
            Create Category
            <Image src={plusIcon} alt="plus" height={20} width={20} />
          </button>
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
        {categoryDropdownOpen && (
          <div className="mt-2 pl-2 flex flex-col gap-2">
            <label htmlFor="category-all" className="flex items-center">
              <input
                type="radio"
                value="all"
                checked={selectedCategory === "all"}
                onChange={() => setSelectedCategory("all")}
                className="hidden"
                id="category-all"
              />
              <span
                className={`w-4 h-4 mr-2 border-2 rounded-full inline-block ${
                  selectedCategory === "all"
                    ? "bg-mainButtonColor"
                    : "border-gray-400"
                }`}
              />
              All
            </label>

            {filters.map((category) => (
              <label
                key={category.category_id}
                className="flex items-center"
                htmlFor={category.category_name}
              >
                <input
                  type="radio"
                  value={category.category_id}
                  checked={selectedCategory === category.category_id}
                  onChange={() => handleCategorySelect(category.category_id)}
                  className="hidden"
                  id={category.category_name}
                />
                <span
                  className={`w-4 h-4 mr-2 border-2 rounded-full inline-block ${
                    selectedCategory === category.category_id
                      ? "bg-mainButtonColor"
                      : "border-gray-400"
                  }`}
                />
                {category.category_name}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Supplier Filter */}

      {pathName.includes("admin") && (
        <div className="mb-2">
          <button className="w-full h-10 rouded-sm font-semibold bg-gray-100 border-mainButtonColor border-2 px-2 flex justify-between items-center border-dashed  text-mainButtonColor transition-all ease-in-out duration-100 hover:bg-gray-200 rounded-sm">
            Add Supplier
            <Image src={plusIcon} alt="plus" height={20} width={20} />
          </button>
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
              <label htmlFor="" className="flex items-center">
                <input
                  type="radio"
                  value="all"
                  checked={selectedSupplier === "all"}
                  onChange={() => setSelectedSupplier("all")}
                  className="hidden"
                />
                <span
                  className={`w-4 h-4 mr-2 border-2 rounded-full inline-block ${
                    selectedSupplier === "all"
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
                    checked={selectedSupplier === supplier.supplier_id}
                    onChange={() => handleSupplierSelect(supplier.supplier_id)}
                    className="hidden"
                    id={supplier.supplier_id}
                  />
                  <span
                    className={`w-4 h-4 mr-2 border-2 rounded-full inline-block ${
                      selectedSupplier === supplier.supplier_id
                        ? "bg-mainButtonColor"
                        : "border-gray-400"
                    }`}
                  />
                  {supplier.supplier_name}
                </label>
              ))}
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
