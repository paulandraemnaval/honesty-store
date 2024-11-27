import { db } from "@utils/firebase";
import {
  collection,
  where,
  doc,
  getDocs,
  query,
  getDoc,
} from "firebase/firestore";
import { report } from "./sheets";
import { formatDateToLong, formatDate } from "./formatDate";

export const createInventoryList = async (inventories, startDate, endDate) => {
  try {
    await report.loadInfo();

    const sheet = await report.addSheet({
      title: `${formatDate(startDate)} - ${formatDate(endDate)}`,
      headerRowIndex: 2,
      headerValues: [
        "Inventory ID",
        "Product",
        "Wholesale Price",
        "Retail Price",
        "Profit Margin",
        "Expiration Date",
        "Remaining Stock",
      ],
    });

    let rowInd = 1;
    await sheet.loadCells(`A${rowInd + 1}:G${rowInd + 1}`);

    for (let col = 0; col < 7; col++) {
      const cell = sheet.getCell(rowInd, col);
      cell.horizontalAlignment = "CENTER";
      cell.textFormat = { bold: true };
      cell.backgroundColor = { red: 0.8549, green: 0.9176, blue: 0.8275 };
    }
    await sheet.saveUpdatedCells();

    let range = {
      startRowIndex: 0, // 0-indexed, first row
      endRowIndex: 1, // 1-indexed, second row (exclusive)
      startColumnIndex: 0, // 0-indexed, first column (A)
      endColumnIndex: 7, // 7-indexed, eighth column (H, exclusive)
    };

    await sheet.mergeCells(range, "MERGE_ALL");
    await sheet.loadCells(`A${rowInd}:G${rowInd}`);
    const title1 = sheet.getCellByA1("A1:G1");
    title1.value = `${formatDateToLong(startDate)} - ${formatDateToLong(
      endDate
    )}`;
    title1.textFormat = { bold: true };
    title1.backgroundColor = { red: 0.2, green: 0.6, blue: 0.8 };
    await sheet.saveUpdatedCells();

    const newRowValues = [];

    const promises = inventories.map(async (inventory) => {
      const productRef = doc(db, "Product", inventory.product_id);
      const productSnapshot = await getDoc(productRef);
      if (!productSnapshot.exists()) {
        console.log("No product id found");
        return;
      }
      const productName = productSnapshot.data().product_name;

      const supplierRef = doc(db, "Supplier", inventory.supplier_id);
      const supplierSnapshot = await getDoc(supplierRef);
      if (!supplierSnapshot.exists()) {
        console.log("No supplier id found");
        return;
      }
      const expirationDate = inventory.inventory_expiration_date.toDate();
      const supplierName = supplierSnapshot.data().supplier_name;
      const newInventory = [
        inventory.inventory_id,
        productName,
        supplierName,
        inventory.inventory_wholesale_price,
        inventory.inventory_retail_price,
        inventory.inventory_profit_margin,
        formatDate(expirationDate),
        inventory.inventory_total_units,
      ];

      newRowValues.push(newInventory);
    });

    await Promise.all(promises);

    for (let i = 0; i < newRowValues.length; i++) {
      rowInd++;
      await sheet.loadCells(`A${rowInd + 1}:G${rowInd + 1}`);
      for (let col = 0; col < 7; col++) {
        const cell = sheet.getCell(rowInd, col);
        cell.value = newRowValues[i][col];
        cell.horizontalAlignment = "CENTER";
        if (col === 3 || col === 4) {
          cell.numberFormat = {
            type: "CURRENCY",
            pattern: "₱#,##0.00",
          };
        }
      }
    }
  } catch (error) {
    console.error("Error creating inventory list:", error);
  }
};
