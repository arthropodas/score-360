import { Box } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

export const FormContainer = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1px",
        "@media (max-width: 600px)": {
          maxWidth: "100%",
        },
      }}
    >
      {children}
    </Box>
  );
};

FormContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
