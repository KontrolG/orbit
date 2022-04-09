import React, { lazy, Suspense, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import "./App.css";

import { FetchProvider } from "./context/FetchContext";

import AppShell from "./AppShell";

import Home from "./pages/Home";
import FourOFour from "./pages/FourOFour";
import logo from "./images/logo.png";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Inventory = lazy(() => import("./pages/Inventory"));
const Account = lazy(() => import("./pages/Account"));
const Settings = lazy(() => import("./pages/Settings"));
const Users = lazy(() => import("./pages/Users"));

const LoadingFallback = () => (
  <AppShell>
    <div className="p-4">Loading...</div>
  </AppShell>
);

const UnauthenticatedRoutes = () => (
  <Switch>
    <Route exact path="/">
      <Home />
    </Route>
    <Route path="*">
      <FourOFour />
    </Route>
  </Switch>
);

const AuthenticatedRoute = ({ children, ...rest }) => {
  const { isAuthenticated } = useAuth0();

  return (
    <Route
      {...rest}
      render={() =>
        isAuthenticated ? <AppShell>{children}</AppShell> : <Redirect to="/" />
      }
    ></Route>
  );
};

const AdminRoute = ({ children, ...rest }) => {
  const { isAuthenticated } = useAuth0();

  // TODO: Add check for is admin.

  return (
    <Route
      {...rest}
      render={() =>
        isAuthenticated ? <AppShell>{children}</AppShell> : <Redirect to="/" />
      }
    ></Route>
  );
};

function LoadingAuthenticationFallback() {
  return (
    <div className="h-screen flex justify-center items-center">
      <img src={logo} alt="Logo" width={160} height={54} />
    </div>
  );
}

const AppRoutes = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <LoadingAuthenticationFallback />;
  }

  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Switch>
          <AuthenticatedRoute path="/dashboard">
            <Dashboard />
          </AuthenticatedRoute>
          <AdminRoute path="/inventory">
            <Inventory />
          </AdminRoute>
          <AuthenticatedRoute path="/account">
            <Account />
          </AuthenticatedRoute>
          <AuthenticatedRoute path="/settings">
            <Settings />
          </AuthenticatedRoute>
          <AuthenticatedRoute path="/users">
            <Users />
          </AuthenticatedRoute>
          <UnauthenticatedRoutes />
        </Switch>
      </Suspense>
    </>
  );
};

const permissions = [
  "delete:inventory",
  "edit:inventory",
  "edit:user",
  "read:dashboard",
  "read:inventory",
  "read:user",
  "read:users",
  "write:inventory"
];

const auth0Scope = permissions.join(" ");

function App() {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      redirectUri={`${window.location.origin}/dashboard`}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
      scope={auth0Scope}
    >
      <Router>
        <FetchProvider>
          <div className="bg-gray-100">
            <AppRoutes />
          </div>
        </FetchProvider>
      </Router>
    </Auth0Provider>
  );
}

export default App;
