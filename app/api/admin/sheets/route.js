import { NextResponse } from "next/server";
import { generateReport } from "@utils/sheets";

export async function GET() {
  try {
    await generateReport("mJnf0mQHiro65DxCG2ef");
    return NextResponse.json(
      { message: "Report generated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
