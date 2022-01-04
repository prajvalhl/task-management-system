import React, { useState, useRef } from "react";
import "../styles/Todo.css";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Modal,
  FormControl,
  Input,
  InputLabel,
  Checkbox,
} from "@mui/material";
import { storage } from "../firebase";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { getDateTime } from "../App";
import { useUserStatus } from "../user-context";

function Todo({ todo, updateFunc, deleteFunc }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [comment, setComment] = useState("");
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [fileURL, setFileURL] = useState("");
  const [filePath, setFilePath] = useState("");
  const { user } = useUserStatus();
  const fileRef = useRef();

  function addComment() {
    updateFunc(
      user,
      todo.id,
      "updateComment",
      input ? input : todo.task,
      dateTimeInput ? getDateTime(dateTimeInput) : todo.deadline,
      dateTimeInput ? dateTimeInput : todo.deadline24,
      comment
        ? [
            ...todo.comment,
            {
              id:
                todo.comment.length === 0
                  ? 0
                  : todo.comment[todo.comment.length - 1].id + 1,
              text: comment,
            },
          ]
        : todo.comment,
      todo.filePath,
      todo.fileUrl
    );
    setComment("");
  }

  function deleteComment(comment) {
    const updatedCommentList = todo.comment.filter((todoComment) => {
      return comment.id !== todoComment.id;
    });
    updateFunc(
      user,
      todo.id,
      "deleteComment",
      input ? input : todo.task,
      dateTimeInput ? getDateTime(dateTimeInput) : todo.deadline,
      dateTimeInput ? dateTimeInput : todo.deadline24,
      updatedCommentList,
      todo.fileUrl,
      todo.filePath
    );
  }

  async function deleteFile(filePath) {
    const fileReference = ref(storage, filePath);
    try {
      await deleteObject(fileReference);
      updateFunc(
        user,
        todo.id,
        "updateFiles",
        input ? input : todo.task,
        dateTimeInput ? getDateTime(dateTimeInput) : todo.deadline,
        dateTimeInput ? dateTimeInput : todo.deadline24,
        todo.comment,
        "",
        ""
      );
    } catch (e) {
      console.error(e.message);
    }
  }

  function uploadFile(file) {
    if (!file) {
      alert("No file found");
      return;
    }
    setFilePath(`/files/${file.name}`);
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
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="edit-modal">
          <h3>Edit</h3>
          <form>
            <FormControl
              className="todo-edit-form"
              sx={{
                marginBottom: "1rem",
              }}
            >
              <InputLabel>Edit a Task</InputLabel>
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
            {todo.filePath && (
              <Button
                sx={{
                  color: "red",
                  marginTop: "1rem",
                }}
                onClick={() => {
                  deleteFile(todo.filePath);
                }}
              >
                Delete Attached File
              </Button>
            )}
            {!todo.filePath && (
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
                  setShowProgress(true);
                  uploadFile(e.target.files[0]);
                }}
              />
            )}
            <p>{showProgress && `Uploading file: ${progress}%`}</p>
            <Button
              sx={{
                margin: "0.5rem auto 0 auto",
                display: "block",
              }}
              type="submit"
              disabled={!input && !dateTimeInput}
              onClick={(e) => {
                e.preventDefault();
                updateFunc(
                  user,
                  todo.id,
                  "updateTitle",
                  input ? input : todo.task,
                  dateTimeInput ? getDateTime(dateTimeInput) : todo.deadline,
                  dateTimeInput ? dateTimeInput : todo.deadline24,
                  todo.comment,
                  fileURL ? fileURL : todo.fileUrl,
                  filePath ? filePath : todo.filePath
                );
                setInput("");
                setDateTimeInput("");
                setShowProgress(false);
                setFilePath("");
                setOpen(false);
              }}
            >
              Update Task
            </Button>
          </form>
        </div>
      </Modal>
      <List className="todo-item" sx={{ margin: "1rem 0.2rem" }}>
        <ListItem>
          <Checkbox
            checked={todo.isDone}
            onChange={() => {
              updateFunc(user, todo.id, "updateBoolean", !todo.isDone);
            }}
          />
          <ListItemText
            style={{
              textDecoration: todo.isDone ? "line-through" : "none",
              marginLeft: "1rem",
            }}
            primary={todo.task}
            secondary={`⏰ Deadline: ${todo.deadline}`}
          />
          {todo.fileUrl && (
            <Button
              onClick={() => {
                window.open(todo.fileUrl, "_blank").focus();
              }}
            >
              <span className="material-icons">download</span>
            </Button>
          )}
          <Button
            onClick={() => {
              setOpen(true);
              setInput(todo.task);
              setDateTimeInput(todo.deadline24);
            }}
          >
            <span className="material-icons">edit</span>
          </Button>
          <Button
            onClick={() => {
              deleteFunc(user, todo.id);
            }}
          >
            <span className="material-icons">delete</span>
          </Button>
        </ListItem>
        {todo.comment.length > 0
          ? todo.comment.map((comment) => (
              <li key={comment.id} className="comment-item">
                💬 {comment.text}
                <Button
                  sx={{
                    color: "red",
                  }}
                  onClick={() => {
                    deleteComment(comment);
                  }}
                >
                  Delete
                </Button>
              </li>
            ))
          : null}
        <form>
          <ListItem>
            <FormControl className="todo-edit-form todo-comment-input">
              <InputLabel>Add a comment (Optional)</InputLabel>
              <Input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </FormControl>
            <Button
              sx={{
                margin: "0 1rem",
              }}
              disabled={!comment}
              type="submit"
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                addComment();
              }}
            >
              Add
            </Button>
          </ListItem>
        </form>
      </List>
    </div>
  );
}

export default Todo;
