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
  Box,
} from "@mui/material";

function Todo(props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  return (
    <div>
      <Modal open={open} onClose={(e) => setOpen(false)}>
        <div className="edit-modal">
          <h3>Edit</h3>
          <form>
            <FormControl className="todo-edit-form">
              <InputLabel>Edit a Task</InputLabel>
              <Input
                placeholder={props.todo.task}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </FormControl>
          </form>
          <br />
          <Button
            disabled={!input}
            onClick={() => {
              props.updateFunc(props.todo.id, "updateTitle", input);
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
          <Checkbox
            checked={props.todo.isDone}
            onChange={() => {
              props.updateFunc(
                props.todo.id,
                "updateIsDone",
                !props.todo.isDone
              );
            }}
          />
          <ListItemText
            className="todo-list"
            style={{
              textDecoration: props.todo.isDone ? "line-through" : "none",
            }}
            primary={props.todo.task}
            secondary="Some Deadline ⏰"
          />
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            <span className="material-icons">edit</span>
          </Button>
          <Button
            onClick={() => {
              props.deleteFunc(props.todo.id);
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
