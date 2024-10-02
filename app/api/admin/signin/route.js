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
  query,
  where,
} from "firebase/firestore";
import bcryptjs from "bcryptjs";
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
    const query_string = query(
      collection(db, "Account"),
      where("account_email", "==", email)
    );
    const user_email = await getDocs(query_string);

    if (user_email.empty) {
      console.log("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const email_salt = user_email.docs[0].data().account_salt;
    const password_hash = await bcryptjs.hash(password, email_salt);

    const accountData = await signInUser(email, password_hash);

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
    console.log("Error in sign-in:", error.message);
    return NextResponse.json(
      {
        message: "An error occurred during sign-in ",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
