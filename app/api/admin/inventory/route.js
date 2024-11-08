import {
  db,
  createLog,
  getLoggedInUser,
  checkCollectionExists,
  getLastReportEndDate,
} from "@utils/firebase";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  updateDoc,
  doc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { get } from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  let inventories = [];
  try {
    const reportExist = await checkCollectionExists("Report");
    const inventoryRef = collection(db, "inventories");
    let snapshot;

    if (!reportExist) {
      snapshot = await getDocs(inventoryRef);
      inventories = snapshot.docs.map((doc) => doc.data());
      if (inventories.length === 0) {
        return NextResponse.json(
          {
            message: "There are no inventories in the database",
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
    }

    const lastReport = await getLastReportEndDate();
    const currentDate = new Date();

    const q = query(
      inventoryRef,
      where("inventory_last_updated", ">=", lastReport),
      where("inventory_last_updated", "<=", currentDate)
    );
    snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json(
        { message: "No inventories found since the last report." },
        { status: 400 }
      );
    } else {
      inventories = snapshot.docs.map((doc) => doc.data());
      return NextResponse.json(
        {
          message: "Inventories found since the last report",
          inventories,
        },
        { status: 200 }
      );
    }
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
      product_id: inventory_product,
      supplier_id: inventory_supplier,
      inventory_wholesale_price: wholesale_price,
      inventory_total_units: total_units,
      inventory_retail_price: retail_price,
      inventory_description,
      inventory_profit_margin,
      inventory_expiration_date,
      inventory_timestamp: Timestamp.now().toDate(),
      inventory_last_updated: Timestamp.now().toDate(),
      inventory_soft_deleted: false,
    });

    const user = await getLoggedInUser();
    const logData = await createLog(
      user.account_id,
      "Inventory",
      inventoryDoc.id,
      "Added a new inventory"
    );

    return NextResponse.json(
      {
        message: "inventory created successfully",
        data: {
          inventoryID: inventoryDoc.id,
          logData,
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
