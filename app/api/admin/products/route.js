import { db, createLog, getLoggedInUser } from "@utils/firebase";
import {
  collection,
  getDocs,
  Timestamp,
  doc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import getImageURL from "@utils/imageURL";

//-------------------------------GET------------------------------------------------------
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

    const updatedProducts = await Promise.all(
      products.map(async (prod) => {
        const categoryQuery = query(
          collection(db, "category"),
          where("category_id", "==", prod.product_category)
        );

        const categorySnapshot = await getDocs(categoryQuery);
        const category = categorySnapshot.docs.map((doc) => doc.data())[0];

        return {
          ...prod,
          product_category: category || null,
        };
      })
    );

    return NextResponse.json(
      {
        message: "All products",
        data: updatedProducts,
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

//-------------------------------------------POST-----------------------------------------------
export async function POST(request) {
  const productRef = collection(db, "products");
  const productDoc = doc(productRef);
  try {
    const reqFormData = await request.formData();
    const product_name = reqFormData.get("product_name");
    const file = reqFormData.get("file");
    const product_description = reqFormData.get("product_description");
    const product_category = reqFormData.get("product_category");
    const product_sku = reqFormData.get("product_sku");
    const product_uom = reqFormData.get("product_uom");
    const product_reorder_point = reqFormData.get("product_reorder_point");
    const product_weight = reqFormData.get("product_weight");
    const product_dimensions = reqFormData.get("product_dimensions");

    const imageURL = await getImageURL(file, productDoc.id, "products");
    if (!imageURL) {
      console.error("Failed to generate image URL:", error);
      return NextResponse.json(
        { error: "Failed to generate image URL" },
        { status: 400 }
      );
    }

    await setDoc(productDoc, {
      product_id: productDoc.id,
      product_name,
      product_description,
      product_category,
      product_sku,
      product_uom,
      product_reorder_point,
      product_image_url: imageURL,
      product_weight,
      product_dimensions,
      product_timestamp: Timestamp.now().toDate(),
      product_last_updated: Timestamp.now().toDate(),
      product_soft_deleted: false,
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

    const logData = await createLog(
      getLoggedInUser().account_id,
      "Products",
      "N/A",
      "Create a product"
    );

    return NextResponse.json(
      {
        message: "Product created successfully",
        data: {
          productId: productDoc.id,
          imageURL,
          logData,
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
