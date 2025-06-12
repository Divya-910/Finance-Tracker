// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDONRHZXRfuEFMt3hg3bCE_VIicXLrNgcE",
  authDomain: "finance-tracker-09.firebaseapp.com",
  projectId: "finance-tracker-09",
  storageBucket: "finance-tracker-09.firebasestorage.app",
  messagingSenderId: "44635271513",
  appId: "1:44635271513:web:ef422c28507e31a37d9c48",
  measurementId: "G-9B6LGWMQ01"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
