import React, { useState, useEffect } from "react";
import "./styles/index.css";
import { Button, FormControl, Input, InputLabel } from "@mui/material";
import Todo from "./components/Todo";
import { db, collectionReference } from "./firebase";
import {
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  // when app loads, get data from the database
  useEffect(() => {
    async function getDataFromFirebase(db) {
      const q = query(collectionReference, orderBy("createdAt", "desc"));
      try {
        onSnapshot(q, ({ docs }) => {
          const todoList = docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setTodos(todoList);
        });
      } catch (e) {
        console.error(e.message);
      }
    }

    getDataFromFirebase(db);
  }, []);

  // Add to Database
  async function addToFirebase(e) {
    e.preventDefault();
    try {
      await addDoc(collectionReference, {
        task: input,
        isDone: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setInput("");
    } catch (err) {
      console.error(err.message);
    }
  }

  // Delete from database
  async function deleteFromFirebase(id) {
    try {
      const docRef = doc(db, "tasks", id);
      await deleteDoc(docRef);
    } catch (e) {
      console.error(e.message);
    }
  }

  return (
    <div className="App">
      <h1>Task Management System</h1>
      <form>
        <FormControl className="todo-form">
          <InputLabel>Write a Task</InputLabel>
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </FormControl>
        <br />
        <br />
        <Button
          className="add-todo-btn"
          disabled={!input}
          type="submit"
          variant="contained"
          onClick={addToFirebase}
        >
          Add Todo
        </Button>
      </form>
      <ul>
        {todos.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            deleteFunc={deleteFromFirebase}
          ></Todo>
        ))}
      </ul>
    </div>
  );
}

export default App;
