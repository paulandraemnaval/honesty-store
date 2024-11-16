"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import image_placeholder from "@public/defaultImages/placeholder_image.png";

const ProductForm = ({ productData = {}, setShowEdit, method }) => {
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState({
    file: null,
    url: productData.product_image_url || "",
  });

  const [formValues, setFormValues] = useState({
    product_name: productData.product_name || "",
    product_category: productData.product_category?.category_id || "",
    product_description: productData.product_description || "",
    product_sku: productData.product_sku || "",
    product_uom: productData.product_uom || "",
    product_reorder_point: productData.product_reorder_point || "",
    product_weight: productData.product_weight || "",
    product_dimensions: productData.product_dimensions || "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/category");

        const data = await response.json();
        if (response.ok) {
          setCategories(Array.isArray(data?.categories) ? data.categories : []);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

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
      onSubmit={
        method === "patch"
          ? (e) => patchProduct(e)
          : method === "post"
          ? (e) => postProduct(e)
          : null
      }
      className="flex flex-col w-full gap-2 h-fit py-2 px-1"
    >
      <div className="flex flex-col gap-2 w-full">
        <Image
          src={image.url || image_placeholder}
          width={100}
          height={100}
          className="object-scale-down max-h-[100px] max-w-[100px] rounded-lg"
        />
        <label htmlFor="product_name">Product Name</label>
        <input
          type="text"
          name="product_name"
          value={formValues.product_name}
          onChange={handleInputChange}
          placeholder="Product name"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
          required
        />
        <label htmlFor="product_category">Product Category</label>
        <select
          className="border rounded-lg p-2"
          name="product_category"
          value={formValues.product_category}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>
            Select category
          </option>

          {categories.length === 0 ? (
            <option>no categories available</option>
          ) : (
            categories.map((category) => (
              <option
                className="p-2 gap-2"
                key={category.category_id}
                value={category.category_id}
              >
                {category.category_name}
              </option>
            ))
          )}
        </select>
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
          value={formValues.product_description}
          onChange={handleInputChange}
          placeholder="Product description"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
          required
        />
        <label htmlFor="product_sku">Product SKU</label>
        <input
          type="text"
          name="product_sku"
          value={formValues.product_sku}
          onChange={handleInputChange}
          placeholder="Product SKU"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
          id="product_sku"
          required
        />
        <label htmlFor="product_uom">Product UOM</label>
        <input
          type="text"
          name="product_uom"
          value={formValues.product_uom}
          onChange={handleInputChange}
          placeholder="Product UOM"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
          id="product_uom"
          required
        />
        <label htmlFor="product_reorder_point">Product Reorder Point</label>
        <input
          type="number"
          name="product_reorder_point"
          value={formValues.product_reorder_point}
          onChange={handleInputChange}
          placeholder="Product Reorder Point"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
          id="product_reorder_point"
          required
        />
        <label htmlFor="product_weight">Product Weight</label>
        <input
          type="number"
          name="product_weight"
          value={formValues.product_weight}
          onChange={handleInputChange}
          placeholder="Product Weight"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
          id="product_weight"
          required
        />
        <label htmlFor="product_dimension">Product Dimensions</label>
        <input
          type="text"
          name="product_dimensions"
          value={formValues.product_dimensions}
          onChange={handleInputChange}
          placeholder="Product Dimensions"
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1  "
          id="product_dimensions"
          required
        />
      </div>

      <div className="gap-2 w-full items-start flex flex-row-reverse">
        {method === "patch" && (
          <button
            className="bg-red-600 text-white rounded-lg p-2"
            onClick={() => setShowEdit((prev) => !prev)}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="bg-mainButtonColor text-white rounded-lg p-2 w-fit"
        >
          {method === "patch" ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
