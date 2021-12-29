import React, { useState, useRef } from "react";
import "../styles/index.css";
import { Button, FormControl, Input, InputLabel } from "@mui/material";
import { db, addToFirebase, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useUserStatus } from "../user-context";
import { getDateTime } from "../App";
import { collection } from "firebase/firestore";

function TodoForm() {
  const [input, setInput] = useState("");
  const [comment, setComment] = useState("");
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [fileURL, setFileURL] = useState("");
  const { user } = useUserStatus();
  const collectionReference = collection(db, user);
  const fileRef = useRef();

  function uploadFile(file) {
    if (!file) {
      alert("No file found");
      return;
    }
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (err) => {
        console.error(err.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => setFileURL(url));
      }
    );
  }

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
        <input
          style={{
            margin: "1rem auto",
            display: "block",
            fontSize: "1rem",
          }}
          type="file"
          ref={fileRef}
          onChange={(e) => {
            e.preventDefault();
            uploadFile(e.target.files[0]);
          }}
        />
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
              comment,
              fileURL
            );
            setInput("");
            setDateTimeInput("");
            setComment("");
            fileRef.current.value = "";
          }}
        >
          Add Task
        </Button>
      </form>
    </div>
  );
}

export default TodoForm;
