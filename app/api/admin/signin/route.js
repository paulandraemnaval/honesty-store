import { auth, db } from "@utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { NextResponse } from "next/server";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";

const signInUser = async (email, password) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredentials.user;
    return user;
  } catch (error) {
    return new Error(error.message);
  }
};

export async function POST(request) {
  try {
    const reqFormData = await request.formData();
    const { email, password } = Object.fromEntries(reqFormData);
    const accountData = await signInUser(email, password);

    if (accountData instanceof Error) {
      console.log("Error in user sign-up:", accountData);
      return NextResponse.json({ error: accountData.message }, { status: 400 });
    }

    const sessionRef = collection(db, "Session");
    const sessionDoc = doc(sessionRef);

    const sessionData = {
      session_id: sessionDoc.id,
      account_id: accountData.account_id,
      session_timestamp: Timestamp.now().toDate(),
    };

    await setDoc(sessionDoc, sessionData);

    return NextResponse.json(
      { message: "Account signed-up successfully", accountData, sessionData },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred during sign-up ",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
