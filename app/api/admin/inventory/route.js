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
  Timestamp,
  doc,
  setDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import {
  calculateProfitMargin,
  isProfitMarginAboveThreshold,
} from "@utils/calculations";

export async function GET() {
  let inventories = [];
  try {
    const reportExist = await checkCollectionExists("Report");
    const inventoryRef = collection(db, "inventories");
    let snapshot;

    if (!reportExist) {
      const q = query(
        inventoryRef,
        where("inventory_total_units", ">", 0),
        orderBy("inventory_timestamp")
      );
      snapshot = await getDocs(q);
      inventories = snapshot.docs.map((doc) => doc.data());

      if (inventories.length === 0) {
        return NextResponse.json(
          {
            message: "There are no inventories in the database",
          },
          { status: 200 }
        );
      }
    } else {
      const lastReport = await getLastReportEndDate();
      const currentDate = new Date();

      const q = query(
        inventoryRef,
        where("inventory_last_updated", ">=", lastReport),
        where("inventory_last_updated", "<=", currentDate),
        where("inventory_total_units", ">", 0),
        orderBy("inventory_timestamp")
      );
      snapshot = await getDocs(q);

      if (snapshot.empty) {
        return NextResponse.json(
          { message: "No inventories found since the last report." },
          { status: 404 }
        );
      } else {
        inventories = snapshot.docs.map((doc) => doc.data());
      }
    }

    const oldInventories = inventories.reduce((acc, inventory) => {
      const productId = inventory.product_id;
      if (
        !acc[productId] ||
        acc[productId].inventory_timestamp > inventory.inventory_timestamp
      ) {
        acc[productId] = inventory;
      }
      return acc;
    }, {});

    const result = Object.values(oldInventories);
    return NextResponse.json(
      {
        message: reportExist
          ? "Inventories found since the last report"
          : "All inventories",
        inventories: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching inventories:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventories: " + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const inventoryRef = collection(db, "inventories");
  const inventoryDoc = doc(inventoryRef);
  try {
    const reqFormData = await request.formData();

    const wholesale_price = parseFloat(reqFormData.get("wholesale_price"));
    const inventory_product = reqFormData.get("inventory_product");
    const inventory_supplier = reqFormData.get("inventory_supplier");
    const total_units = parseInt(reqFormData.get("total_units"), 10);
    const retail_price = parseFloat(reqFormData.get("retail_price"));
    const inventory_description = reqFormData.get("inventory_description");
    let inventory_profit_margin = parseFloat(
      reqFormData.get("inventory_profit_margin")
    );
    let inventory_expiration_date = reqFormData.get(
      "inventory_expiration_date"
    );

    if (isNaN(inventory_profit_margin) || inventory_profit_margin === "") {
      inventory_profit_margin = calculateProfitMargin(
        retail_price,
        wholesale_price
      );
    }

    if (!isProfitMarginAboveThreshold(retail_price, wholesale_price)) {
      return NextResponse.json(
        { message: "Profit margin is below the threshold of 10%" },
        { status: 400 }
      );
    }

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
      { status: 500 }
    );
  }
}
