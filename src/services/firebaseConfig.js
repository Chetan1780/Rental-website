// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "carmarketplace-db420.firebaseapp.com",
  projectId: "carmarketplace-db420",
  storageBucket: "carmarketplace-db420.appspot.com",
  messagingSenderId: "1009138869151",
  appId: "1:1009138869151:web:85e535a517ec5815d6d3aa"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

export { storage };
