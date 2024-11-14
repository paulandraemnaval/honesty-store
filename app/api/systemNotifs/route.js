import {
  db,
  createLog,
  getLoggedInUser,
  checkExpiredInventories,
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

export async function POST() {
  try {
    const expired = await checkExpiredInventories();

    if (!expired) {
      return NextResponse.json(
        { message: "No notification", expired: [] },
        { status: 200 }
      );
    }
    const user = await getLoggedInUser();
    const notification_body = `${expired.length} expired products...`;

    const notifRef = collection(db, "Notification");
    const notifDoc = doc(notifRef);

    await setDoc(notifDoc, {
      notification_id: notifDoc.id,
      account_id: user.account_id,
      notification_title: "PRODUCT INVENTORY EXPIRED!!",
      notification_body,
      notification_type: 2,
      notification_timestamp: Timestamp.now(),
      notification_soft_deleted: false,
    });

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
