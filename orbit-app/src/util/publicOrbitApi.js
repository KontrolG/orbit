import axios from "axios";

const sanitizeBody = (object) => {
  const sanitizedObject = { ...object };
  Object.keys(sanitizedObject).forEach((key) => {
    const value = sanitizedObject[key];
    switch (typeof value) {
      case "string":
        return (sanitizedObject[key] = value.trim());

      default:
    }
  });

  return sanitizedObject;
};
const getResponseData = (response) => response.data;

const publicFetch = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});


export const signUp = ({ email, ...signUpData }) =>
  publicFetch({
    method: "POST",
    url: "/signup",
    data: sanitizeBody({
      email: email?.toLowerCase?.(),
      ...signUpData
    })
  }).then(getResponseData);

export const authenticate = ({ email = "", password = "" }) =>
  publicFetch({
    method: "POST",
    url: "/authenticate",
    data: sanitizeBody({
      email: email?.toLowerCase?.(),
      password
    })
  }).then(getResponseData);

export const getNewToken = () =>
  publicFetch({
    method: "GET",
    url: "/token/refresh"
  }).then(getResponseData);
