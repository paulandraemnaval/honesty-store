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
  let products = [];
  try {
    const productsQuery = await getDocs(collection(db, "products"));
    products = productsQuery.docs.map((doc) => doc.data());
    return NextResponse.json(
      {
        message: "All products",
        data: products,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products " + error.message },
      { status: 400 }
    );
  }
}

export async function POST(request) {
  const productRef = collection(db, "products");
  const productDoc = doc(productRef);
  try {
    const reqBody = await request.json();
    const { productName, file } = reqBody;

    await setDoc(productDoc, {
      productName,
      productId: productDoc.id,
      imageURL: "",
      createdAt: Timestamp.now().toDate(),
      updatedAt: Timestamp.now().toDate(),
    });

    if (!file || file === "") {
      return NextResponse.json(
        {
          message: "Product created successfully",
          data: { productId: productDoc.id },
        },
        { status: 200 }
      );
    }

    const imageURL = await getImageURL(file, productDoc.id);
    if (!imageURL) {
      console.error("Failed to generate image URL:", error);
      return NextResponse.json(
        { error: "Failed to generate image URL" },
        { status: 400 }
      );
    }

    await updateDoc(doc(db, "products", product.id), {
      imageURL,
    });
    return NextResponse.json(
      {
        message: "Product created successfully",
        data: {
          productId: productDoc.id,
          imageURL,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error.message);

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 400 }
    );
  }
}
