import { db, getLoggedInUser, createLog } from "@utils/firebase";
import { Timestamp, doc, updateDoc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import getImageURL from "@utils/imageURL";

//-------------------------------------------DELETE----------------------------------
export async function DELETE(request, { params }) {
  console.log(params);

  const { id } = params;
  try {
    const productRef = doc(db, "Product", id);
    await updateDoc(productRef, {
      product_last_updated: Timestamp.now().toDate(),
      product_soft_deleted: true,
    });

    return NextResponse.json(
      { message: `Product with ID ${id} soft-deleted successfully.` },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

//-----------------------------------------PATCH------------------------------------
export async function PATCH(request, { params }) {
  const { id } = params;
  const productDoc = doc(db, "Product", id);

  try {
    const reqFormData = await request.formData();
    const product_name = reqFormData.get("product_name");
    const file = reqFormData.get("file");
    const product_description = reqFormData.get("product_description");
    const product_category = reqFormData.get("product_category");
    const product_sku = reqFormData.get("product_sku");
    const product_uom = reqFormData.get("product_uom");
    const product_reorder_point = parseInt(
      reqFormData.get("product_reorder_point")
    );
    const product_weight = parseFloat(reqFormData.get("product_weight"));
    const product_dimension = parseFloat(reqFormData.get("product_dimensions"));

    const imageURL = await getImageURL(file, productDoc.id, "Product");
    if (!imageURL) {
      console.error("Failed to generate image URL:", error);
      return NextResponse.json(
        { error: "Failed to generate image URL" },
        { status: 400 }
      );
    }

    await updateDoc(productDoc, {
      product_name,
      product_image_url: imageURL,
      product_description,
      product_category,
      product_sku,
      product_uom,
      product_reorder_point,
      product_weight,
      product_dimension,
      product_last_updated: Timestamp.now().toDate(),
    });

    const user = await getLoggedInUser();
    const logData = await createLog(
      user.account_id,
      "Product",
      id,
      `Updated product with ID ${id}`
    );

    return NextResponse.json(
      { message: `Updated product with ID ${id} successfully.`, data: logData },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
