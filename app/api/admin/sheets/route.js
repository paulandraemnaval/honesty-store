import { NextResponse } from "next/server";
import { generateReport, report1 } from "@utils/sheets";
import { createInventoryList } from "@utils/inventoryFile";
import { formatDate } from "@utils/formatDate";
import { exportSheetToPDF } from "@utils/export";
import { db } from "@utils/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET() {
  try {
    const reportDoc = doc(db, "Report", "mJnf0mQHiro65DxCG2ef");
    const reportSnap = await getDoc(reportDoc);
    if (!reportSnap.exists()) {
      return NextResponse.json(
        { message: "No report found with the given id" },
        { status: 404 }
      );
    }
    const report = reportSnap.data();

    let sheetTitle = `${formatDate(
      report.report_start_date.toDate()
    )} - ${formatDate(report.report_end_date.toDate())}`;

    sheetTitle = sheetTitle.replace(/\\/g, "/");

    await exportSheetToPDF(report1, sheetTitle);

    return NextResponse.json(
      { message: "Report downloaded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
