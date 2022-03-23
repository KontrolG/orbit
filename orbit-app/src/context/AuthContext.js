import React, { createContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { getNewToken } from "../util/publicOrbitApi";

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const history = useHistory();

  const token = localStorage.getItem("token");
  const userInfo = localStorage.getItem("userInfo");
  const expiresAt = localStorage.getItem("expiresAt");

  const [authState, setAuthState] = useState({
    token,
    expiresAt,
    userInfo: userInfo ? JSON.parse(userInfo) : {}
  });

  const setAuthInfo = ({ token, userInfo, expiresAt }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    localStorage.setItem("expiresAt", expiresAt);

    setAuthState({
      token,
      userInfo,
      expiresAt
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("expiresAt");
    setAuthState({});
    history.push("/login");
  };

  const isAuthenticated = () => {
    if (!authState.token || !authState.expiresAt) {
      return false;
    }
    return new Date().getTime() / 1000 < authState.expiresAt;
  };

  const isAdmin = () => {
    return authState.userInfo.role === "admin";
  };

  function getAccessToken() {
    return localStorage.getItem("token");
  }

  async function refreshAuthHeaders(failedRequest) {
    try {
      const { token: newToken } = await getNewToken();
      localStorage.setItem("token", newToken);
      failedRequest.response.config.headers[
        "Authorization"
      ] = `Bearer ${newToken}`;
      return Promise.resolve();
    } catch (error) {
      // Do stuff here
      throw error;
    }
  }

  return (
    <Provider
      value={{
        authState,
        setAuthState: (authInfo) => setAuthInfo(authInfo),
        logout,
        isAuthenticated,
        isAdmin,
        refreshAuthHeaders,
        getAccessToken
      }}
    >
      {children}
    </Provider>
  );
};

export { AuthContext, AuthProvider };
