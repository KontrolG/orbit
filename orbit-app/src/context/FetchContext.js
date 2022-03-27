import React, { createContext, useEffect } from "react";
import axios from "axios";

const FetchContext = createContext();
const { Provider } = FetchContext;

const FetchProvider = ({ children }) => {
  const authAxios = axios.create({
    baseURL: process.env.REACT_APP_API_URL
  });

  const publicFetch = axios.create({
    baseURL: process.env.REACT_APP_API_URL
  });

  authAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const code = error && error.response ? error.response.status : 0;
      if (code === 401 || code === 403) {
        console.log("error code", code);
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

  return (
    <Provider
      value={{
        authAxios,
        publicFetch
      }}
    >
      {children}
    </Provider>
  );
};

export { FetchContext, FetchProvider };
