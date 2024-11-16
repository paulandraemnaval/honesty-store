"use client";
import React from "react";
import image_placeholder from "@public/defaultImages/placeholder_image.png";
import Image from "next/image";
const CategoryForm = () => {
  const [image, setImage] = React.useState({
    file: null,
    url: "",
  });

  const handleImageSelect = (e) => {
    if (e.target.files.length === 0) return;
    setImage({
      file: e.target.files[0],
      url: URL.createObjectURL(e.target.files[0]),
    });
  };

  const postCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("file", image.file);
    try {
      const response = await fetch("/api/admin/category", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      action=""
      onSubmit={(e) => postCategory(e)}
      className="flex flex-col px-1 py-2 gap-2"
    >
      <Image
        src={image.url || image_placeholder}
        alt="categoryImage"
        className="object-scale-down max-h-[100px] max-w-[100px] rounded-lg "
        height={100}
        width={100}
      />
      <label className="">Category Image</label>
      <div className="flex ">
        <label
          htmlFor="file"
          className="bg-mainButtonColor text-white p-2.5 rounded-tl-lg rounded-bl-lg h-full w-fit cursor-pointer"
        >
          Upload Image
        </label>
        <p className="border border-l-0  rounded-tr-lg rounded-br-lg items-center p-2 flex-1 truncate bg-white">
          {image.file?.name || "No image selected"}
        </p>
      </div>
      <input
        type="file"
        id="file"
        name="file"
        onChange={handleImageSelect}
        hidden
      />
      <label htmlFor="category_name" className="">
        Category Name
      </label>
      <input
        type="text"
        id="category_name"
        name="category_name"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 "
        required
      />
      <label htmlFor="category_description" className="">
        Category Description
      </label>
      <textarea
        id="category_description"
        name="category_description"
        className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1"
        required
      />
      <button
        type="submit"
        className="bg-customerRibbonGreen text-white bg-mainButtonColor rounded-lg p-2 w-fit self-end"
      >
        Create Category
      </button>
    </form>
  );
};

export default CategoryForm;
