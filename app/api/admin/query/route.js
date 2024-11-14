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

function calculateSimilarity(supplierName, searchTerm) {
  const lowerSupplierName = supplierName.toLowerCase();
  const lowerSearchTerm = searchTerm.toLowerCase();

  const index = lowerSupplierName.indexOf(lowerSearchTerm);
  return index === -1 ? Infinity : index;
}

export async function GET(request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  console.log(search);

  if (!search) {
    return NextResponse.json(
      { message: "Search term is required" },
      { status: 400 }
    );
  }
  try {
    const supplierRef = collection(db, "Supplier");
    const q = query(supplierRef, where("supplier_soft_deleted", "==", false));

    const snapshot = await getDocs(q);
    const suppliers = snapshot.docs.map((doc) => doc.data());

    const filteredSuppliers = suppliers.filter((supplier) => {
      return supplier.supplier_name
        .toLowerCase()
        .includes(search.toLowerCase());
    });

    filteredSuppliers.sort((a, b) => {
      const aSimilarity = calculateSimilarity(a.supplier_name, search);
      const bSimilarity = calculateSimilarity(b.supplier_name, search);
      return aSimilarity - bSimilarity; // Ascending order
    });

    return NextResponse.json(
      { message: "Suppliers found", data: filteredSuppliers },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return (
      NextResponse,
      json({ message: "Error fetching suppliers" }, { status: 500 })
    );
  }
}
