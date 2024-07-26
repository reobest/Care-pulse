// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: process.env.FIRE_BASE_API_KEY,
  authDomain: "care-pulse-838fa.firebaseapp.com",
  projectId: "care-pulse-838fa",
  storageBucket: "care-pulse-838fa.appspot.com",
  messagingSenderId: "780013508890",
  appId: process.env.FIRE_BASE_APP_ID,
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);