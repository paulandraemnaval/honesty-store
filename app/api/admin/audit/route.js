import {
  db,
  createLog,
  getLoggedInUser,
  checkCollectionExists,
} from "@utils/firebase";
import {
  collection,
  getDocs,
  Timestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(request) {
  const auditRef = collection(db, "Audit");
  const auditDoc = doc(auditRef);
  let audit_gross_income = 0;
  let audit_total_expense = 0;
  try {
    const data = await request.body;
    const cycleCountRef = collection(db, "CycleCount");

    data.map(async (item) => {
      const { inventoryId, remaining } = item;
      const cycleCountDoc = doc(cycleCountRef);

      const inventoryDoc = doc(db, "inventories", inventoryId);

      const income =
        (inventoryDoc.inventory_total_units - remaining) *
        inventoryDoc.inventory_retail_price;
      const expense =
        inventoryDoc.inventory_total_units *
        inventoryDoc.inventory_wholesale_price;

      audit_gross_income += income;
      audit_total_expense += expense;

      await setDoc(cycleCountDoc, {
        cycle_count_id: cycleCountDoc.id,
        audit_id: auditDoc.id,
        inventory_id: inventoryId,
        cycle_count_remaining: remaining,
        cycle_count_income: income,
        cycle_count_wholesale_price: inventoryDoc.inventory_wholesale_price,
        cycle_count_profit: cycle_count_income - cycle_count_wholesale_price,
        cycle_count_timestamp: Timestamp.now(),
        cycle_count_last_updated: Timestamp.now(),
      });
    });
  } catch (error) {}

  return NextResponse.json({ message: "check" }, { status: 200 });
}
