
import React, { ReactNode } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useJsApiLoader } from "@react-google-maps/api";

interface GoogleMapsLoaderProps {
  children: ReactNode;
  GOOGLE_MAPS_KEY: string;
}

// Static libraries array to prevent reloading
const libraries: ("drawing" | "places" | "geometry" | "visualization")[] = [
  "drawing",
  "places",
  "geometry",
  "visualization",
];

const GoogleMapsLoader: React.FC<GoogleMapsLoaderProps> = ({
  children,
  GOOGLE_MAPS_KEY,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_KEY,
    libraries,
  });

  console.log("isLoaded ", isLoaded);
  console.log("loadError ", loadError);

  if (loadError) {
    return (
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
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          Maps loading failed
        </Typography>
        <Typography sx={{ color: 'white', opacity: 0.8 }}>
          Continuing without maps functionality...
        </Typography>
      </Box>
    );
  }

  if (!isLoaded) {
    return (
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
        <Typography sx={{ color: 'white', textAlign: 'center' }}>
          Loading Google Maps...
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

export default GoogleMapsLoader;
