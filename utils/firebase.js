import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

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
  return logDoc;
};
