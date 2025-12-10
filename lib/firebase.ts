import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBADjnYS3URYdM222tcZMXpcrvJmQaslmg",
    authDomain: "system-n-f3877.firebaseapp.com",
    projectId: "system-n-f3877",
    storageBucket: "system-n-f3877.firebasestorage.app",
    messagingSenderId: "219726213942",
    appId: "1:219726213942:web:11ca2ec3506d536a2e3997",
    measurementId: "G-79936R9NWP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
