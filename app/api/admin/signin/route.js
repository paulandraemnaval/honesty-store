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
import { cookies } from "next/headers";
import { encrypt } from "@utils/session";

async function createSession(userId) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 1000);
  const sessionRef = collection(db, "Session");
  const sessionDoc = doc(sessionRef);

  const sessionData = {
    session_id: sessionDoc.id,
    account_id: userId,
    session_access_type: "authenticated",
    session_accessed_url: "/",
    session_timestamp: Timestamp.now().toDate(),
  };
  await setDoc(sessionDoc, sessionData);

  const sessionId = sessionDoc.id;
  const encryptedSession = await encrypt({ sessionId, expiresAt });

  cookies().set("session", encryptedSession, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: lax,
    path: "/",
  });

  return sessionId;
}

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

    await createSession(accountData.account_id);

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
