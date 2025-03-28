// Load the .env file for our api keys
require('dotenv').config()

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEi1VUltR6-oimYbzQkfez_bXhUrBsyrE",
  authDomain: "onboarding-project-3192e.firebaseapp.com",
  projectId: "onboarding-project-3192e",
  storageBucket: "onboarding-project-3192e.firebasestorage.app",
  messagingSenderId: "112785148131",
  appId: "1:112785148131:web:5c0342cae3d0abaec49dd6",
  measurementId: "G-TBPMLMCS31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)