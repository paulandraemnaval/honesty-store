import { db, getLoggedInUser, createLog } from "@utils/firebase";
import { Timestamp, updateDoc, doc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function DELETE({ params }) {
  const { id } = params;
  try {
    const inventoryRef = doc(db, "inventories", id);
    await updateDoc(inventoryRef, {
      inventory_soft_deleted: true,
      inventory_last_updated: Timestamp.now().toDate(),
    });

    const user = await getLoggedInUser();
    const logData = await createLog(
      user.account_id,
      "Inventory",
      id,
      `Soft-deleted inventory with ID ${id}`
    );

    return NextResponse.json(
      {
        message: `Inventory with ID ${id} soft-deleted successfully.`,
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
  const inventoryDoc = doc(db, "inventories", id);
  try {
    const reqFormData = await request.formData();
    const inventory_wholesale_price = parseFloat(
      reqFormData.get("wholesale_price")
    );
    const product_id = reqFormData.get("inventory_product");
    const supplier_id = reqFormData.get("inventory_supplier");
    const inventory_total_units = parseInt(reqFormData.get("total_units"));
    const inventory_retail_price = parseFloat(reqFormData.get("retail_price"));
    const inventory_description = reqFormData.get("inventory_description");
    const inventory_profit_margin = parseFloat(
      reqFormData.get("inventory_profit_margin")
    );
    const inventory_expiration_date = reqFormData.get(
      "inventory_expiration_date"
    );

    await updateDoc(inventoryDoc, {
      product_id,
      supplier_id,
      inventory_wholesale_price,
      inventory_total_units,
      inventory_retail_price,
      inventory_description,
      inventory_profit_margin,
      inventory_expiration_date,
      inventory_last_updated: Timestamp.now().toDate(),
    });

    const user = await getLoggedInUser();
    const logData = await createLog(
      user.account_id,
      "Inventory",
      id,
      `Updated inventory with ID ${id}`
    );

    return NextResponse.json(
      {
        message: `Updated inventory with ID ${id} successfully.`,
        data: logData,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
