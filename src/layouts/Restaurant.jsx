import React, { useRef, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Container } from "@mui/material";
import AdminNavbar from "../components/Navbars/AdminNavbar";
import AdminFooter from "../components/Footers/AdminFooter";

import routes from "../routes";

function Restaurant(props) {
  const divRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    divRef.current.scrollTop = 0;
  }, []);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/restaurant") {
        return (
          <Route path={prop.path} element={<prop.component />} key={key} />
        );
      } else {
        return null;
      }
    });
  };
  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  return (
    <>
      <div ref={divRef}>
        <AdminNavbar {...props} brandText={getBrandText(location.pathname)} />
        <Routes>{getRoutes(routes)}</Routes>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
}

export default Restaurant;
