import { Box } from "@mui/system";
import React from "react";

const Footer = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        zIndex:4000,
       position:"relative",
       alignmentBaseline:"bottom",
        bottom: -10,
        alignItems: "center",
        minWidth: "100%",
        height: 40,
        
      }}
    >
      @2024 Copyright score360.com
    </Box>
  );
};
export default Footer;
