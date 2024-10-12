import { db } from "@utils/firebase";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  let suppliers = [];
  try {
    const suppliersQuery = await getDocs(collection(db, "suppliers"));

    suppliers = suppliersQuery.docs.map((doc) => doc.data());
    if (suppliers.length === 0) {
      return NextResponse.json(
        {
          message: "There are no suppliers in the database",
          data: {},
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        message: "All suppliers",
        data: suppliers,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch suppliers " + error.message },
      { status: 400 }
    );
  }
}

export async function POST(request) {
  const supplierRef = collection(db, "suppliers");
  const supplierDoc = doc(supplierRef);
  try {
    const reqFormData = await request.formData();
    const supplierName = reqFormData.get("supplierName");
    const supplierContactPerson = reqFormData.get("supplierContactPerson");
    const supplierContactNumber = reqFormData.get("supplierContactNumber");
    const supplierEmailAddress = reqFormData.get("supplierEmailAddress");
    const supplierNotes = reqFormData.get("supplierNotes");

    await setDoc(supplierDoc, {
      supplierId: supplierDoc.id,
      supplierName,
      supplierContactPerson,
      supplierContactNumber,
      supplierEmailAddress,
      supplierNotes,
      createdAt: Timestamp.now().toDate(),
      updatedAt: Timestamp.now().toDate(),
    });

    return NextResponse.json(
      {
        message: "Supplier created successfully",
        data: {
          supplierId: supplierDoc.id,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error.message);

    return NextResponse.json(
      { error: "Failed to create Supplier" },
      { status: 400 }
    );
  }
}
