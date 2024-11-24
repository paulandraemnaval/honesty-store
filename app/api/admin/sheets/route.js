import { NextResponse } from "next/server";
import { generateReport } from "@utils/sheets";

export async function GET() {
  try {
    await generateReport();
    return NextResponse.json(
      { message: "Report generated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
