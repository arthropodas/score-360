import React from "react";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

import Footer from "../Footer";

const PageWithBorderLayout = ({ children }) => {
  return (
    <div>
      <Box
        sx={{
          position: "fixed",
          top: 60,
          left: 0,
          right: 0,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // Adjusted to space-between
          border: "1px solid #ccc",
          maxHeight: "calc(100vh - 100px)",
          borderRadius: "0px",
        
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#eceff1",
          maxWidth: "100%",
          zIndex: 999,
          paddingBottom:5,
          "@media (max-width: 600px)": {
            maxWidth: "100%",
            borderRadius: "5px",
            boxShadow: "none",
          },
        }}
        style={{
          backgroundColor:"white",
          height:"900px"

        }}
      >
        <div style={{ flex: 1 }}>{children}</div> {/* Content area */}
        <Footer /> {/* Footer stays at the bottom */}
      </Box>
    </div>
  );
};

PageWithBorderLayout.propTypes = {
  children: PropTypes.node,
};

export default PageWithBorderLayout;
