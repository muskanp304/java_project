import React, { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import { contactAPI } from  "./services/api";

const App = () => {
  const [currentPage, setCurrentPage] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
  contactAPI.logout(); // Clear token
  setIsAuthenticated(false);
  setCurrentUser(null);
  setCurrentPage("login");
};

  const handleRegister = (userData) => {
    alert("Registration successful! Please login.");
    setCurrentPage("login");
  };

  return (
    <div className="app-container">
      {!isAuthenticated ? (
        <>
          {currentPage === "login" && (
            <Login onLogin={handleLogin} goToRegister={() => setCurrentPage("register")} />
          )}
          {currentPage === "register" && (
            <Register onRegister={handleRegister} goToLogin={() => setCurrentPage("login")} />
          )}
        </>
      ) : (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
