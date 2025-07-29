// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6lLk-cPoXhUAlCD8ZCP95bv-vWkg2Q3w",
  authDomain: "last-e9e0d.firebaseapp.com",
  projectId: "last-e9e0d",
  storageBucket: "last-e9e0d.appspot.com",
  messagingSenderId: "1032095953004",
  appId: "1:1032095953004:web:e96312ee616c692787a849",
  measurementId: "G-YF6CP1Y3VE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth & Firestore
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);