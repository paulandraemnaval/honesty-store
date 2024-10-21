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
import getImageURL from "@utils/imageURL";

export async function GET() {
  let categories = [];
  try {
    const categoryQuery = await getDocs(collection(db, "category"));

    categories = categoryQuery.docs.map((doc) => doc.data());
    if (categories.length === 0) {
      return NextResponse.json(
        {
          message: "There are no categories in the database",
          data: {},
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        message: "All categories",
        data: categories,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories: " + error.message },
      { status: 400 }
    );
  }
}

export async function POST(request) {
  const categoryRef = collection(db, "category");
  const categoryDoc = doc(categoryRef);
  try {
    const reqFormData = await request.formData();
    const category_name = reqFormData.get("category_name");
    const file = reqFormData.get("file");
    const category_description = reqFormData.get("category_description");

    const imageURL = await getImageURL(file, categoryDoc.id, "category");
    if (!imageURL) {
      console.error("Failed to generate image URL:", error);
      return NextResponse.json(
        { error: "Failed to generate image URL" },
        { status: 400 }
      );
    }

    await setDoc(categoryDoc, {
      category_name,
      category_id: categoryDoc.id,
      category_image_url: imageURL,
      category_description,
      created_at: Timestamp.now().toDate(),
      updated_at: Timestamp.now().toDate(),
    });

    if (!file || file === "") {
      return NextResponse.json(
        {
          message: "category created successfully",
          data: { categoryId: categoryDoc.id },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: "category created successfully",
        data: {
          categoryID: categoryDoc.id,
          imageURL,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error.message);

    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 400 }
    );
  }
}
