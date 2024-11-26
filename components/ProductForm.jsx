"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import placeholderImage from "@public/defaultImages/placeholder_image.png";
import { toast } from "react-hot-toast";

const ProductForm = ({ productID = "" }) => {
  const [image, setImage] = useState({
    file: null,
    url: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryValid, setCategoryValid] = useState(false);

  const [validationMessages, setValidationMessages] = useState({
    image_input: "\u00A0",
    product_name: "\u00A0",
    product_sku: "\u00A0",
    product_uom: "\u00A0",
    product_reorder_point: "\u00A0",
    product_weight: "\u00A0",
    product_weight_unit: "\u00A0",
    product_dimensions: "\u00A0",
  });

  const handleImage = (e) => {
    if (e.target.files.length === 0) return;
    setImage({
      file: e.target.files[0],
      url: URL.createObjectURL(e.target.files[0]),
    });
  };

  useEffect(() => {
    if (productID) {
      const fetchProductData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/admin/products/${productID}`);
          const productData = await response.json();
          setProduct(productData?.data);
          if (productData?.data?.product_category) {
            const categoryResponse = await fetch(
              `/api/admin/category/${productData.data.product_category}`
            );
            const categoryData = await categoryResponse.json();
            setCategoryName(categoryData?.data?.category_name);
            setSelectedCategory(productData?.data?.product_category);
            setImage({
              file: null,
              url: productData?.data?.product_image_url || "",
            });
          }
        } catch (err) {
          console.log(err);
          setProduct({});
          setCategoryName("");
        } finally {
          setLoading(false);
        }
      };

      fetchProductData();
    }
  }, [productID]);

  const validateForm = (formData) => {
    const messages = {
      image_input:
        image.file || product?.product_image_url
          ? "\u00A0"
          : "Please select an image.",
      product_name: formData.get("product_name").trim()
        ? "\u00A0"
        : "Product name is required.",
      product_category: categoryValid
        ? "\u00A0"
        : "Invalid Category. Please select from the dropdown.",
      product_sku: formData.get("product_sku").trim()
        ? "\u00A0"
        : "Product SKU is required.",
      product_uom: formData.get("product_uom").trim()
        ? "\u00A0"
        : "Product UOM is required.",
      product_reorder_point:
        Number(formData.get("product_reorder_point")) > 0
          ? "\u00A0"
          : "Reorder point must be greater than 0.",
      product_weight:
        Number(formData.get("product_weight")) > 0
          ? "\u00A0"
          : "Weight must be greater than 0.",
      product_weight_unit: formData.get("product_weight_unit").trim()
        ? "\u00A0"
        : "Weight unit is required.",
      product_dimensions: formData.get("product_dimensions").trim()
        ? "\u00A0"
        : "Dimensions are required.",
    };

    setValidationMessages(messages);

    Object.keys(messages).forEach((id) => {
      const input = document.getElementById(id);
      if (input) {
        if (messages[id] !== "\u00A0") {
          input.classList.add("border-red-500");
          input.classList.remove("border-gray-300");
        } else {
          input.classList.remove("border-red-500");
          input.classList.add("border-gray-300");
        }
      }
    });

    return (
      Object.values(messages).every((msg) => msg === "\u00A0") && categoryValid
    );
  };

  const postProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append("file", image.file);
    formData.append("product_category", selectedCategory);

    const weight =
      "" +
      formData.get("product_weight") +
      " " +
      formData.get("product_weight_unit");
    formData.delete("product_weight_unit");
    formData.set("product_weight", weight);

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Product added successfully!", {
          duration: 3000,
          style: { fontSize: "1.2rem", padding: "16px" },
        });
        e.target.reset();
        setImage({ file: null, url: "" });
        setCategoryName("");
      } else {
        toast.error("Product addition failed. Please try again.", {
          duration: 3000,
          style: { fontSize: "1.2rem", padding: "16px" },
        });
      }
    } catch (err) {
      toast.error("Error occurred while adding product.");
    } finally {
      setLoading(false);
    }
  };

  const patchProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    if (image.file) formData.append("file", image.file);
    formData.append("url", product?.product_image_url);
    formData.append("product_category", selectedCategory);

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productID}`, {
        method: "PATCH",
        body: formData,
      });

      if (res.ok) {
        toast.success("Product update successful!", {
          duration: 3000,
          style: { fontSize: "1.2rem", padding: "16px" },
        });
      } else {
        toast.error("Product update failed. Please try again.", {
          duration: 3000,
          style: { fontSize: "1.2rem", padding: "16px" },
        });
      }
    } catch (err) {
      toast.error("Error occurred while updating product.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    if (!validateForm(formData)) {
      toast.error("Please check the inputs and try again.", {
        duration: 3000,
        style: { fontSize: "1.2rem", padding: "16px" },
      });
      return;
    }

    if (productID) {
      patchProduct(e);
    } else {
      postProduct(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full h-fit py-2 px-1 z-0"
    >
      <div className="flex flex-col w-full ">
        <Image
          src={image.url || product?.product_image_url || placeholderImage}
          width={100}
          height={100}
          className="object-scale-down max-h-[100px] max-w-[100px] rounded-lg"
          alt="Product"
        />
        <label htmlFor="product_name">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          id="product_name"
          type="text"
          name="product_name"
          placeholder="Product name"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
          defaultValue={product?.product_name || ""}
        />
        <p className="text-red-500 text-sm mb-2">
          {validationMessages.product_name}
        </p>
        <label htmlFor="product_category">
          Product Category <span className="text-red-600">*</span>
        </label>
        <CategoryInput
          setSelectedCategory={setSelectedCategory}
          categoryName={categoryName}
          setCategoryName={setCategoryName}
          setCategoryValid={setCategoryValid}
        />
        <p className="text-red-500 text-sm mb-2">
          {validationMessages.product_category}
        </p>
        <label htmlFor="file">
          Product Image <span className="text-red-600">*</span>
        </label>
        <input
          id="file"
          type="file"
          className="hidden"
          name="file"
          onChange={handleImage}
        />
        <div className="flex image_input rounded-lg" id="image_input">
          <label
            htmlFor="file"
            className="bg-mainButtonColor text-white p-2.5 rounded-tl-lg rounded-bl-lg h-full w-fit cursor-pointer"
          >
            Upload Image
          </label>
          <p className="border border-l-0 w-0 rounded-tr-lg rounded-br-lg items-center p-2 flex-1 truncate bg-white">
            {product?.product_image_url || image.url || "No image selected"}
          </p>
        </div>
        <p className="text-red-500 text-sm mb-2">
          {validationMessages.image_input}
        </p>
        <label htmlFor="product_sku">
          Product SKU<span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          name="product_sku"
          placeholder="Product SKU"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
          id="product_sku"
          defaultValue={product?.product_sku || ""}
        />
        <p className="text-red-500 text-sm mb-2">
          {validationMessages.product_sku}
        </p>
        <label htmlFor="product_uom">
          Product UOM<span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          name="product_uom"
          placeholder="Product UOM"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
          id="product_uom"
          defaultValue={product?.product_uom || ""}
        />
        <p className="text-red-500 text-sm mb-2">
          {validationMessages.product_uom}
        </p>
        <label htmlFor="product_reorder_point">
          Product Reorder Point<span className="text-red-600">*</span>
        </label>
        <input
          type="number"
          name="product_reorder_point"
          placeholder="Product Reorder Point"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
          id="product_reorder_point"
          defaultValue={product?.product_reorder_point || ""}
        />
        <p className="text-red-500 text-sm mb-2">
          {validationMessages.product_reorder_point}
        </p>
        <label htmlFor="product_weight">
          Product Weight<span className="text-red-600">*</span>
        </label>
        <input
          type="number"
          name="product_weight"
          placeholder="Product Weight"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
          id="product_weight"
          defaultValue={product?.product_weight || ""}
        />
        <p className="text-red-500 text-sm mb-2">
          {validationMessages.product_weight}
        </p>
        <label htmlFor="">
          Product Weight Unit
          <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          name="product_weight_unit"
          placeholder="Product Weight Unit"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
          id="product_weight_unit"
          defaultValue={""}
        />
        <p className="text-red-500 text-sm mb-2">
          {validationMessages.product_weight_unit}
        </p>
        <label htmlFor="product_dimension">
          Product Dimensions<span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          name="product_dimensions"
          placeholder="Product Dimensions"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
          id="product_dimensions"
          defaultValue={product?.product_dimension || ""}
        />
        <p className="text-red-500 text-sm mb-2">
          {validationMessages.product_dimensions}
        </p>
        <label htmlFor="product_description">Product Description</label>
        <textarea
          name="product_description"
          placeholder="Product description"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300 mb-2"
          defaultValue={product?.product_description || ""}
        />
      </div>

      <div className="gap-2 w-full items-start flex flex-row-reverse">
        <button
          type="submit"
          className={`w-fit p-2 bg-mainButtonColor text-white rounded-md text-sm flex items-center justify-center gap-1 ${
            loading ? "opacity-60" : ""
          }`}
          disabled={loading}
        >
          {loading
            ? "Uploading..."
            : productID
            ? "Update Product"
            : "Create Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;

const CategoryInput = ({
  setSelectedCategory,
  categoryName,
  setCategoryName,
  setCategoryValid,
}) => {
  const [categoryQuery, setCategoryQuery] = useState(categoryName || "");
  const [categoryQueryResults, setCategoryQueryResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setCategoryQuery(categoryName);
  }, [categoryName]);

  const handleCategorySearch = useCallback(async (categoryQuery) => {
    if (!categoryQuery.trim()) {
      setLoading(false);
      setCategoryQueryResults([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/query?category=${categoryQuery}`
      );
      const data = await response.json();
      const categories = Array.isArray(data?.data) ? data.data : [];
      setCategoryQueryResults(categories);
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
    setCategoryValid(false); // Mark as invalid when typing again
    setLoading(true);

    if (debounceTimer) clearTimeout(debounceTimer);

    const newTimer = setTimeout(() => {
      handleCategorySearch(value);
    }, 500);
    setDebounceTimer(newTimer);
  };

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    setTimeout(() => setFocused(false), 300);
  };

  const handleCategorySelect = (category) => {
    setCategoryQuery(category.category_name);
    setCategoryName(category.category_name);
    setSelectedCategory(category.category_id);
    setCategoryValid(true);
    setFocused(false);
  };

  return (
    <div
      className={`relative flex flex-col border rounded-lg h-fit z-0 ${
        focused ? "ring-mainButtonColor ring-1" : "border-gray-300"
      }`}
      id="product_category"
    >
      <input
        type="text"
        placeholder="Type Category Name"
        onChange={(e) => handleInputChange(e)}
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
                    handleCategorySelect(category);
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
