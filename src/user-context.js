import { createContext, useContext, useState } from "react";

const User = createContext();

export function UserStatusProvider({ children }) {
  const [user, setUser] = useState("tasks");
  return <User.Provider value={{ user, setUser }}>{children}</User.Provider>;
}

export function useUserStatus() {
  return useContext(User);
}
