import { db, getLoggedInUser, createLog } from "@utils/firebase";
import { Timestamp, updateDoc, doc } from "firebase/firestore";
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

export async function PATCH(request, { params }) {
  const { id } = params;

  const categoryDoc = doc(db, "Category", id);

  try {
    const reqFormData = await request.formData();
    const category_name = reqFormData.get("category_name");
    const file = reqFormData.get("file");
    const category_description = reqFormData.get("category_description");

    const imageURL = await getImageURL(file, categoryDoc.id, "Category");
    if (!imageURL) {
      console.error("Failed to generate image URL:", error);
      return NextResponse.json(
        { error: "Failed to generate image URL" },
        { status: 400 }
      );
    }

    await updateDoc(categoryDoc, {
      category_name,
      category_image_url: imageURL,
      category_description,
      category_last_updated: Timestamp.now(),
    });

    const user = await getLoggedInUser();
    const logData = await createLog(
      user.account_id,
      "Category",
      id,
      `Updated category with ID ${id}`
    );

    return NextResponse.json(
      {
        message: `Updated category with ID ${id} successfully.`,
        data: logData,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
