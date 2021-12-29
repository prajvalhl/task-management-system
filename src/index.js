import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./App";
import { UserStatusProvider } from "./user-context";

ReactDOM.render(
  <React.StrictMode>
    <UserStatusProvider>
      <App />
    </UserStatusProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
