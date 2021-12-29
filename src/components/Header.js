import React from "react";
import { useUserStatus } from "../user-context";
import { UserSignOut } from "../firebase";

function Header() {
  const { user, setUser } = useUserStatus();

  return (
    <div className="header">
      <div className="brand">
        <p className="brand-name">Task Management System</p>
      </div>
      <div className="username-display">
        <p>{!(user === "tasks") && user}</p>
      </div>
      <div className="sign-out-btn">
        <button
          style={{ display: user === "tasks" ? "none" : "block" }}
          onClick={(e) => {
            e.preventDefault();
            UserSignOut();
            setUser("tasks");
          }}
        >
          SIGN OUT
        </button>
      </div>
    </div>
  );
}

export default Header;
