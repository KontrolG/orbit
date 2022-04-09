import React, { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const FetchContext = createContext();
const { Provider } = FetchContext;

const FetchProvider = ({ children }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState("");

  const authAxios = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const publicFetch = axios.create({
    baseURL: process.env.REACT_APP_API_URL
  });

  const getAccessToken = useCallback(
    async function () {
      try {
        const accessToken = await getAccessTokenSilently();
        setAccessToken(accessToken);
      } catch (error) {
        console.log(error);
      }
    },
    [getAccessTokenSilently]
  );

  authAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const code = error && error.response ? error.response.status : 0;
      if (code === 401) {
        console.log("error code", code);
        getAccessToken();
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    async function fetchCsrfToken() {
      try {
        const {
          data: { csrfToken }
        } = await publicFetch.get("/csrf-token");
        publicFetch.defaults.headers.common["X-CSRF-Token"] = csrfToken;
        authAxios.defaults.headers.common["X-CSRF-Token"] = csrfToken;
      } catch (error) {
        console.log(error);
      }
    }

    fetchCsrfToken();
  }, []);

  useEffect(() => {
    getAccessToken();
  }, [getAccessToken]);

  return (
    <Provider
      value={{
        authAxios,
        publicFetch,
        accessToken
      }}
    >
      {children}
    </Provider>
  );
};

export { FetchContext, FetchProvider };
