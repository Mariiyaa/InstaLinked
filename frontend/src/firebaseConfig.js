import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBsRtVBzLLAr68HK5G4cEG-dAjfJEbRquM",
  authDomain: "instalinked-5795c.firebaseapp.com",
  projectId: "instalinked-5795c",
  storageBucket: "instalinked-5795c.firebasestorage.app",
  messagingSenderId: "974967220796",
  appId: "1:974967220796:web:78c5df6d9cf6bd61c5f139",
  measurementId: "G-R2C25CQ4TY"
};



// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

export { auth };
