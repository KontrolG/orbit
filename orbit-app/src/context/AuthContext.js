import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { FetchContext } from "./FetchContext";

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const history = useHistory();
  const { publicFetch, authAxios } = useContext(FetchContext);

  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true,
    userInfo: null
  });

  const setAuthInfo = ({ userInfo }) => {
    setAuthState({
      userInfo,
      isLoading: false,
      isAuthenticated: Boolean(userInfo && userInfo?._id)
    });
  };

  const logout = async () => {
    try {
      await authAxios.post("/logout");
      setAuthInfo({ userInfo: null });
      history.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const isAdmin = () => {
    return authState.userInfo?.role === "admin";
  };

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await publicFetch.get("/user-info");
        const userInfo = response.data?.userInfo;
        setAuthInfo({ userInfo });
      } catch (error) {
        setAuthInfo({ userInfo: null });
      }
    }

    fetchUserInfo();
  }, []);

  return (
    <Provider
      value={{
        authState,
        setAuthState: (authInfo) => setAuthInfo(authInfo),
        logout,
        isAuthenticated: authState.isAuthenticated,
        isAdmin
      }}
    >
      {children}
    </Provider>
  );
};

export { AuthContext, AuthProvider };
