import { db } from "@utils/firebase";
import { getDocs, collection } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  let receipts = [];
  try {
    const receiptQuery = await getDocs(collection(db, "receipts"));

    receipts = receiptQuery.docs.map((doc) => doc.data());
    if (receipts.length === 0) {
      return NextResponse.json(
        {
          message: "There are no receipts in the database",
          data: {},
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        message: "All receipts",
        data: receipts,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch receipts " + error.message,
      },
      { status: 400 }
    );
  }
}

export async function POST(request) {
  const receiptRef = collection(db, "receipts");
  const productReceiptRef = collection(db, "productReceipts");

  try {
    const reqBody = await request.json();
  } catch (error) {}
}
