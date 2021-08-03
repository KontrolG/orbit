import React from "react";
import { Route, Switch } from "react-router-dom";
import AppShell from "./AppShell";
import * as PATHS from "./constants/paths";
import Account from "./pages/Account";
import Dashboard from "./pages/Dashboard";
import FourOFour from "./pages/FourOFour";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import Users from "./pages/Users";

export function AppRoutes() {
  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path={PATHS.DASHBOARD_PATH}>
        <AppShell>
          <Dashboard />
        </AppShell>
      </Route>
      <Route path="/inventory">
        <AppShell>
          <Inventory />
        </AppShell>
      </Route>
      <Route path="/account">
        <AppShell>
          <Account />
        </AppShell>
      </Route>
      <Route path="/settings">
        <AppShell>
          <Settings />
        </AppShell>
      </Route>
      <Route path="/users">
        <AppShell>
          <Users />
        </AppShell>
      </Route>
      <Route path="*">
        <FourOFour />
      </Route>
    </Switch>
  );
}
