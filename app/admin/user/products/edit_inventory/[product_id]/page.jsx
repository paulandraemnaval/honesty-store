"use client";
import { useEffect, useState } from "react";
const page = ({ params }) => {
  const [loading, setLoading] = useState();
  const [productInventories, setProductInventories] = useState([]);
  useEffect(() => {
    const getProductInventories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/admin/inventory?productId=${params.product_id}`
        );
        const data = await response.json();
        console.log(data?.data);
        setProductInventories(Array.isArray(data?.data) ? data?.data : []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getProductInventories();
  }, []);
  console.log(params.product_id);
  return (
    <div>
      {productInventories.map((productInventory) => (
        <div key={productInventory.inventory_id}>
          <div>{productInventory.inventory_id}</div>
        </div>
      ))}
    </div>
  );
};

export default page;
