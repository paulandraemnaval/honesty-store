"use client";
import React from "react";
import Image from "next/image";
const ProductForm = () => {
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/admin/category", {
        method: "GET",
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        console.error(data.error);
        return;
      }
      setCategories(data.data);
    };
    fetchCategories();
  }, []);

  const [image, setImage] = React.useState({
    file: null,
    url: "",
  });
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
    const data = await res.json();
    console.log(data);
  };
  return (
    <div className="flex gap-2 border w-full shadow-lg bg-white p-2 rounded-lg">
      <form
        onSubmit={postProduct}
        className="flex h-full flex-col rounded-lg gap-2 w-full"
      >
        <div className="flex gap-2 items-center">
          <Image
            src={image.url || "https://picsum.photos/200"}
            width={200}
            height={200}
            className="object-cover rounded-lg h-24 w-24 self-start"
            alt="product image"
          />
          <div className="flex flex-col gap-2 w-full">
            <input
              type="text"
              name="product_name"
              placeholder="Product_name"
              className="border border-gray-300 h-fit p-2 rounded-lg"
            />
            <select className="border rounded-lg p-2" name="product_category">
              {categories.map((category) => (
                <option
                  className="p-2 gap-2"
                  key={category.categoryId}
                  value={category.categoryId}
                >
                  {category.categoryName}
                </option>
              ))}
            </select>
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
                className="bg-green-300 p-2.5 rounded-tl-lg rounded-bl-lg h-full w-fit cursor-pointer"
              >
                Upload Image
              </label>
              <p className="border border-l-0 border-gray-400 rounded-tr-lg rounded-br-lg items-center p-2 flex-1 truncate">
                {image.file ? image.file.name : "No file selected"}
              </p>
            </div>
            <textarea
              type="text"
              placeholder="product description"
              className="rounded-lg p-2 border"
              name="product_description"
            />
            <label htmlFor="product_sku">Product SKU</label>
            <input
              type="text"
              placeholder="product SKU"
              className="rounded-lg p-2 border"
              name="product_sku"
              id="product_sku"
            />
            <label htmlFor="product_uom">Product UOM</label>
            <input
              type="text"
              placeholder="product UOM"
              className="rounded-lg p-2 border"
              name="product_uom"
              id="product_uom"
            />
            <label htmlFor="product_reorder_point">Product Reorder Point</label>
            <input
              type="number"
              placeholder="product reorder point"
              className="rounded-lg p-2 border"
              name="product_reorder_point"
              id="product_reorder_point"
            />
            <label htmlFor="product_weight">Product Weight</label>
            <input
              type="number"
              placeholder="product weight"
              className="rounded-lg p-2 border"
              name="product_weight"
              id="product_weight"
            />
            <label htmlFor="product_dimension">Product Dimensions</label>
            <input
              type="text"
              placeholder="product dimensions"
              className="rounded-lg p-2 border"
              name="product_dimension"
              id="product_dimension"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-green-300 rounded-lg p-2 h-fit self-end w-fit mt-auto"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
