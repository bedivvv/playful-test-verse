import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import { Box } from "@mui/material";

import routes from "../routes";

function Auth() {
  useEffect(() => {
    document.body.classList.add("bg-default");
    return () => {
      document.body.classList.remove("bg-default");
    };
  }, []);

  const getRoutes = (routes: any[]) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route key={key} path={prop.path} element={<prop.component />} />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <Box>
      <Box>
        <Routes>{getRoutes(routes)}</Routes>
      </Box>
    </Box>
  );
}

export default Auth;
