import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { decrypt } from "@utils/session";
import { cookies } from "next/headers";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "fir-prac-3866d.firebaseapp.com",
  projectId: "fir-prac-3866d",
  storageBucket: "fir-prac-3866d.appspot.com",
  messagingSenderId: "433565566739",
  appId: "1:433565566739:web:265a336fd05f962229fce6",
  measurementId: "G-16LC26L69Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage();
export const db = getFirestore(app);

//createLog function
export const createLog = async (
  account_id,
  log_table_name,
  log_table_item_id,
  log_table_action
) => {
  const logRef = collection(db, "Log");
  const logDoc = doc(logRef);
  //creating log
  const logData = {
    log_id: logDoc.id,
    account_id,
    log_table_name,
    log_table_item_id,
    log_table_action,
    log_timestamp: Timestamp.now().toDate(),
  };
  //storing log to database
  await setDoc(logDoc, logData);
  return logData;
};

export const getLoggedInUser = async () => {
  const encryptedSession = cookies().get("session")?.value; // Get the session cookie
  if (!encryptedSession) {
    console.log("No session cookie found.");
    return null;
  }

  const sessionData = await decrypt(encryptedSession); // Decrypt the session
  const sessionRef = doc(db, "Session", sessionData.sessionId); // Reference to the session document

  try {
    const sessionDoc = await getDoc(sessionRef); // Get the session document
    if (!sessionDoc.exists()) {
      console.log("No session found with the given sessionId.");
      return null;
    }

    // Assuming you have a field in the session document to reference the user account
    const accountId = sessionDoc.data().account_auth_id; // Adjust the field name accordingly

    // Now fetch the account document using the accountId
    const accountRef = doc(db, "Account", accountId);
    const accountDoc = await getDoc(accountRef);

    if (!accountDoc.exists()) {
      console.log("No account found with the given accountId.");
      return null;
    }

    // Return the account data
    return accountDoc.data();
  } catch (error) {
    console.error("Error fetching user information:", error);
    return null;
  }
};
