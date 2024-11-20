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

export async function GET(request) {
  const url = new URL(request.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  try {
    if (!startDate && !endDate) {
      return NextResponse.json(
        { message: "Search term required" },
        { status: 404 }
      );
    }

    const inventoryRef = collection(db, "Inventory");
    const q = query(
      inventoryRef,
      where("inventory_timestamp", ">=", new Date(startDate)),
      where("inventory_timestamp", "<=", new Date(endDate))
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty()) {
      return NextResponse.json({ message: "No data found" }, { status: 404 });
    }

    const inventories = snapshot.docs.map((doc) => doc.data());
    return NextResponse.json(
      {
        message: "Inventories found from the given date range",
        data: inventories,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }
}
