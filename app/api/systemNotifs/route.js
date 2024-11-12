import {
  db,
  createLog,
  getLoggedInUser,
  checkCollectionExists,
  getLastReportEndDate,
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

export async function POST(request) {
  // const expired = await checkExpiredInventories();

  // if(!expired){
  //     return NextResponse.json({message: "No notif"})
  // }
  try {
    const notifRef = collection(db, "Sample");
    const notifDoc = doc(notifRef);
    await setDoc(notifDoc, {
      sample_id: notifDoc.id,
      sample_change: false,
    });

    return NextResponse.json({ message: "Successful" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
