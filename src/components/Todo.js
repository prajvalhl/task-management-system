import React from "react";
import "../styles/Todo.css";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
} from "@mui/material";

function Todo(props) {
  return (
    <div>
      <List>
        <ListItem>
          {/* <ListItemAvatar></ListItemAvatar> */}
          <ListItemText
            className="todo-list"
            style={{
              textDecoration: props.todo.isDone ? "line-through" : "none",
            }}
            primary={props.todo.task}
            secondary="Some Deadline ⏰"
          />
        </ListItem>
      </List>
    </div>
  );
}

export default Todo;
