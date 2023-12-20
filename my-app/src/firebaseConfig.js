import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
// import { getFunctions, useEmulator as useFunctionsEmulator } from 'firebase/functions';

// Replace these with your Firebase configuration details
const firebaseConfig = {
    apiKey: "AIzaSyDaxbqiWDU5QLxTctP3ZJCDR3-9B2fnYcM",
    authDomain: "sociacise.firebaseapp.com",
    databaseURL: "https://sociacise-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "sociacise",
    storageBucket: "sociacise.appspot.com",
    messagingSenderId: "186279493183",
    appId: "1:186279493183:web:9dae74fc03f022eef4c28a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize services
const auth = getAuth(app); // Using the modular function
const db = getFirestore(app); // Using the modular function
const functions = getFunctions(app); // Using the modular function`

// Use emulator if in development, this is critical but don't fully get it
if (window.location.hostname === "localhost") {

    // For Firestore
    connectFirestoreEmulator(db, "localhost", 8080);

    // For Authentication
    connectAuthEmulator(auth, "http://localhost:9099");

    // For Cloud Functions (if you're using it)
    connectFunctionsEmulator(functions, "localhost", 5001);

    // For Storage
    // connectStorageEmulator(storage, "localhost", 9199);

    // For Firebase Realtime Database (if you're using it)
    // const realDb = getDatabase(app);
    // connectDatabaseEmulator(realDb, "localhost", 9000);
  }

export { auth, db };