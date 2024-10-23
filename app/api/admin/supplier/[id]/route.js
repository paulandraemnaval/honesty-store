import { db, createLog, getLoggedInUser } from "@utils/firebase";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

//-------------------------------------DELETE-----------------------------
export async function DELETE({ params }) {
  const { id } = params;

  try {
    const supplierRef = doc(db, "suppliers", id);
    await updateDoc(supplierRef, {
      supplier_last_updated: Timestamp.now().toDate(),
      supplier_soft_deleted: true,
    });

    const user = await getLoggedInUser();
    const logData = await createLog(
      user.account_id,
      "Supplier",
      id,
      `Soft-deleted supplier with ID: ${id}`
    );

    return NextResponse.json(
      {
        message: `Supplier with ID ${id} soft-deleted successfully.`,
        data: logData,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const { id } = params;
  const supplierDoc = doc(db, "suppliers", id);

  try {
    const reqFormData = await request.formData();
    const supplier_name = reqFormData.get("supplier_name");
    const supplier_contact_person = reqFormData.get("supplier_contact_person");
    const supplier_contact_number = reqFormData.get("supplier_contact_number");
    const supplier_email_address = reqFormData.get("supplier_email_address");
    const supplier_notes = reqFormData.get("supplier_notes");

    await updateDoc(supplierDoc, {
      supplier_name,
      supplier_contact_person,
      supplier_contact_number,
      supplier_email_address,
      supplier_notes,
      supplier_last_updated: Timestamp.now().toDate(),
    });

    const user = await getLoggedInUser();
    const logData = await createLog(
      user.account_id,
      "Supplier",
      id,
      `Updated supplier with ID ${id}`
    );

    return NextResponse.json(
      {
        message: `Updated supplier with ID ${id} successfully.`,
        data: logData,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
