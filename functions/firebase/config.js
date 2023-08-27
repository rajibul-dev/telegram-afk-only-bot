// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

// Config credentials
const firebaseConfig = {
  apiKey: "AIzaSyCUWhnA-A73J-EmD6d21T862l7q8RCwLko",
  authDomain: "telegram-afk-only-bot.firebaseapp.com",
  projectId: "telegram-afk-only-bot",
  storageBucket: "telegram-afk-only-bot.appspot.com",
  messagingSenderId: "522741594623",
  appId: "1:522741594623:web:64287fb7321102f9714fca",
  measurementId: "G-QBXVQNDWXK"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

module.exports = { db };
