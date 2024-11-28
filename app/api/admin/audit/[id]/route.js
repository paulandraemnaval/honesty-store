import { db, getLoggedInUser, createLog } from "@utils/firebase";
import { Timestamp, updateDoc, doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    const auditDoc = doc(db, "Audit", id);
    await updateDoc(auditDoc, {
      report_soft_deleted: true,
      report_last_updated: Timestamp.now(),
    });

    const user = await getLoggedInUser();
    const logData = await createLog(
      user.account_id,
      "Audit",
      id,
      `SOFT-DELETE`
    );

    const cycleRef = collection(db, "CycleCount");
    const q = query(cycleRef, where("audit_id", "==", id));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return NextResponse.json(
        { message: "No cycle count found for this audit" },
        { status: 400 }
      );
    }
    const cycleCounts = querySnapshot.docs.map((doc) => doc.data());

    const promises = cycleCounts.map(async (cycleCount) => {
      const inventoryDoc = doc(db, "Inventory", cycleCount.inventory_id);
      const inventorySnap = await getDoc(inventoryDoc);
      if (!inventorySnap.exists()) {
        return NextResponse.json(
          { message: "No inventory linked in this cycle count" },
          { status: 400 }
        );
      }
      const inventory = inventorySnap.data();
      const totalUnits = Math.round(
        inventory.inventory_total_units +
          cycleCount.cycle_count_income / inventory_retail_price
      );

      await updateDoc(inventoryDoc, {
        inventory_total_units: totalUnits,
        inventory_last_updated: Timestamp.now(),
      });
    });

    await Promise.all(promises);

    return NextResponse.json(
      {
        message: `Audit with ID ${id} soft-deleted successfully.`,
        data: logData,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
