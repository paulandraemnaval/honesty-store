import {
  db,
  createLog,
  getLoggedInUser,
  checkCollectionExists,
} from "@utils/firebase";
import {
  collection,
  getDoc,
  Timestamp,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { roundToTwoDecimals } from "@utils/calculations";

export async function POST(request) {
  const auditRef = collection(db, "Audit");
  const auditDoc = doc(auditRef);
  let audit_gross_income = 0;
  let audit_total_expense = 0;
  const notificationRef = collection(db, "Notification");
  const notificationDoc = doc(notificationRef);
  const restockItems = [];
  try {
    const data = await request.json();
    const cycleCountRef = collection(db, "CycleCount");

    const promises = data.map(async (item) => {
      const { inventoryId, remaining } = item;
      const remainingUnits = parseInt(remaining, 10) || 0;

      const cycleCountDoc = doc(cycleCountRef);

      const inventoryRef = doc(db, "Inventory", inventoryId);
      const inventorySnapshot = await getDoc(inventoryRef);

      if (!inventorySnapshot.exists()) {
        throw new Error(
          `Inventory document with ID ${inventoryId} does not exist`
        );
      }

      const inventoryDoc = inventorySnapshot.data();

      const income = roundToTwoDecimals(
        (inventoryDoc.inventory_total_units - remainingUnits) *
          inventoryDoc.inventory_retail_price
      );
      const expense = roundToTwoDecimals(
        (inventoryDoc.inventory_total_units - remainingUnits) *
          inventoryDoc.inventory_wholesale_price
      );

      audit_gross_income += income;
      audit_total_expense += expense;

      await setDoc(cycleCountDoc, {
        cycle_count_id: cycleCountDoc.id,
        audit_id: auditDoc.id,
        inventory_id: inventoryId,
        cycle_count_remaining: remainingUnits,
        cycle_count_income: income,
        cycle_count_wholesale_price: inventoryDoc.inventory_wholesale_price,
        cycle_count_profit:
          income -
          inventoryDoc.inventory_wholesale_price *
            (inventoryDoc.inventory_total_units - remainingUnits),
        cycle_count_timestamp: Timestamp.now(),
        cycle_count_last_updated: Timestamp.now(),
      });

      const productRef = doc(db, "Product", inventoryDoc.product_id);
      const productSnapshot = await getDoc(productRef);
      if (!productSnapshot.exists()) {
        throw new Error(`Product document does not exist`);
      }
      const productDoc = productSnapshot.data();
      if (productDoc.product_reorder_point >= remainingUnits) {
        restockItems.push(inventoryDoc);

        const invNotifRef = collection(db, "InventoryNotification");
        const invNotifDoc = doc(invNotifRef);
        await setDoc(invNotifDoc, {
          inventory_notification_id: invNotifDoc.id,
          inventory_id: inventoryId,
          notification_id: notificationDoc.id,
        });
      }

      await updateDoc(inventoryRef, {
        inventory_total_units: remainingUnits,
        inventory_last_updated: Timestamp.now(),
      });
    });

    await Promise.all(promises);

    const user = await getLoggedInUser();
    const logData = await createLog(
      user.account_id,
      "Audit",
      auditDoc.id,
      "Add new audit"
    );

    audit_gross_income = roundToTwoDecimals(audit_gross_income);
    audit_total_expense = roundToTwoDecimals(audit_total_expense);

    await setDoc(auditDoc, {
      audit_id: auditDoc.id,
      account_id: user.account_id,
      audit_gross_income,
      audit_total_expense,
      audit_timestamp: Timestamp.now(),
      audit_last_updated: Timestamp.now(),
      audit_soft_deleted: false,
    });

    if (restockItems.length > 0) {
      await setDoc(notificationDoc, {
        notification_id: notificationDoc.id,
        account_id: user.account_id,
        notification_title: "Restock Alert: Inventory Reorder Point Reached",
        notification_body: `${restockItems.length} products have fallen below the reorder point. Please restock as soon as possible.`,
        notification_type: 0,
        notification_is_read: false,
        notification_timestamp: Timestamp.now(),
        notification_soft_deleted: false,
      });
    }

    return NextResponse.json(
      { message: "Audit successfully created.", logData },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating audit." + error.message },
      { status: 500 }
    );
  }
}
