import { useAuth0 } from "@auth0/auth0-react";
import React, { useContext } from "react";
import { FetchContext } from "../context/FetchContext";
import jwt from "jsonwebtoken";

const AuthStateItem = ({ title, value }) => (
  <div className="text-sm">
    <p className="font-bold mb-2">{title}</p>
    <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded">
      <code className="break-all">{value}</code>
    </pre>
  </div>
);

const AuthDebugger = () => {
  const { accessToken } = useContext(FetchContext);
  const { user } = useAuth0();

  return (
    <section className="rounded-lg shadow bg-white p-4">
      <div className="mb-2">
        <AuthStateItem title="Token" value={accessToken} />
      </div>
      <div className="mb-2">
        <AuthStateItem
          title="Token Info"
          value={JSON.stringify(jwt.decode(accessToken), null, 2)}
        />
      </div>
      <div className="mb-2">
        <AuthStateItem
          title="User Info"
          value={JSON.stringify(user, null, 2)}
        />
      </div>
    </section>
  );
};

export default AuthDebugger;
