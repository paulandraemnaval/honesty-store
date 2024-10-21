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

export async function DELETE(request, { params }) {
  const { id } = params;
}

export async function PATCH() {}
