import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDphCye4UyjFjUxIJmDjKsvBxcVxiAKaH8",
  authDomain: "task-management-system-d3404.firebaseapp.com",
  projectId: "task-management-system-d3404",
  storageBucket: "task-management-system-d3404.appspot.com",
  messagingSenderId: "1023136631184",
  appId: "1:1023136631184:web:49eb819c2a8836d5e74b15",
  measurementId: "G-DV9HQXJW3H",
};

// init firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore();

// get collection reference
export const collectionReference = collection(db, "tasks");

export { db };
