import React from "react";

const ProductList = ({ products }) => {
  return products.map((product, index) => (
    <li
      className=" flex-1 min-w-fit flex gap-2 border border-gray-400 p-4 rounded-lg -z-10"
      key={index}
    >
      <img height={150} width={150} src={product.imageURL} />
      <div>
        <h3>{product.productName}</h3>
      </div>
    </li>
  ));
};

export default ProductList;
