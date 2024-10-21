import { db } from "@utils/firebase";
import {
  collection,
  getDocs,
  Timestamp,
  doc,
  setDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

//-------------------------------------DELETE-----------------------------
export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    const supplierRef = doc(db, "suppliers", id);
    await updateDoc(supplierRef, {
      supplier_last_updated: Timestamp.now().toDate(),
      supplier_soft_deleted: true,
    });

    return NextResponse.json(
      { message: `Supplier with ID ${id} soft-deleted successfully.` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
