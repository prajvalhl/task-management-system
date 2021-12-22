import React, { useState, useEffect } from "react";
import "./styles/index.css";
import { Button, FormControl, Input, InputLabel } from "@mui/material";
import Todo from "./components/Todo";
import Header from "./components/Header";
import ManageUser from "./components/ManageUser";
import {
  db,
  addToFirebase,
  updateDocuments,
  deleteFromFirebase,
  UserSignOut,
} from "./firebase";
import { onSnapshot, orderBy, query, collection } from "firebase/firestore";
import { useUserStatus } from "./user-context";

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
  const { user, setUser } = useUserStatus();
  const collectionReference = collection(db, user);

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
  }, [user]);

  return (
    <div className="App">
      <Header />
      {user === "tasks" ? (
        <ManageUser />
      ) : (
        <div>
          <form className="task-form">
            <FormControl
              className="task-input-control"
              sx={{
                marginBottom: "1rem",
              }}
            >
              <InputLabel>What needs to be done?</InputLabel>
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </FormControl>
            <InputLabel>Pick a Deadline</InputLabel>
            <FormControl
              sx={{
                display: "block",
              }}
            >
              <Input
                type="datetime-local"
                className="datetime"
                value={dateTimeInput}
                onChange={(e) => setDateTimeInput(e.target.value)}
              />
            </FormControl>
            <Button
              sx={{
                margin: "1rem",
              }}
              // disabled={!input || !dateTimeInput}
              type="submit"
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                UserSignOut();
                setUser("tasks");
              }}
            >
              Sign Out
            </Button>
            <Button
              sx={{
                margin: "1rem",
              }}
              disabled={!input || !dateTimeInput}
              type="submit"
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                addToFirebase(
                  collectionReference,
                  input,
                  getDateTime(dateTimeInput)
                );
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
      )}
    </div>
  );
}

export default App;
