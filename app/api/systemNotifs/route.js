import {
  db,
  createLog,
  getLoggedInUser,
  expiredInventoriesToday,
  twoWeeksBeforeExpiration,
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

export async function POST(request) {
  try {
    const expiredToday = await expiredInventoriesToday();
    const expiredTwoWeeksBefore = await twoWeeksBeforeExpiration();

    if (
      (!expiredToday || expiredToday.length === 0) &&
      (!expiredTwoWeeksBefore || expiredTwoWeeksBefore.length == 0)
    ) {
      return NextResponse.json(
        { message: "No notification", data: [] },
        { status: 200 }
      );
    }

    const user = await getLoggedInUser();
    if (expiredToday.length > 0) {
      let expiredProducts = "";
      const notifRef = collection(db, "Notification");
      const notifDoc = doc(notifRef);

      const promises = expiredToday.map(async (item) => {
        const invNotifRef = collection(db, "InventoryNotification");
        const invNotifDoc = doc(invNotifRef);
        expiredProducts += item.productName + ", ";
        await setDoc(invNotifDoc, {
          inventory_notification_id: invNotifDoc.id,
          inventory_id: item.inventoryId,
          notification_id: notifDoc.id,
        });
      });

      Promise.all(promises);

      await setDoc(notifDoc, {
        notification_id: notifDoc.id,
        account_id: user.account_id,
        notification_title: "Action Required: Products Expired Today!",
        notification_body: `Important: ${expiredToday.length} product(s) have reached their expiration date today. Ensure to check your inventory and manage your stock accordingly.\n Products expired: ${expiredProducts}`,
        notification_type: 2,
        notification_is_read: false,
        notification_timestamp: Timestamp.now(),
        notification_soft_deleted: false,
      });
    }

    if (expiredTwoWeeksBefore.length > 0) {
      let expiredProducts;
    }

    return NextResponse.json(
      { message: "Notifications for product expiration created" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create notification document", error: error },
      { status: 500 }
    );
  }
}
