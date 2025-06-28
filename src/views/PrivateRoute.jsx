import React from "react";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("user-enatega");

  return isAuthenticated ? children : <Navigate to="/auth/login" replace />;
};
