import React, { useState } from "react";
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
import { getDateTime } from "../App";
import { useUserStatus } from "../user-context";

function Todo({ todo, updateFunc, deleteFunc }) {
  const [open, setOpen] = useState(false);
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [input, setInput] = useState("");
  const [comment, setComment] = useState("");
  const [dateTimeInput, setDateTimeInput] = useState("");
  const { user } = useUserStatus();

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
            <Button
              sx={{
                margin: "1rem auto 0 auto",
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
                  todo.comment
                );
                setInput("");
                setDateTimeInput("");
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
                    const updatedCommentList = todo.comment.filter(
                      (todoComment) => {
                        return comment.id !== todoComment.id;
                      }
                    );
                    updateFunc(
                      user,
                      todo.id,
                      "deleteComment",
                      input ? input : todo.task,
                      dateTimeInput
                        ? getDateTime(dateTimeInput)
                        : todo.deadline,
                      dateTimeInput ? dateTimeInput : todo.deadline24,
                      updatedCommentList
                    );
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
                    : todo.comment
                );
                setComment("");
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
