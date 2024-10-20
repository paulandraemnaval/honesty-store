import { db } from "@utils/firebase";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  let inventories = [];
  try {
    const categoryQuery = await getDocs(collection(db, "inventories"));

    inventories = categoryQuery.docs.map((doc) => doc.data());
    if (inventories.length === 0) {
      return NextResponse.json(
        {
          message: "There are no inventories in the database",
          data: {},
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        message: "All inventories",
        data: inventories,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories: " + error.message },
      { status: 400 }
    );
  }
}

export async function POST(request) {
  const inventoryRef = collection(db, "inventories");
  const inventoryDoc = doc(inventoryRef);
  try {
    const reqFormData = await request.formData();

    const wholesale_price = reqFormData.get("wholesale_price");
    const inventory_product = reqFormData.get("inventory_product");
    const inventory_supplier = reqFormData.get("inventory_supplier");
    const total_units = reqFormData.get("total_units");
    const retail_price = reqFormData.get("retail_price");
    const inventory_description = reqFormData.get("inventory_description");
    const inventory_profit_margin = reqFormData.get("inventory_profit_margin");
    const inventory_expiration_date = reqFormData.get(
      "inventory_expiration_date"
    );

    await setDoc(inventoryDoc, {
      inventory_id: inventoryDoc.id,
      wholesale_price,
      inventory_product,
      inventory_supplier,
      total_units,
      retail_price,
      inventory_description,
      inventory_profit_margin,
      inventory_expiration_date,
      created_at: Timestamp.now().toDate(),
      updated_at: Timestamp.now().toDate(),
    });

    return NextResponse.json(
      {
        message: "inventory created successfully",
        data: {
          inventoryID: inventoryDoc.id,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error.message);

    return NextResponse.json(
      { error: "Failed to create inventory" },
      { status: 400 }
    );
  }
}
