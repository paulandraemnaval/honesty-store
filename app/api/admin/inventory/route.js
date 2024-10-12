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
    const categoryQuery = await getDocs(collection(db, "inventory"));

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

    const wholeSalePrice = reqFormData.get("wholeSalePrice");
    const inventoryProduct = reqFormData.get("inventoryProduct");
    const inventorySupplier = reqFormData.get("inventorySupplier");
    const totalUnits = reqFormData.get("totalUnits");
    const retailPrice = reqFormData.get("retailPrice");
    const inventoryDescription = reqFormData.get("inventoryDescription");
    const inventoryProfitMargin = reqFormData.get("inventoryProfitMargin");
    const inventoryExpirationDate = reqFormData.get("inventoryExpirationDate");

    await setDoc(inventoryDoc, {
      inventoryId: inventoryDoc.id,
      wholeSalePrice,
      inventoryProduct,
      inventorySupplier,
      totalUnits,
      retailPrice,
      inventoryDescription,
      inventoryProfitMargin,
      inventoryExpirationDate,
      createdAt: Timestamp.now().toDate(),
      updatedAt: Timestamp.now().toDate(),
    });

    return NextResponse.json(
      {
        message: "category created successfully",
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
