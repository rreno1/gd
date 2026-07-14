// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwILCYjtOKSb-UbbyRcj3UO3th7ddXkZY",
  authDomain: "gd-learning-portal-73655.firebaseapp.com",
  projectId: "gd-learning-portal-73655",
  storageBucket: "gd-learning-portal-73655.firebasestorage.app",
  messagingSenderId: "890921190550",
  appId: "1:890921190550:web:3d9b8bd25a5ea601252eb7",
  measurementId: "G-R09Y1WZ0V5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);