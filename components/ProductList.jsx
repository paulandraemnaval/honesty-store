"use client";

import React from "react";
import Image from "next/image";
import ProductForm from "./ProductForm";
import { usePathname } from "next/navigation";

const ProductList = ({}) => {
  const [inventories, setInventories] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showEdit, setShowEdit] = React.useState(false);
  const [productData, setProductData] = React.useState({});
  const [lastVisible, setLastVisible] = React.useState("");

  const pathName = usePathname();

  React.useEffect(() => {
    const getInventories = async () => {
      try {
        const response = await fetch("/api/admin/inventory");
        const data = await response.json();
        if (response.status === 200) {
          setInventories(
            data.data.map((inventory) => ({
              inventory_product: inventory.inventory_product,
              inventory_product_price: inventory.retail_price,
              total_units: inventory.total_units,
              createdAt: inventory.createdAt,
            }))
          );
        } else {
          setInventories([]);
        }
      } catch (error) {
        console.error("Failed to fetch inventories: ", error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };
    getInventories();
  }, []);

  React.useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch("/api/admin/products", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lastVisible: lastVisible || null,
          }),
        });
        const data = await response.json();
        if (response.status === 200) {
          setProducts(data?.products);
        }
      } catch (err) {
        console.log("Failed to fetch products: ", err);
        setProducts([]);
      }
    };
    getProducts();
  }, []);

  console.log("Products", products);
  console.log("Inventories", inventories);
  return <div>Products</div>;
};

export default ProductList;
