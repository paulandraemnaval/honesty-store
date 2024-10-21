"use client";
import React from "react";

const CreateCategory = () => {
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
      className="flex flex-col gap-2"
    >
      <label htmlFor="category_name">Category Name</label>
      <input
        type="text"
        id="category_name"
        name="category_name"
        className="border"
      />
      <label htmlFor="category_description">Category Description</label>
      <textarea
        id="category_description"
        name="category_description"
        className="border"
      />
      <label
        htmlFor="categoryImage"
        className="cursor-pointer p-2 rounded-md bg-customerRibbonGreen text-white"
      >
        Select Image for Category
      </label>
      <input
        type="file"
        id="categoryImage"
        name="file"
        onChange={handleImageSelect}
        className="hidden"
      />
      <img
        src={image.url || ""}
        alt="categoryImage"
        className="object-cover h-24 w-24 rounded-md"
      />
      <button
        type="submit"
        className="bg-customerRibbonGreen text-white p-2 rounded-md"
      >
        Add Category
      </button>
    </form>
  );
};

export default CreateCategory;
