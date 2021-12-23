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
} from "@mui/material";

function Todo({ todo, updateFunc, deleteFunc }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  return (
    <div>
      <Modal open={open} onClose={(e) => setOpen(false)}>
        <div className="edit-modal">
          <h3>Edit</h3>
          <form>
            <FormControl
              className="todo-edit-form"
              sx={{ marginBottom: "1rem" }}
            >
              <InputLabel>Edit a Task</InputLabel>
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </FormControl>
          </form>
          <Button
            onClick={() => {
              updateFunc(todo.id, input);
              setInput("");
              setOpen(false);
            }}
          >
            Update Task
          </Button>
        </div>
      </Modal>
      <List>
        <ListItem>
          <ListItemText
            className="todo-list"
            style={{
              textDecoration: todo.isDone ? "line-through" : "none",
            }}
            primary={todo.task}
            secondary="Some Deadline ⏰"
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
