import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

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

// Add to Database
export async function addToFirebase(input, dateTime, dateTime24) {
  try {
    await addDoc(collectionReference, {
      task: input,
      isDone: false,
      deadline: dateTime,
      deadline24: dateTime24,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error(err.message);
  }
}

// update documents in database
export async function updateDocuments(
  id,
  taskName,
  updatedTask,
  updatedDateTime,
  deadline24
) {
  try {
    const docRef = doc(db, "tasks", id);
    if (taskName === "updateTitle") {
      await updateDoc(docRef, {
        task: updatedTask,
        deadline: updatedDateTime,
        deadline24: deadline24,
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
export async function deleteFromFirebase(id) {
  try {
    const docRef = doc(db, "tasks", id);
    await deleteDoc(docRef);
  } catch (e) {
    console.error(e.message);
  }
}

export { db };
