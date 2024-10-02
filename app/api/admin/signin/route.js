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
    const { email, password } = Object.fromEntries(await request.formData());

    console.log("Signing in user:", email, password);

    const accountData = await signInUser(email, password);

    if (accountData instanceof Error) {
      console.log("Error in user sign-up:", accountData.message);
      return NextResponse.json({ error: accountData.message }, { status: 400 });
    }

    const sessionRef = collection(db, "Session");
    const sessionDoc = doc(sessionRef);

    const sessionData = {
      session_id: sessionDoc.id,
      account_id: accountData.uid,
      session_timestamp: Timestamp.now().toDate(),
    };

    await setDoc(sessionDoc, sessionData);

    return NextResponse.json(
      { message: "Account signed in successfully", accountData, sessionData },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred during sign-in ",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
