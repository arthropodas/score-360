import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export const HoverLink = ({ to, children, ...rest }) => {
  return (
    <Link to={to} {...rest}>
      {children}
    </Link>
  );
};

HoverLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.string,
};
