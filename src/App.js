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
  auth,
} from "./firebase";
import { onSnapshot, orderBy, query, collection } from "firebase/firestore";
import { useUserStatus } from "./user-context";
import { onAuthStateChanged } from "firebase/auth";
import { BounceLoader } from "react-spinners";

const spinnerStyle = {
  position: "fixed",
  top: "50%",
  left: "46%",
  transform: "translate(-50%, -50%)",
};

export function getDateTime(dateTime) {
  const result = {};
  result.day = dateTime.slice(8, 10);
  result.month = dateTime.slice(5, 7);
  result.year = dateTime.slice(0, 4);
  result.hour = dateTime.slice(11, 13);
  result.minute = dateTime.slice(14);
  if (result.hour > 12) {
    result.hour12 = result.hour - 12;
  } else if (result.hour === "00") {
    result.hour12 = 12;
  } else {
    result.hour12 = result.hour;
  }
  return `${result.day}-${result.month}-${result.year} at ${result.hour12}:${
    result.minute
  } ${result.hour >= 12 ? "PM" : "AM"}`;
}

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [comment, setComment] = useState("");
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useUserStatus();
  const collectionReference = collection(db, user);

  // when app loads, get data from the database
  useEffect(() => {
    setIsLoading(true);
    async function getDataFromFirebase(db) {
      const q = query(collectionReference, orderBy("createdAt", "desc"));
      try {
        onSnapshot(q, ({ docs }) => {
          const todoList = docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setTodos(todoList);
          setIsLoading(false);
        });
      } catch (e) {
        console.error(e.message);
        setIsLoading(false);
      }
    }
    getDataFromFirebase(db);
  }, [user]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user.email ? user.email : "tasks");
    });
  }, []);

  return (
    <div className={user === "tasks" ? "padding-off" : "padding-on"}>
      <Header />
      {user === "tasks" ? (
        <ManageUser />
      ) : (
        <div>
          <div style={spinnerStyle}>
            <BounceLoader loading={isLoading} color="#2196f3" />
          </div>
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
              className="task-datetime-control"
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
            <FormControl
              className="task-comment-control"
              sx={{
                marginTop: "1rem",
              }}
            >
              <InputLabel>Add a comment (Optional)</InputLabel>
              <Input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
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
                window.scrollTo(0, 0);
                addToFirebase(
                  collectionReference,
                  input,
                  getDateTime(dateTimeInput),
                  dateTimeInput,
                  comment
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
