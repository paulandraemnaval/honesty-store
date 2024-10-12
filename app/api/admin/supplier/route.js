import { auth, db } from "@utils/firebase";
import {
  collection,
  getDocs,
  Timestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { createLog } from "@utils/firebase";

export async function GET() {
  let suppliers = [];
  try {
    query = await getDocs(collection(db, "Supplier"));
    suppliers = query.docs.map((supplier) => supplier.data());
    if (suppliers.length === 0) {
      return NextResponse.json(
        { message: "There are no suppliers in the database", data: {} },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "All suppliers", data: suppliers },
      { status: 200 }
    );
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { message: "Failed to fetch suppliers" + error.message },
      { status: 400 }
    );
  }
}
