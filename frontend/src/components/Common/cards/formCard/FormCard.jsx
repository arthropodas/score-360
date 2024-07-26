import PropTypes from "prop-types";
import React from "react";
import { Card, CardContent } from "@mui/material";

export default function FormCard({
  children,
  width,
  margin,
  align,
  padding,
  height,
}) {
  return (
    <Card
      style={{  
        width, 
        margin, 
        textAlign: align, 
        padding,
        height, 
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)", 
        backgroundColor: "transparent", 
        background: "rgba(255, 255, 255, 0.9)" 
      }}
    >
      <CardContent>{children}</CardContent> 
    </Card> 
  );
}

FormCard.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.string,
  margin: PropTypes.string,
  align: PropTypes.string,
  padding: PropTypes.string,
  height: PropTypes.string,
};
