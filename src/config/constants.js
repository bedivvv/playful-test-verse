import { useContext } from "react";
import ConfigurationContext from "../context/Configuration";

const ConfigurableValues = () => {
  const configuration = useContext(ConfigurationContext);

  // Environment variables with fallbacks
  const GRAPHQL_URL =
    import.meta.env.VITE_GRAPHQL_URL || "http://localhost:8001/graphql";
  const SERVER_URL =
    import.meta.env.VITE_SERVER_URL || "http://localhost:8001/graphql";
  const WS_SERVER_URL =
    import.meta.env.VITE_WS_SERVER_URL || "ws://localhost:8001/graphql";
  const GOOGLE_MAPS_KEY =
    import.meta.env.VITE_GOOGLE_MAPS_KEY ||
    "AIzaSyCrSZxTEqjc5qnyg4EghQVJz2I6KuEcuwg";

  // Firebase configuration from context (these come from the backend configuration)
  const FIREBASE_KEY = configuration.firebaseKey;
  const APP_ID = configuration.appId;
  const AUTH_DOMAIN = configuration.authDomain;
  const STORAGE_BUCKET = configuration.storageBucket;
  const MSG_SENDER_ID = configuration.msgSenderId;
  const MEASUREMENT_ID = configuration.measurementId;
  const PROJECT_ID = configuration.projectId;
  const SENTRY_DSN = configuration.dashboardSentryUrl;

  // Cloudinary configuration
  const CLOUDINARY_UPLOAD_URL =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_URL ||
    "https://api.cloudinary.com/v1_1/dmn1wepuv/image/upload";
  const CLOUDINARY_FOOD = import.meta.env.VITE_CLOUDINARY_FOOD || "cmi6flk9";

  // VAPID Key for push notifications
  const VAPID_KEY =
    import.meta.env.VITE_VAPID_KEY ||
    "BOpVOtmawD0hzOR0F5NQTz_7oTlNVwgKX_EgElDnFuILsaE_jWYPIExAMIIGS-nYmy1lhf2QWFHQnDEFWNG_Z5w";

  // Version configuration
  const PAID_VERSION = configuration.isPaidVersion;

  return {
    GRAPHQL_URL,
    GOOGLE_MAPS_KEY,
    FIREBASE_KEY,
    APP_ID,
    AUTH_DOMAIN,
    STORAGE_BUCKET,
    MSG_SENDER_ID,
    MEASUREMENT_ID,
    PROJECT_ID,
    SERVER_URL,
    WS_SERVER_URL,
    SENTRY_DSN,
    CLOUDINARY_UPLOAD_URL,
    CLOUDINARY_FOOD,
    VAPID_KEY,
    PAID_VERSION,
  };
};

export default ConfigurableValues;
