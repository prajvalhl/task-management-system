import React from "react";
import { useUserStatus } from "../user-context";
import { UserSignOut } from "../firebase";

function Header() {
  const { user, setUser } = useUserStatus();

  return (
    <div className="header">
      <div>
        <p className="brand-name">Task Management System</p>
      </div>
      <div>
        <p>{!(user === "tasks") && `Welcome, ${user}`}</p>
      </div>
      <div>
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
