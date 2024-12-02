import { db } from "@utils/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { NextResponse } from "next/server";
import { createInventoryList } from "@utils/inventoryFile";

export async function GET(request) {
  const url = new URL(request.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  try {
    if (!startDate && !endDate) {
      return NextResponse.json(
        { message: "Both startDate and endDate are required" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { message: "Invalid date format" },
        { status: 400 }
      );
    }

    const inventoryRef = collection(db, "Inventory");
    const q = query(
      inventoryRef,
      where("inventory_timestamp", ">=", start),
      where("inventory_timestamp", "<=", end),
      orderBy("inventory_timestamp", "desc")
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return NextResponse.json({ message: "No data found" }, { status: 404 });
    }

    const inventories = snapshot.docs.map((doc) => doc.data());

    await createInventoryList(inventories, start, end);

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
