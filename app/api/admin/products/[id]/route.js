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

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, {
      product_last_updated: Timestamp.now().toDate(),
      product_soft_deleted: true,
    });

    return NextResponse.json(
      { message: `Product with ID ${id} soft-deleted successfully.` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
