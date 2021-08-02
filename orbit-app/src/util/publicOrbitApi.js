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

const publicFetch = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

const getResponseData = (response) => response.data;

export const signUpWithEmail = ({
  email = "",
  firstName = "",
  lastName = "",
  password = ""
}) =>
  publicFetch({
    method: "POST",
    url: "/signup",
    data: sanitizeBody({
      email: email?.toLowerCase?.(),
      firstName,
      lastName,
      password
    })
  }).then(getResponseData);
