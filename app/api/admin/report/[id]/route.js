import { db, getLoggedInUser, createLog } from "@utils/firebase";
import { Timestamp, updateDoc, doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import getImageURL from "@utils/imageURL";

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    const categoryDoc = doc(db, "Category", id);
    await updateDoc(categoryDoc, {
      category_soft_deleted: true,
      category_last_updated: Timestamp.now(),
    });

    const user = await getLoggedInUser();
    const logData = await createLog(
      user.account_id,
      "Category",
      id,
      `Soft-deleted category with ID ${id}`
    );

    return NextResponse.json(
      {
        message: `Category with ID ${id} soft-deleted successfully.`,
        data: logData,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
