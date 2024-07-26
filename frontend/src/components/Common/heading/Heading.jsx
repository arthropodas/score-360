
import React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";

const Heading = ({
  text,
  variant = "primary",
  fontSize,
  color,
  fontStyle,
  ...props
}) => {
  let componentVariant;
  switch (variant) {
    case "primary":
      componentVariant = "h1";
      break;
    case "secondary":
      componentVariant = "h2";
      break;
    case "tertiary":
      componentVariant = "h3";
      break;
    default:
      componentVariant = "h1";
  }

  const style = {
    fontSize,
    color,
    fontStyle,
  };

  return (
    <Typography variant={componentVariant} style={style} {...props}>
      {text}
    </Typography>
  );
};

export default Heading;

Heading.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "tertiary"]),
  fontSize: PropTypes.string,
  color: PropTypes.string,
  fontStyle: PropTypes.string,
};
