"use client";
import React from "react";
import Image from "next/image";
const Form = () => {
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

    const productName = formData.get("productName");
    const file = formData.get("file");

    console.log("uploding product", file, productName);
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
            className="object-cover rounded-lg h-24 w-24"
            alt="product image"
          />
          <div className="flex flex-col gap-2 w-full">
            <input
              type="text"
              name="productName"
              placeholder="ProductName"
              className="border border-gray-300 h-fit p-2 rounded-lg"
            />
            <input
              id="file"
              type="file"
              className="hidden"
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

export default Form;