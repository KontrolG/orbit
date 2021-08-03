import React, { createContext, useContext, useState } from "react";
import * as publicOrbitApi from "../util/publicOrbitApi";

const AuthContext = createContext();
const { Provider } = AuthContext;

const initialAuthState = {
  token: null,
  expiresAt: null,
  userInfo: {}
};

function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(initialAuthState);

  async function signUpWithEmail({
    email = "",
    firstName = "",
    lastName = "",
    password = ""
  }) {
    const response = await publicOrbitApi.signUp({
      email,
      firstName,
      lastName,
      password
    });
    const { token, userInfo, expiresAt, message } = response;
    setAuthState({ token, userInfo, expiresAt });
    return { message, userInfo };
  }

  async function signInWithEmail({ email = "", password = "" }) {
    const response = await publicOrbitApi.authenticate({
      email,
      password
    });
    const { token, userInfo, expiresAt, message } = response;
    setAuthState({ token, userInfo, expiresAt });
    return { message, userInfo };
  }

  return (
    <Provider value={{ authState, signUpWithEmail, signInWithEmail }}>
      {children}
    </Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth should be used within a AuthProvider");
  }
  return context;
}

export { AuthContext, AuthProvider, useAuth };
