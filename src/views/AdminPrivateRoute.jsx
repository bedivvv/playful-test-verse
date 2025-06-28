import React from "react";
import { Navigate } from "react-router-dom";

export const AdminPrivateRoute = ({ children }) => {
  const userString = localStorage.getItem("user-enatega");

  if (!userString) {
    return <Navigate to="/auth/login" replace />;
  }

  try {
    const user = JSON.parse(userString);
    if (user.userType === "ADMIN") {
      return children;
    } else {
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    return <Navigate to="/auth/login" replace />;
  }
};
