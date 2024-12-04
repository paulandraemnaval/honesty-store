import { db } from "@utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";
import { report1 } from "@utils/sheets";
import { formatDate } from "@utils/formatDate";
import { getSalesData } from "@utils/export";

export async function GET(request) {
  try {
    const sales = await getSalesData(report1);
    return NextResponse.json(
      { message: "Sales successfully fetched", data: sales },
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
