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
  const [loading, setLoading] = useState(false); // Add loading state
  const [categoryName, setCategoryName] = useState("");
  const [categoryValid, setCategoryValid] = useState(true);
  const handleImage = (e) => {
    if (e.target.files.length === 0) return;
    setImage({
      file: e.target.files[0],
      url: URL.createObjectURL(e.target.files[0]),
    });
  };

  // Fetch product details when productID is provided
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

  const postProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append("file", image.file);
    formData.append("product_category", selectedCategory);

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Login successful!", {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        });
        e.target.reset();
        setImage({ file: null, url: "" });
      } else {
        toast.error("Login failed. Please try again.", {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
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

    console.log("FORMDATA FILE: ", formData.get("file"));
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productID}`, {
        method: "PATCH",
        body: formData,
      });

      if (res.ok) {
        toast.success("Product Update Successful!", {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
          iconTheme: {
            primary: "#4285F4",
            secondary: "white",
          },
        });
      } else {
        toast.error("Login failed. Please try again.", {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        });
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          if (productID) {
            patchProduct(e);
          } else {
            postProduct(e);
          }
        }}
        className="flex flex-col w-full gap-2 h-fit py-2 px-1 z-0"
      >
        <div className="flex flex-col gap-2 w-full">
          <Image
            src={image.url || product?.product_image_url || placeholderImage}
            width={100}
            height={100}
            className="object-scale-down max-h-[100px] max-w-[100px] rounded-lg"
            alt="Product"
          />
          <label htmlFor="product_name">Product Name</label>
          <input
            type="text"
            name="product_name"
            placeholder="Product name"
            className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
            required
            defaultValue={product?.product_name || ""}
          />
          <label htmlFor="product_category">Product Category</label>
          <CategoryInput
            setSelectedCategory={setSelectedCategory}
            categoryName={categoryName}
            setCategoryName={setCategoryName}
            setCategoryValid={setCategoryValid}
          />
          <label htmlFor="file">Product Image</label>
          <input
            id="file"
            type="file"
            className="hidden"
            name="file"
            onChange={handleImage}
          />
          <div className="flex">
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
          <label htmlFor="product_description">Product Description</label>
          <textarea
            name="product_description"
            placeholder="Product description"
            className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
            required
            defaultValue={product?.product_description || ""}
          />
          <label htmlFor="product_sku">Product SKU</label>
          <input
            type="text"
            name="product_sku"
            placeholder="Product SKU"
            className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
            id="product_sku"
            required
            defaultValue={product?.product_sku || ""}
          />
          <label htmlFor="product_uom">Product UOM</label>
          <input
            type="text"
            name="product_uom"
            placeholder="Product UOM"
            className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
            id="product_uom"
            required
            defaultValue={product?.product_uom || ""}
          />
          <label htmlFor="product_reorder_point">Product Reorder Point</label>
          <input
            type="number"
            name="product_reorder_point"
            placeholder="Product Reorder Point"
            className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
            id="product_reorder_point"
            required
            defaultValue={product?.product_reorder_point || ""}
          />
          <label htmlFor="product_weight">Product Weight</label>
          <input
            type="number"
            name="product_weight"
            placeholder="Product Weight"
            className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
            id="product_weight"
            required
            defaultValue={product?.product_weight || ""}
          />
          <label htmlFor="product_dimension">Product Dimensions</label>
          <input
            type="text"
            name="product_dimensions"
            placeholder="Product Dimensions"
            className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
            id="product_dimensions"
            required
            defaultValue={product?.product_dimension || ""}
          />
        </div>

        <div className="gap-2 w-full items-start flex flex-row-reverse">
          <button
            type="submit"
            className={`w-fit p-2 bg-mainButtonColor text-white rounded-md flex items-center justify-center ${
              loading || !categoryValid
                ? "opacity-70 cursor-not-allowed"
                : "hover:opacity-90"
            }`}
            disabled={loading || !categoryValid}
          >
            {loading ? (
              <>
                <span className="spinner-border animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Processing...
              </>
            ) : productID ? (
              "Update Product"
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </form>
    </>
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
    setCategoryQuery(category.category_name); // Update input value
    setCategoryName(category.category_name); // Update the display value
    setSelectedCategory(category.category_id); // Set the selected category ID
    setCategoryValid(true); // Mark the category as valid
    setFocused(false); // Close the dropdown
  };

  return (
    <div
      className={`relative flex flex-col border rounded-lg h-fit z-0 ${
        focused ? "ring-mainButtonColor ring-1" : "border-gray-300"
      }`}
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
