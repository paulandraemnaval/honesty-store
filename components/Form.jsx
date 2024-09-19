"use client";
import React from "react";

const Form = () => {
  const postProduct = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/admin/products`, {
      method: "POST",
      body: JSON.stringify({
        productName: e.target[0].value,
      }),
    });
    const data = await res.json();
    console.log(data);
  };
  return (
    <div>
      <form onSubmit={postProduct}>
        <input type="text" placeholder="ProductName" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form;
