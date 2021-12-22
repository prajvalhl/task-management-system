import { initializeApp } from "firebase/app";
import {
  getFirestore,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";

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
export const db = getFirestore();
export const auth = getAuth();

// get collection reference
// export const collectionReference = collection(db, "tasks");

// Add to Database
export async function addToFirebase(collectionReference, input, dateTime) {
  try {
    await addDoc(collectionReference, {
      task: input,
      isDone: false,
      deadline: dateTime,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error(err.message);
  }
}

// update documents in database
export async function updateDocuments(
  dbName,
  id,
  taskName,
  updatedTask,
  updatedDateTime
) {
  try {
    const docRef = doc(db, dbName, id);
    if (taskName === "updateTitle") {
      await updateDoc(docRef, {
        task: updatedTask,
        deadline: updatedDateTime,
        updatedAt: serverTimestamp(),
      });
    } else if (taskName === "updateBoolean") {
      await updateDoc(docRef, {
        isDone: updatedTask,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    console.error(err.message);
  }
}

// Delete from database
export async function deleteFromFirebase(dbName, id) {
  try {
    const docRef = doc(db, dbName, id);
    await deleteDoc(docRef);
  } catch (e) {
    console.error(e.message);
  }
}

// signing out a user
export async function UserSignOut() {
  try {
    signOut(auth);
  } catch (e) {
    console.error(e.message);
  }
}
