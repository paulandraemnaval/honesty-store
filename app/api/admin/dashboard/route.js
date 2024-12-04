import { db } from "@utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";
import { report1 } from "@utils/sheets";
import { formatDate } from "@utils/formatDate";
import { getProfitData } from "@utils/export";

export async function GET(request) {
  try {
    const productRef = collection(db, "Product");
    let q = query(productRef, where("product_soft_deleted", "==", false));

    const profit = await getProfitData(report1);
    return NextResponse.json(
      { message: "Sales successfully fetched", data: { profit } },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error fetching sales data" },
      { status: 500 }
    );
  }
}
