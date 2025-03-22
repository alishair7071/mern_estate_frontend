// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-c946b.firebaseapp.com",
  projectId: "mern-estate-c946b",
  storageBucket: "mern-estate-c946b.firebasestorage.app",
  messagingSenderId: "384082108758",
  appId: "1:384082108758:web:70db8112aeee7d80a336f7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);