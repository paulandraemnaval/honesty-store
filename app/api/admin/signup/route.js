import { auth, db } from "@utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";
import getImageURL from "@utils/imageURL";

const signUpUser = async (email, password) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(
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
  const accountRef = collection(db, "Account");
  const accountDoc = doc(accountRef);

  try {
    const { name, email, password, file, role } = Object.fromEntries(
      await request.formData()
    );
    console.log("Creating account for:", name, email, password, file, role);

    const user = await signUpUser(email, password);
    if (user instanceof Error) {
      return NextResponse.json({ error: user }, { status: 400 });
    }

    console.log("User created:", user);

    const imageURL = await getImageURL(file, accountDoc.id);

    //get image url
    if (!file) {
      if (!imageURL) {
        console.log("Failed to generate image URL");
        return NextResponse.json(
          { error: "Failed to generate image URL" },
          { status: 400 }
        );
      }
    }

    //hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    //creating account
    const accountData = {
      account_id: accountDoc.id,
      account_name: name,
      account_email: email,
      account_password: hashedPassword,
      account_profile_url: imageURL || null,
      account_role: role,
      account_timestamp: Timestamp.now().toDate(),
      account_last_updated: account_timestamp,
      account_soft_deleted: false,
    };

    //storing account
    await setDoc(accountDoc, accountData);

    return NextResponse.json(
      { message: "Account created successfully", account },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in account creation:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again later." },
      { status: 500 }
    );
  }
}
