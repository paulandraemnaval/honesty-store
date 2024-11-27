"use client";

import Image from "next/image";
import FilterIcon from "@public/icons/filter_icon.png";
import closeIcon from "@public/icons/close_icon.png";
import { useEffect, useState } from "react";
import plusIcon from "@public/icons/plus_icon.png";
import Link from "next/link";
import editIcon from "@public/icons/edit_icon.png";
import editIconWhite from "@public/icons/edit_icon_white.png";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import ButtonLoading from "./ButtonLoading";

const MobileFilter = ({
  setSelectedCategory = () => {},
  selectedCategory = "all",
  setSupplierFilter = () => {},
  supplierFilter = "all",
  renderedIn,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isExpanded, setIsExpanded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [localCategory, setLocalCategory] = useState("all");
  const [localSupplier, setLocalSupplier] = useState("all");

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch("/api/admin/category");
        const data = await response.json();
        setCategories(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
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

    if (pathname.includes("admin")) {
      getSuppliers();
    }
  }, [pathname]);

  const handleApplyFilters = () => {
    setSelectedCategory(localCategory);
    setSupplierFilter(localSupplier);
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
            pathname.includes("admin")
              ? "h-[calc(100vh-9.5rem)] top-[5rem]"
              : "h-[100vh] top-[4rem]"
          } w-[100vw] fixed  right-0 bg-[rgba(120,120,120,0.75)] flex flex-col items-end z-10 `}
        >
          <div className="w-[85vw] flex flex-col bg-white h-full overflow-y-auto">
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
              <div className="flex gap-2">
                <span className="mt-auto mr-auto">By Category</span>
              </div>
              <div className="grid gap-1 w-full grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]">
                {pathname.includes("admin") && (
                  <Link
                    className={`flex items-center justify-center gap-2 py-2 border-dashed border-2 text-mainButtonColor transition-all ease-in-out duration-100 border-mainButtonColor hover:bg-gray-200 rounded-sm col-span-2
                    `}
                    href="/admin/user/manage/create_category/"
                  >
                    <span>Create Category</span>
                    <Image src={plusIcon} alt="plus" height={20} width={20} />
                  </Link>
                )}
                {loadingCategories ? (
                  <div className="col-span-2 flex items-center justify-center gap-2">
                    <ButtonLoading color="mainButtonColor">
                      <span>Loading Categories...</span>
                    </ButtonLoading>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setLocalCategory("all")}
                      className={`p-2 text-center font-semibold rounded-sm ${
                        localCategory === "all"
                          ? "bg-mainButtonColor text-white"
                          : "text-black bg-gray-200"
                      }
                      `}
                    >
                      All
                    </button>

                    {categories.map((category) => (
                      <button
                        key={category.category_id}
                        onClick={() => setLocalCategory(category.category_id)}
                        className={` flex text-center font-semibold rounded-sm ${
                          localCategory === category.category_id
                            ? "bg-mainButtonColor text-white"
                            : "text-black bg-gray-200"
                        }
                        `}
                      >
                        <div className="w-full mt-2 mb-2 px-2">
                          {category.category_name}
                        </div>
                        {renderedIn === "admin" &&
                          category.category_id === localCategory && (
                            <Link
                              href={`/admin/user/manage/edit_category/${category.category_id}`}
                              className="bg-white h-full items-center flex w-14 justify-center"
                            >
                              <Image
                                src={editIcon}
                                alt="edit_icon"
                                height={20}
                                width={20}
                              />
                            </Link>
                          )}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Suppliers */}
            {pathname.includes("admin") && (
              <div className="flex px-4 flex-col gap-2 mt-4">
                <div className="flex gap-2">
                  <span className="mt-auto mr-auto">By Supplier</span>
                </div>
                <div className="grid gap-1 w-full grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]">
                  <Link
                    href={"/admin/user/manage/add_supplier/"}
                    className={`flex items-center justify-center gap-2 py-2 border-dashed border-2 text-mainButtonColor transition-all ease-in-out duration-100 border-mainButtonColor hover:bg-gray-200 rounded-sm col-span-2
                      `}
                  >
                    <span>Create Supplier</span>
                    <Image src={plusIcon} alt="plus" height={20} width={20} />
                  </Link>
                  {loadingSuppliers ? (
                    <div className="col-span-2 flex items-center justify-center gap-2">
                      <ButtonLoading color="mainButtonColor">
                        Loading Suppliers...
                      </ButtonLoading>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setLocalSupplier("all")}
                        className={`p-2 text-center font-semibold rounded-sm ${
                          localSupplier === "all"
                            ? "bg-mainButtonColor text-white"
                            : "text-black bg-gray-200"
                        }
                        `}
                      >
                        All
                      </button>
                      {suppliers.map((supplier) => (
                        <button
                          key={supplier.supplier_id}
                          onClick={() => setLocalSupplier(supplier.supplier_id)}
                          className={`flex text-center font-semibold rounded-sm ${
                            localSupplier === supplier.supplier_id
                              ? "bg-mainButtonColor text-white"
                              : "text-black bg-gray-200"
                          }
                          `}
                        >
                          <div className="w-full mt-2 mb-2 px-2 truncate">
                            {supplier.supplier_name}
                          </div>
                          {pathname.includes("admin") &&
                            supplier.supplier_id === localSupplier && (
                              <Link
                                href={`/admin/user/manage/edit_supplier/${supplier.supplier_id}`}
                                className="bg-white h-full items-center flex w-14 justify-center"
                              >
                                <Image
                                  src={editIcon}
                                  alt="edit_icon"
                                  height={20}
                                  width={20}
                                />
                              </Link>
                            )}
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
