import React from "react";

const ProductList = ({ products }) => {
  return products.map((product) => (
    <li className=" flex-1 min-w-fit flex gap-2 border border-gray-400 p-4 rounded-lg -z-10">
      <img height={150} width={150} src={product.image} />
      <div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>${product.price}</p>
      </div>
    </li>
  ));
};

export default ProductList;
