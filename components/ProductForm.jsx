"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import placeholderImage from "@public/defaultImages/placeholder_image.png";

const ProductForm = () => {
  const [image, setImage] = useState({
    file: null,
    url: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleImage = (e) => {
    if (e.target.files.length === 0) return;
    setImage({
      file: e.target.files[0],
      url: URL.createObjectURL(e.target.files[0]),
    });
  };

  const postProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append("file", image.file);
    formData.append("product_category", selectedCategory);

    const res = await fetch(`/api/admin/products`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Product added successfully");
      e.target.reset();
      setImage({ file: null, url: "" });
    }
  };

  return (
    <form
      onSubmit={(e) => postProduct(e)}
      className="flex flex-col w-full gap-2 h-fit py-2 px-1"
    >
      <div className="flex flex-col gap-2 w-full">
        <Image
          src={image.url || placeholderImage}
          width={100}
          height={100}
          className="object-scale-down max-h-[100px] max-w-[100px] rounded-lg"
        />
        <label htmlFor="product_name">Product Name</label>
        <input
          type="text"
          name="product_name"
          placeholder="Product name"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
          required
        />
        <label htmlFor="product_category">Product Category</label>
        <CategoryInput setSelectedCategory={setSelectedCategory} />
        <label htmlFor="file">Product Image</label>
        <input
          id="file"
          type="file"
          className="hidden"
          name="file"
          onChange={handleImage}
          required
        />
        <div className="flex">
          <label
            htmlFor="file"
            className="bg-mainButtonColor text-white p-2.5 rounded-tl-lg rounded-bl-lg h-full w-fit cursor-pointer"
          >
            Upload Image
          </label>
          <p className="border border-l-0  rounded-tr-lg rounded-br-lg items-center p-2 flex-1 truncate bg-white">
            {image.file?.name || image.url || "No image selected"}
          </p>
        </div>
        <label htmlFor="product_description">Product Description</label>
        <textarea
          type="text"
          name="product_description"
          placeholder="Product description"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
          required
        />
        <label htmlFor="product_sku">Product SKU</label>
        <input
          type="text"
          name="product_sku"
          placeholder="Product SKU"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
          id="product_sku"
          required
        />
        <label htmlFor="product_uom">Product UOM</label>
        <input
          type="text"
          name="product_uom"
          placeholder="Product UOM"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
          id="product_uom"
          required
        />
        <label htmlFor="product_reorder_point">Product Reorder Point</label>
        <input
          type="number"
          name="product_reorder_point"
          placeholder="Product Reorder Point"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
          id="product_reorder_point"
          required
        />
        <label htmlFor="product_weight">Product Weight</label>
        <input
          type="number"
          name="product_weight"
          placeholder="Product Weight"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
          id="product_weight"
          required
        />
        <label htmlFor="product_dimension">Product Dimensions</label>
        <input
          type="text"
          name="product_dimensions"
          placeholder="Product Dimensions"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1  "
          id="product_dimensions"
          required
        />
      </div>

      <div className="gap-2 w-full items-start flex flex-row-reverse">
        <button
          type="submit"
          className="bg-mainButtonColor text-white rounded-lg p-2 w-fit"
        >
          Create Product
        </button>
      </div>
    </form>
  );
};

export default ProductForm;

const CategoryInput = ({ setSelectedCategory }) => {
  const [categoryQuery, setCategoryQuery] = useState("");
  const [categoryQueryResults, setCategoryQueryResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [focused, setFocused] = useState(false);

  const handleCategorySearch = useCallback(async (categoryQuery) => {
    if (!categoryQuery.trim()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/query?category=${categoryQuery}`
      );
      const data = await response.json();
      setCategoryQueryResults(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategoryQueryResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCategoryQuery(value);
    setCategoryQueryResults([]);
    setLoading(true);

    if (debounceTimer) clearTimeout(debounceTimer);

    const newTimer = setTimeout(() => {
      handleCategorySearch(value);
    }, 500);
    setDebounceTimer(newTimer);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [debounceTimer]);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    setTimeout(() => setFocused(false), 100);
  };

  return (
    <div
      className={`relative flex flex-col border rounded-lg h-fit ${
        focused ? "ring-mainButtonColor ring-1" : "border-gray-300"
      }`}
    >
      <input
        type="text"
        placeholder="Type Category Name"
        onChange={handleInputChange}
        value={categoryQuery}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="border-none p-2 focus:outline-none rounded-lg"
      />
      {focused && (
        <div>
          {loading && (
            <p className="p-2 bg-gray-100 rounded-bl-lg rounded-br-lg">
              Searching...
            </p>
          )}
          {!loading && categoryQuery && categoryQueryResults.length === 0 && (
            <p className="p-2 text-gray-400 bg-gray-100 rounded-bl-lg rounded-br-lg">
              No Categories found
            </p>
          )}
          {categoryQueryResults.length > 0 && (
            <ul>
              {categoryQueryResults.map((category, index) => (
                <li
                  key={category.category_id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCategoryQuery(category.category_name);
                    setSelectedCategory(category.category_id);
                    setFocused(false);
                  }}
                  className={`p-2 cursor-pointer bg-gray-100 hover:bg-gray-200 ${
                    index === categoryQueryResults.length - 1
                      ? "rounded-b-lg"
                      : ""
                  }`}
                >
                  {category.category_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
