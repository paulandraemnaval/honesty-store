import { db } from "@utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const accountRef = doc(db, "Account", id);
    const accountDoc = await getDoc(accountRef);
    if (!accountDoc.exists()) {
      return NextResponse.json(
        { message: "Account not found" },
        { status: 404 }
      );
    }
    const account = accountDoc.data();
    return NextResponse.json(
      { message: "Account found", data: account },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json(
      { message: "Error fetching account", error: error.message },
      { status: 500 }
    );
  }
}
