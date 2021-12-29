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
  const [input, setInput] = useState("");
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
                marginTop: "1rem",
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
                  dateTimeInput ? dateTimeInput : todo.deadline24
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
      <List>
        <ListItem>
          <Checkbox
            checked={todo.isDone}
            onChange={() => {
              updateFunc(user, todo.id, "updateBoolean", !todo.isDone);
            }}
          />
          <ListItemText
            className="todo-list"
            style={{
              textDecoration: todo.isDone ? "line-through" : "none",
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
      </List>
    </div>
  );
}

export default Todo;
