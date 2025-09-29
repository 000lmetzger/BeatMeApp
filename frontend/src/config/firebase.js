// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCi9IlBT22yits4LhRSuVicj34crmkkCyU",
  authDomain: "beatme-1609.firebaseapp.com",
  projectId: "beatme-1609",
  storageBucket: "beatme-1609.firebasestorage.app",
  messagingSenderId: "747891634716",
  appId: "1:747891634716:web:1945d3ba15ae0a3a6665d9",
  measurementId: "G-B9RPZ9WK88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);