import React, { useState, useEffect } from "react";
import "./styles/index.css";
import { Button, FormControl, Input, InputLabel } from "@mui/material";
import Todo from "./components/Todo";
import Header from "./components/Header";
import {
  db,
  collectionReference,
  addToFirebase,
  updateDocuments,
  deleteFromFirebase,
} from "./firebase";
import { onSnapshot, orderBy, query } from "firebase/firestore";

export function getDateTime(dateTime) {
  const result = {};
  result.day = dateTime.slice(8, 10);
  result.month = dateTime.slice(5, 7);
  result.year = dateTime.slice(0, 4);
  result.hour = dateTime.slice(11, 13);
  result.minute = dateTime.slice(14);
  return `${result.day}-${result.month}-${result.year} at ${result.hour}:${result.minute}`;
}

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [dateTimeInput, setDateTimeInput] = useState("");

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

  return (
    <div className="App">
      <Header />
      <div id="toast"></div>
      <form className="task-form">
        <FormControl
          className="task-input-control"
          sx={{ marginBottom: "1rem" }}
        >
          <InputLabel>What needs to be done?</InputLabel>
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </FormControl>
        <InputLabel>Pick a Deadline</InputLabel>
        <FormControl>
          <Input
            type="datetime-local"
            className="datetime"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
          />
        </FormControl>
        <Button
          sx={{
            margin: "1rem auto",
            display: "block",
          }}
          disabled={!input || !dateTimeInput}
          type="submit"
          variant="contained"
          onClick={(e) => {
            e.preventDefault();
            addToFirebase(input, getDateTime(dateTimeInput), dateTimeInput);
            setInput("");
            setDateTimeInput("");
          }}
        >
          Add Task
        </Button>
      </form>
      <ul>
        {todos.map((todo) => (
          <Todo
            className="task-list-item"
            key={todo.id}
            todo={todo}
            deleteFunc={deleteFromFirebase}
            updateFunc={updateDocuments}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
