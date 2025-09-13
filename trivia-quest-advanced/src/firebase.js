import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEcJNWwP6Q1xvBIy14PFCaPP4cGEClEmA",
  authDomain: "trivia-app-d416c.firebaseapp.com",
  projectId: "trivia-app-d416c",
  storageBucket: "trivia-app-d416c.firebasestorage.app",
  messagingSenderId: "898007045208",
  appId: "1:898007045208:web:0ff9497773bbc42616e62d",
  measurementId: "G-M2PZDWWFEY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);