import { NextResponse } from "next/server";
import { generateReport } from "@utils/sheets";
import { createInventoryList } from "@utils/inventoryFile";

export async function GET() {
  try {
    let startDate = new Date("2024-11-30").toISOString();
    let endDate = new Date().toISOString();

    console.log("start:", startDate);
    console.log("end:", endDate);

    return NextResponse.json(
      { message: "Report generated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
