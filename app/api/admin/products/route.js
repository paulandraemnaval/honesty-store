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
    if (products.length === 0) {
      return NextResponse.json(
        {
          message: "There are no products in the database",
          data: {},
        },
        { status: 200 }
      );
    }
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
    const reqFormData = await request.formData();
    const productName = reqFormData.get("productName");
    const file = reqFormData.get("file");
    const productDescription = reqFormData.get("productDescription");
    const productCategory = reqFormData.get("productCategory");
    const productSKU = reqFormData.get("productSKU");
    const productUOM = reqFormData.get("productUOM");
    const productReorderPoint = reqFormData.get("productReorderPoint");
    const productWeight = reqFormData.get("productWeight");
    const productDimensions = reqFormData.get("productDimensions");

    const imageURL = await getImageURL(file, productDoc.id, "products");
    if (!imageURL) {
      console.error("Failed to generate image URL:", error);
      return NextResponse.json(
        { error: "Failed to generate image URL" },
        { status: 400 }
      );
    }

    await setDoc(productDoc, {
      productId: productDoc.id,
      productName,
      productDescription,
      productCategory,
      productSKU,
      productUOM,
      productReorderPoint,
      imageURL,
      productWeight,
      productDimensions,
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
