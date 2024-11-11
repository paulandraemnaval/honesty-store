import {
  db,
  createLog,
  getLoggedInUser,
  checkCollectionExists,
  getLastReportEndDate,
} from "@utils/firebase";
import {
  collection,
  where,
  Timestamp,
  doc,
  setDoc,
  orderBy,
  limit,
  getDocs,
  query,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const reqFormData = await request.formData();
    const report_cash_inflow = parseFloat(reqFormData.get("cash_inflow")) || 0;
    const report_cash_outflow =
      parseFloat(reqFormData.get("cash_outflow")) || 0;

    const reportRef = collection(db, "Report");
    const reportDoc = doc(reportRef);
    let report_start_date;
    if (await checkCollectionExists("Report")) {
      report_start_date = await getLastReportEndDate();
    } else {
      const inventoryRef = collection(db, "inventories");
      if (!(await checkCollectionExists("inventories"))) {
        return NextResponse.json(
          { message: "No inventories created." },
          { status: 204 }
        );
      }
      const q = query(
        inventoryRef,
        orderBy("inventory_timestamp", "asc"),
        limit(1)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        report_start_date = snapshot.docs[0].data().inventory_timestamp;
      } else {
        report_start_date = null;
      }
    }

    const user = await getLoggedInUser();
    const logData = await createLog(
      user.account_id,
      "Report",
      reportDoc.id,
      "Add new report"
    );

    const auditExists = await checkCollectionExists("Audit");
    if (!auditExists) {
      return NextResponse.json(
        { message: "No audit exists in the database" },
        { status: 204 }
      );
    }

    if (report_start_date) {
      const auditRef = collection(db, "Audit");

      const auditQuery = query(
        auditRef,
        where("audit_soft_deleted", "==", false),
        where("audit_last_updated", ">=", report_start_date)
      );

      const auditSnapshot = await getDocs(auditQuery);
      if (auditSnapshot.empty) {
        return NextResponse.json(
          {
            message:
              "No audit created from the report start date until the end date",
          },
          { status: 204 }
        );
      }
      const audits = auditSnapshot.docs.map((doc) => doc.data());

      const promises = audits.map(async (item) => {
        const auditReportRef = collection(db, "AuditReport");
        const auditReportDoc = doc(auditReportRef);

        await setDoc(auditReportDoc, {
          audit_report_id: auditReportDoc.id,
          report_id: reportDoc.id,
          audit_id: item.audit_id,
          audit_report_timestamp: Timestamp.now(),
        });
      });
      await Promise.all(promises);
    }

    await setDoc(reportDoc, {
      report_id: reportDoc.id,
      account_id: user.account_id,
      report_start_date,
      report_end_date: Timestamp.now(),
      report_cash_outflow,
      report_cash_inflow,
      report_timestamp: Timestamp.now(),
      report_last_updated: Timestamp.now(),
      report_soft_deleted: false,
    });

    return NextResponse.json(
      { message: "Report successfully created", logData },
      { status: 200 }
    );
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { message: "An error occurred", error: error.message },
      { status: 500 }
    );
  }
}
