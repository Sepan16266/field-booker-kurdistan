import React, { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import Home from "./pages/home";
import Admin from "./pages/admin";
import Login from "./pages/login";
import NotFound from "./pages/not-found";
import Footer from "./components/footer";
import Header from "./components/header";

function Router() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      // Decode token to get user role
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("auth_token");
      }
    }
    setIsLoading(false);
  }, []);

  // Listen for login events
  useEffect(() => {
    const handleLogin = () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUserRole(payload.role);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem("auth_token");
        }
      }
    };

    window.addEventListener('userLoggedIn', handleLogin);
    return () => window.removeEventListener('userLoggedIn', handleLogin);
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

  if (isLoading) {
    return React.createElement(
      "div",
      { className: "min-h-screen flex items-center justify-center" },
      React.createElement(
        "div",
        { className: "text-center" },
        React.createElement("div", {
          className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
        }),
        React.createElement("p", { className: "mt-2 text-gray-600" }, "جاري التحميل...")
      )
    );
  }

  if (!isAuthenticated) {
    return React.createElement(Login);
  }

  return React.createElement(
    "div",
    { className: "min-h-screen flex flex-col" },
    React.createElement(Header, { userRole, onLogout: handleLogout }),
    React.createElement(
      "main",
      { className: "flex-1" },
      React.createElement(
        "div",
        null,
        React.createElement(Route, {
          path: "/",
          children: () => React.createElement(Home)
        }),
        userRole === "admin" && React.createElement(Route, {
          path: "/admin",
          children: () => React.createElement(Admin)
        })
      )
    ),
    React.createElement(Footer)
  );
}

function App() {
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    React.createElement(Router)
  );
}

export default App;
