import React from "react";
import { CircularProgress, Box } from "@mui/material";

const Loader = ({ size = 40 }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
    >
      <CircularProgress size={size} />
    </Box>
  );
};

export default Loader;
