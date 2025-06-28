import React from "react";
import { TailSpin } from "react-loader-spinner";
import { useTheme } from "@mui/material";

const CustomLoader = () => {
  const theme = useTheme();

  return (
    <div style={{ padding: "50px", alignSelf: "center" }}>
      <TailSpin color={theme.palette.error.lightest} height={100} width={100} />
    </div>
  );
};

export default CustomLoader;
