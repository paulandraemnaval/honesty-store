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

export async function PATCH(request) {
  const { lastVisible } = await request.json();
  try {
    const notifRef = collection(db, "Notification");
    let notifQuery;
    if (lastVisible) {
      const lastDocSnapshot = await getDoc(
        doc(db, "Notification", lastVisible)
      );
      if (!lastDocSnapshot.exists()) {
        return NextResponse.json(
          { message: "Invalid lastVisible document ID." },
          { status: 400 }
        );
      }
      notifQuery = query(notifRef, startAfter(lastDocSnapshot), limit(5));
    } else {
      notifQuery = query(notifRef, limit(5));
    }
    const snapshot = await getDocs(notifQuery);
    const notifications = snapshot.docs.map((doc) => doc.data());
    return NextResponse.json(
      { message: "Successfully fetched products", data: notifications },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch products: " + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { notification_title, notification_body } = await request.json();

    const notifRef = collection(db, "Notification");
    const notifDoc = await getDoc(notifRef);

    const user = await getLoggedInUser();

    await setDoc(notifDoc, {
      notification_id: notifDoc.id,
      account_id: user.account_id,
      notification_title,
      notification_body,
      notification_type: 1,
      notification_is_read: false,
      notification_timestamp: Timestamp.now(),
      notification_soft_deleted: false,
    });

    return NextResponse.json(
      { message: "Notification successfully created." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create notification", error: error },
      { status: 500 }
    );
  }
}
