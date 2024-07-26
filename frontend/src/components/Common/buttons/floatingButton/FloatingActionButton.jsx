import React from "react";
import PropTypes from "prop-types";
import Fab from "@mui/material/Fab";

const FloatingActionButton = ({

  title,
  ariaLabel,
  variant,
  icon,
  onClick,
  datatestid,
}) => {
  const handleClick = () => {
  onClick?.();
};

  return ( 
    <Fab
      sx={{
        zIndex:777,
        backgroundColor: "#2e7d32",
        "&:hover": { 
          backgroundColor: "#2e7d32",  
        },
      }}
      title={title}
      aria-label={ariaLabel}
      variant={variant}
      onClick={handleClick} 
      data-testid={datatestid}
    >
      {icon}
    </Fab>
  );
};

FloatingActionButton.propTypes = {

  ariaLabel: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["circular", "extended"]),
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  datatestid: PropTypes.string,
  title:PropTypes.string,
};

export default FloatingActionButton;
