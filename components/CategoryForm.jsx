"use client";
import { useEffect, useState } from "react";
import image_placeholder from "@public/defaultImages/placeholder_image.png";
import Image from "next/image";
import closeIcon from "@public/icons/close_icon.png";
import { toast } from "react-hot-toast";
import ButtonLoading from "./ButtonLoading";
import Loading from "./Loading";
const CategoryForm = ({ setShowCategoryForm = () => {}, categoryID = "" }) => {
  const [image, setImage] = useState({
    file: null,
    url: "",
  });
  const [validationMessages, setValidationMessages] = useState({
    category_name: "\u00A0",
    category_image: "\u00A0",
  });
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (!categoryID) return;
    const getCategory = async () => {
      try {
        setDataLoading(true);
        const response = await fetch(`/api/admin/category/${categoryID}`);
        const data = await response.json();
        setCategory(data ? data?.data : null);
      } catch (err) {
        console.error("Failed to fetch category:", err);
        setCategory(null);
      } finally {
        setDataLoading(false);
      }
    };
    getCategory();
  }, [categoryID]);

  const validateForm = (formData) => {
    const messages = {
      category_name: formData.get("category_name").trim()
        ? "\u00A0"
        : "Category name is required",

      category_image:
        image.file || category?.category_image_url
          ? "\u00A0"
          : "Category image is required",
    };

    setValidationMessages(messages);

    Object.keys(messages).forEach((key) => {
      const input = document.getElementById(key);
      if (messages[key] !== "\u00A0") {
        input.classList.add("border", "border-red-500");
        input.classList.remove("border-gray-300");
      } else {
        input.classList.add("border-gray-300");
        input.classList.remove("border-red-500");
      }
    });

    return Object.values(messages).every((message) => message === "\u00A0");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    if (!validateForm(formData)) {
      toast.error("Please check the inputs and try again.", {
        duration: 3000,
        style: {
          fontSize: "1.2rem",
          padding: "16px",
        },
      });
      return;
    }

    if (categoryID) {
      patchCategory(e);
    } else {
      postCategory(e);
    }
  };

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
      setLoading(true);
      const response = await fetch("/api/admin/category", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Category created successfully!", {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        });
        e.target.reset();
        setImage({ file: null, url: "" });
      } else {
        toast.error("Category creation failed. Please try again.", {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Category creation failed. Please try again.", {
        duration: 3000,
        style: {
          fontSize: "1.2rem",
          padding: "16px",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const patchCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("file", image.file);
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/category/${categoryID}`, {
        method: "PATCH",
        body: formData,
      });

      if (response.ok) {
        toast.success("Category updated successfully!", {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        });
      } else {
        toast.error("Category update failed. Please try again.", {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Category update failed. Please try again.", {
        duration: 3000,
        style: {
          fontSize: "1.2rem",
          padding: "16px",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) return <Loading />;

  return (
    <>
      <div className="w-full sm:flex hidden px-1 mb-2 py-2">
        <div className="w-full">
          <h1 className="text-xl font-bold mr-auto">Make new category</h1>
          <h2 className="text-sm text-gray-600">
            Categories for products in the store
          </h2>
        </div>
        <div
          className="w-fit h-fit cursor-pointer"
          onClick={() => setShowCategoryForm(false)}
        >
          <Image
            src={closeIcon}
            alt="close icon"
            width={30}
            height={30}
            className="self-end"
          />
        </div>
      </div>

      <form
        action=""
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col px-1 py-2"
      >
        <Image
          src={category?.category_image_url || image.url || image_placeholder}
          alt="categoryImage"
          className="object-scale-down rounded-lg border"
          height={100}
          width={100}
        />
        <label htmlFor="category_name" className="">
          Category Name<span className="text-red-500 text-sm">*</span>
        </label>
        <input
          type="text"
          id="category_name"
          name="category_name"
          defaultValue={category ? category.category_name : ""}
          className="h-fit p-2 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300"
        />
        <p className="text-red-500 text-sm mb-2">
          {validationMessages.category_name}
        </p>

        <label className="">
          Category Image
          <span className="text-red-500 text-sm">*</span>
        </label>
        <div className="flex rounded-lg border" id="category_image">
          <label
            htmlFor={`${loading ? "" : "file"}`}
            className="bg-mainButtonColor text-white p-2.5 rounded-tl-lg rounded-bl-lg h-full w-fit cursor-pointer"
          >
            Upload Image
          </label>
          <p className="border border-l-0 w-0 rounded-tr-lg rounded-br-lg items-center p-2 flex-1 truncate bg-white">
            {category?.category_image_url ||
              image.file?.name ||
              "No image selected"}
          </p>
        </div>

        <p className="text-red-500 text-sm mb-2">
          {validationMessages.category_image}
        </p>
        <input
          type="file"
          id="file"
          name="file"
          onChange={handleImageSelect}
          hidden
        />
        <label htmlFor="category_description" className="">
          Category Description
        </label>
        <textarea
          id="category_description"
          name="category_description"
          className="h-40 px-2 py-4 rounded-lg outline-none focus:ring-mainButtonColor focus:ring-1 border border-gray-300 mb-4"
          defaultValue={category ? category.category_description : ""}
        />
        <button
          type="submit"
          className={`bg-customerRibbonGreen text-white  rounded-lg p-2 w-fit self-end
        ${
          loading
            ? "cursor-not-allowed bg-mainButtonColorDisabled"
            : "cursor-pointer bg-mainButtonColor"
        }
          `}
          disabled={loading}
        >
          {loading ? (
            <ButtonLoading>Processing...</ButtonLoading>
          ) : categoryID ? (
            "Update Category"
          ) : (
            "Create Category"
          )}
        </button>
      </form>
    </>
  );
};

export default CategoryForm;
