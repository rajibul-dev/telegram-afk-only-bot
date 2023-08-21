// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Coonnect to the server with correct values
const firebaseConfig = {
  apiKey: "AIzaSyCUWhnA-A73J-EmD6d21T862l7q8RCwLko",
  authDomain: "telegram-afk-only-bot.firebaseapp.com",
  projectId: "telegram-afk-only-bot",
  storageBucket: "telegram-afk-only-bot.appspot.com",
  messagingSenderId: "522741594623",
  appId: "1:522741594623:web:dbadc64352f9e0bb714fca",
  measurementId: "G-ZFN6VC2J2Q"
};

// Initialize services
const app = initializeApp(firebaseConfig);
const db = getFirestore();

// timestamp
const timestamp = firebase.firestore.Timestamp;

export { app, db, timestamp };
