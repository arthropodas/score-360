
import React from "react";
import Box from "@mui/material/Box";
import backgroundImage from "../../../assets/loginBackground.png";

function NotFound() {
  return (
    <div>
        <Box
        sx={{
        
          left: 0,
          right: 0,
      
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          border: "1px solid #ccc",
        
          borderRadius: "5px",
          padding: "16px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#eceff1",

          maxWidth: "100%",
          zIndex: 999,
          "@media (max-width: 600px)": {
            maxWidth: "100%",
            borderRadius: "5px",
            boxShadow: "none",
          },
        }}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "800px",
        }}
      >
        <h1>404 - Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      </Box>
      
    </div>
  );
}

export default NotFound;