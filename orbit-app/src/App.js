import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { AppRoutes } from "./AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { FetchProvider } from "./context/FetchContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <FetchProvider>
          <div className="bg-gray-100">
            <AppRoutes />
          </div>
        </FetchProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
