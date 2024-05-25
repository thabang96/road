
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA5fCGeDbp2lnO5p6psPp4jpU9GCzHfGGw",
    authDomain: "trip-bef20.firebaseapp.com",
    projectId: "trip-bef20",
    storageBucket: "trip-bef20.appspot.com",
    messagingSenderId: "1096962096876",
    appId: "1:1096962096876:web:12b33526d69cba4978efc9"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

