import React, { useState } from "react";
import "../styles/index.css";
import { Button, FormControl, Input, InputLabel } from "@mui/material";
import { db, addToFirebase } from "../firebase";
import { useUserStatus } from "../user-context";
import { getDateTime } from "../App";
import { collection } from "firebase/firestore";

function TodoForm() {
  const [input, setInput] = useState("");
  const [comment, setComment] = useState("");
  const [dateTimeInput, setDateTimeInput] = useState("");
  const { user } = useUserStatus();
  const collectionReference = collection(db, user);

  return (
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
            setComment("");
          }}
        >
          Add Task
        </Button>
      </form>
    </div>
  );
}

export default TodoForm;
