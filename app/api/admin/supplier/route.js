<<<<<<< HEAD
import { auth, db } from "@utils/firebase";
import {
  collection,
  getDocs,
  Timestamp,
=======
import { db } from "@utils/firebase";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  updateDoc,
>>>>>>> 11dbad404deb68d953e71643cce58e48667c81cc
  doc,
  setDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";
<<<<<<< HEAD
import { createLog } from "@utils/firebase";
=======
>>>>>>> 11dbad404deb68d953e71643cce58e48667c81cc

export async function GET() {
  let suppliers = [];
  try {
<<<<<<< HEAD
    query = await getDocs(collection(db, "Supplier"));
    suppliers = query.docs.map((supplier) => supplier.data());
    if (suppliers.length === 0) {
      return NextResponse.json(
        { message: "There are no suppliers in the database", data: {} },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "All suppliers", data: suppliers },
      { status: 200 }
    );
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { message: "Failed to fetch suppliers" + error.message },
=======
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
    const supplier_name = reqFormData.get("supplier_name");
    const supplier_contact_person = reqFormData.get("supplier_contact_person");
    const supplier_contact_number = reqFormData.get("supplier_contact_number");
    const supplier_email_address = reqFormData.get("supplier_email_address");
    const supplier_notes = reqFormData.get("supplier_notes");

    await setDoc(supplierDoc, {
      supplier_id: supplierDoc.id,
      supplier_name,
      supplier_contact_person,
      supplier_contact_number,
      supplier_email_address,
      supplier_notes,
      created_at: Timestamp.now().toDate(),
      updated_at: Timestamp.now().toDate(),
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
>>>>>>> 11dbad404deb68d953e71643cce58e48667c81cc
      { status: 400 }
    );
  }
}
