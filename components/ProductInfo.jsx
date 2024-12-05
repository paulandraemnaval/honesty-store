"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Loading from "./Loading";
const ProductInfo = ({ productID = "", productPrice = "" }) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const getProductData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/products/${productID}`);
        const data = await response.json();
        setProduct(data?.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getProductData();
  }, [productID]);

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return <p className="text-center text-gray-500">Product not found.</p>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 bg-white rounded-lg  h-full">
      {/* Product Image */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-full max-w-sm relative flex justify-center items-center">
          <Image
            src={product.product_image_url}
            alt={product.product_name}
            width={300}
            height={300}
            objectFit="cover"
            className="rounded-lg "
          />
        </div>
        <h1 className="text-2xl font-bold mt-4 text-gray-800">
          {product.product_name}
        </h1>
      </div>

      <div className="w-full text-xl text-gray-700">
        <span className="font-semibold text-gray-700">
          Price: {productPrice}
        </span>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg  text-gray-700 mb-2">Description</h2>
          <p className="text-gray-600 text-sm font-light">
            {product.product_description || "No description available."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
