import { auth, db } from "@utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { NextResponse } from "next/server";

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

    console.log("Signing in user:", email, password);

    const accountData = await signInUser(email, password);
    if (accountData instanceof Error) {
      console.log("Error in user sign-up:", accountData);
      return NextResponse.json({ error: accountData.message }, { status: 400 });
    }
    return NextResponse.json(
      {
        message: "Account signed-up successfully",
        accountData,
      },
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
