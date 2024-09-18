import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDo,
  setDoc,
  Timestamp,
  addDoc,
} from "firebase/firestore";

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
export const googleProvider = new GoogleAuthProvider();
