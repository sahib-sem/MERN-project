// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestateapp-79815.firebaseapp.com",
  projectId: "realestateapp-79815",
  storageBucket: "realestateapp-79815.appspot.com",
  messagingSenderId: "523676584873",
  appId: "1:523676584873:web:d2e3398c3fb9706c0352b8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);