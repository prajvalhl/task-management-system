import React from "react";
import { useUserStatus } from "../user-context";

function Header() {
  const { user } = useUserStatus();

  return (
    <div className="header">
      <p className={user === "tasks" ? "signOutHeader" : "signInHeader"}>
        Task Management System
      </p>
      {!(user === "tasks") && `Welcome, ${user}`}
    </div>
  );
}

export default Header;
