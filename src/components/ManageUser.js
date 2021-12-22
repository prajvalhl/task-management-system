import React, { useState } from "react";
import "../styles/ManageUser.css";
import { Button, FormControl, Input, InputLabel } from "@mui/material";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useUserStatus } from "../user-context";

function ManageUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const { user, setUser } = useUserStatus();

  function registerUser(email, pass, confirmPass) {
    if (email && pass === confirmPass) {
      createUser(email, pass);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } else {
      alert("passwords don't match");
    }
  }

  // creating a user
  async function createUser(email, password) {
    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(credentials.user.email);
    } catch (e) {
      alert(e.message);
    }
  }

  // sign in a user
  async function userSignIn(email, password) {
    try {
      const credentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(credentials.user.email);
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="manage-user">
      <div className="user-credentials-form">
        <h1>Log In</h1>
        <form>
          <FormControl>
            <InputLabel>Email</InputLabel>
            <Input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </FormControl>
          <br />
          <br />
          <FormControl>
            <InputLabel>Password</InputLabel>
            <Input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </FormControl>
          <br />
          <br />
          <Button
            type="submit"
            variant="contained"
            onClick={(e) => {
              e.preventDefault();
              userSignIn(loginEmail, loginPassword);
            }}
          >
            Login
          </Button>
        </form>
      </div>
      <div>
        <p>OR</p>
      </div>
      <div className="user-credentials-form">
        <h1>Sign Up</h1>
        <form>
          <FormControl>
            <InputLabel>Email</InputLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
          <br />
          <br />
          <FormControl>
            <InputLabel>Password</InputLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>
          <br />
          <br />
          <FormControl>
            <InputLabel>Confirm Password</InputLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </FormControl>
          <br />
          <br />
          <Button
            disabled={!email || !password || !confirmPassword}
            type="submit"
            variant="contained"
            onClick={async (e) => {
              e.preventDefault();
              const res = await registerUser(email, password, confirmPassword);
              console.log(res);
            }}
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ManageUser;
