
import React, { ReactNode } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useJsApiLoader } from '@react-google-maps/api'

interface GoogleMapsLoaderProps {
  children: ReactNode;
  GOOGLE_MAPS_KEY: string;
}

const GoogleMapsLoader: React.FC<GoogleMapsLoaderProps> = ({ children, GOOGLE_MAPS_KEY }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_KEY,
    libraries: [
      'drawing',
      'places',
      'geometry',
      'localContext',
      'visualization'
    ]
  })
  console.log('isLoaded ', isLoaded)
  if (!isLoaded) {
    return (
      <Box
        component="div"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        width="100vw">
        <CircularProgress color="primary" />
      </Box>
    )
  }

  return <>{children}</>
}
export default GoogleMapsLoader
