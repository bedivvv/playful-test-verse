
import React, { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import GoogleMapsLoader from "./components/GoogleMapsLoader/GoogleMapsLoader";
import { Box, CircularProgress } from "@mui/material";
import AdminLayout from "./layouts/Admin.jsx";
import RestaurantLayout from "./layouts/Restaurant.jsx";
import AuthLayout from "./layouts/Auth";
import SuperAdminLayout from "./layouts/SuperAdmin.jsx";
import { PrivateRoute } from "./views/PrivateRoute";
import { AdminPrivateRoute } from "./views/AdminPrivateRoute";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { isFirebaseSupported, initialize } from "./firebase";
import { uploadToken } from "./apollo";
import { gql, useApolloClient } from "@apollo/client";
import ErrorBoundary from "./components/ErrorBoundary";
import "./i18n";

const UPLOAD_TOKEN = gql`
  ${uploadToken}
`;

const App = () => {
  // Load configuration with error handling
  let ConfigurableValues;
  try {
    ConfigurableValues = require("./config/constants").default;
  } catch (error) {
    console.error("Failed to load configuration:", error);
    ConfigurableValues = () => ({
      VAPID_KEY: '',
      FIREBASE_KEY: '',
      AUTH_DOMAIN: '',
      PROJECT_ID: '',
      STORAGE_BUCKET: '',
      MSG_SENDER_ID: '',
      APP_ID: '',
      MEASUREMENT_ID: '',
      GOOGLE_MAPS_KEY: ''
    });
  }

  const {
    VAPID_KEY,
    FIREBASE_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MSG_SENDER_ID,
    APP_ID,
    MEASUREMENT_ID,
    GOOGLE_MAPS_KEY,
  } = ConfigurableValues();
  console.log("GOOGLE_MAPS_KEY_App", GOOGLE_MAPS_KEY);

  const client = useApolloClient();
  const [user] = useState(localStorage.getItem("user-enatega"));
  const userType = localStorage.getItem("user-enatega")
    ? JSON.parse(localStorage.getItem("user-enatega")!).userType
    : null;

  useEffect(() => {
    if (user) {
      const initializeFirebase = async () => {
        try {
          if (await isFirebaseSupported()) {
            const messaging = initialize(
              FIREBASE_KEY,
              AUTH_DOMAIN,
              PROJECT_ID,
              STORAGE_BUCKET,
              MSG_SENDER_ID,
              APP_ID,
              MEASUREMENT_ID
            );
            
            if (messaging) {
              Notification.requestPermission()
                .then((permission) => {
                  if (permission === "granted") {
                    getToken(messaging, {
                      vapidKey: VAPID_KEY,
                    })
                      .then((token) => {
                        localStorage.setItem("messaging-token", token);
                        client
                          .mutate({
                            mutation: UPLOAD_TOKEN,
                            variables: {
                              id: JSON.parse(user).userId,
                              pushToken: token,
                            },
                          })
                          .then(() => {
                            console.log("upload token success");
                          })
                          .catch((error) => {
                            console.log("upload token error", error);
                          });
                      })
                      .catch((err) => {
                        console.log("getToken error", err);
                      });
                  } else {
                    console.log("Notification permission denied or blocked");
                  }
                })
                .catch((error) => {
                  console.log("Permission request error", error);
                });

              onMessage(messaging, function (payload) {
                console.log(payload);
                const notificationTitle = "New Order on Enatega Multivendor";
                const notificationOptions = {
                  body: payload.data?.orderid || 'New notification',
                  icon: "https://multivendor-admin.ninjascode.com/favicon.png",
                };
                const nt = new Notification(notificationTitle, notificationOptions);
                nt.onclick = function (event) {
                  event.preventDefault();
                  window.open("https://multivendor-admin.ninjascode.com/dashboard");
                  nt.close();
                };
              });
            }
          }
        } catch (error) {
          console.error("Firebase initialization failed:", error);
        }
      };
      initializeFirebase();
    }
  }, [
    user,
    client,
    VAPID_KEY,
    FIREBASE_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MSG_SENDER_ID,
    APP_ID,
    MEASUREMENT_ID,
  ]);

  const route = userType
    ? userType === "VENDOR"
      ? "/restaurant/list"
      : "/super_admin/vendors"
    : "/auth/login";

  // Provide a default Google Maps key to prevent blank page
  const googleMapsKey = GOOGLE_MAPS_KEY || 'loading...';

  return (
    <ErrorBoundary>
      <Sentry.ErrorBoundary>
        {googleMapsKey && googleMapsKey !== 'loading...' ? (
          <GoogleMapsLoader GOOGLE_MAPS_KEY={googleMapsKey}>
            <HashRouter basename="/">
              <Routes>
                <Route
                  path="/super_admin/*"
                  element={
                    <AdminPrivateRoute>
                      <SuperAdminLayout />
                    </AdminPrivateRoute>
                  }
                />
                <Route
                  path="/restaurant/*"
                  element={
                    <PrivateRoute>
                      <RestaurantLayout />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/*"
                  element={
                    <PrivateRoute>
                      <AdminLayout />
                    </PrivateRoute>
                  }
                />
                <Route path="/auth/*" element={<AuthLayout />} />
                <Route path="/" element={<Navigate to={route} replace />} />
              </Routes>
            </HashRouter>
          </GoogleMapsLoader>
        ) : (
          <Box
            component="div"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            width="100vw"
            sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            <CircularProgress color="primary" size={60} sx={{ mb: 2 }} />
            <Box sx={{ color: 'white', textAlign: 'center' }}>
              <h2>Loading Application...</h2>
              <p>Setting up your food delivery dashboard</p>
            </Box>
          </Box>
        )}
      </Sentry.ErrorBoundary>
    </ErrorBoundary>
  );
};

const AppWithProfiler = Sentry.withProfiler(App);
AppWithProfiler.displayName = "AppWithProfiler";
export default AppWithProfiler;
