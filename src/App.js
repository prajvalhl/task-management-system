import React, { useState, useEffect } from "react";
import "./styles/index.css";
import Todo from "./components/Todo";
import Header from "./components/Header";
import ManageUser from "./components/ManageUser";
import { db, updateDocuments, deleteFromFirebase, auth } from "./firebase";
import { onSnapshot, orderBy, query, collection } from "firebase/firestore";
import { useUserStatus } from "./user-context";
import { onAuthStateChanged } from "firebase/auth";
import Spinner from "./components/Spinner";
import TodoForm from "./components/TodoForm";
import NoTasksFound from "./components/NoTasksFound";

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
      setUser(user?.email ? user.email : "tasks");
    });
  }, []);

  return (
    <div className={user === "tasks" ? "padding-off" : "padding-on"}>
      <Header />
      {user === "tasks" ? (
        <ManageUser />
      ) : (
        <div>
          <Spinner isLoading={isLoading} />
          <TodoForm />
          <ul>
            {todos.length === 0 ? (
              <NoTasksFound />
            ) : (
              todos.map((todo) => (
                <Todo
                  className="task-list-item"
                  key={todo.id}
                  todo={todo}
                  deleteFunc={deleteFromFirebase}
                  updateFunc={updateDocuments}
                />
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
