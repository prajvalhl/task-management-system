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

function Todo({ todo, updateFunc, deleteFunc }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [dateTimeInput, setDateTimeInput] = useState("");

  return (
    <div>
      <Modal open={open} onClose={(e) => setOpen(false)}>
        <div className="edit-modal">
          <h3>Edit</h3>
          <form>
            <FormControl className="todo-edit-form">
              <InputLabel>Edit a Task</InputLabel>
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </FormControl>
            <br />
            <br />
            <InputLabel>Pick a Deadline</InputLabel>
            <FormControl>
              <Input
                type="datetime-local"
                className="datetime"
                value={dateTimeInput}
                onChange={(e) => setDateTimeInput(e.target.value)}
              />
            </FormControl>
          </form>
          <br />
          <Button
            disabled={!input && !dateTimeInput}
            onClick={() => {
              updateFunc(
                todo.id,
                "updateTitle",
                input ? input : todo.task,
                dateTimeInput ? getDateTime(dateTimeInput) : todo.deadline
              );
              setInput("");
              setDateTimeInput("");
              setOpen(false);
            }}
          >
            Update Task
          </Button>
        </div>
      </Modal>
      <List>
        <ListItem>
          <Checkbox
            checked={todo.isDone}
            onChange={() => {
              updateFunc(todo.id, "updateBoolean", !todo.isDone);
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
            }}
          >
            <span className="material-icons">edit</span>
          </Button>
          <Button
            onClick={() => {
              deleteFunc(todo.id);
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
