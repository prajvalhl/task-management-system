import { createContext, useContext, useState } from "react";

const User = createContext();

export function UserStatusProvider({ children }) {
  const [user, setUser] = useState("test@email.com");
  return <User.Provider value={{ user, setUser }}>{children}</User.Provider>;
}

export function useUserStatus() {
  return useContext(User);
}
