"use client";
import React from "react";

const AuditForm = () => {
  const [inventories, setInventories] = React.useState([]);
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    const getInventories = async () => {
      try {
        const response = await fetch("/api/admin/inventory");
        const data = await response.json();
        setInventories(data.data);
      } catch (err) {
        console.error("Failed to fetch inventories: ", err);
        setInventories([]);
      }
    };

    const getProducts = async () => {
      try {
        const response = await fetch("/api/admin/products");
        const data = await response.json();
        setProducts(data.data);
      } catch (err) {
        console.error("Failed to fetch products: ", err);
        setProducts([]);
      }
    };

    getProducts();
    getInventories();
  }, []);

  React.useEffect(() => {
    if (inventories.length > 0 && products.length > 0) {
      const populateInventoryProducts = () => {
        const oldestInventoriesMap = {};
        inventories.forEach((inventory) => {
          const { inventory_product, created_at } = inventory;

          if (
            inventory_product &&
            (!oldestInventoriesMap[inventory_product] ||
              new Date(created_at) <
                new Date(oldestInventoriesMap[inventory_product].created_at))
          ) {
            oldestInventoriesMap[inventory_product] = inventory;
          }
        });

        const oldestInventoriesArray = Object.values(oldestInventoriesMap).map(
          (inventory) => {
            const product = products.find(
              (product) => product.id === inventory.inventory_product
            );
            return {
              ...inventory,
              inventory_product: product, // Replace product ID with the product object
            };
          }
        );

        setInventories(oldestInventoriesArray);
      };

      populateInventoryProducts();
    }
  }, [inventories.length, products.length]);
  console.log();
  return (
    <div>
      {inventories.map((inventory) => (
        <div key={inventory.inventory_id}>
          <h1>{inventory.inventory_id}</h1>
          <h1>{inventory.inventory_product?.product_id}</h1>
          <p>{inventory.product?.product_id}</p>
          <br></br>
        </div>
      ))}
    </div>
  );
};

export default AuditForm;
