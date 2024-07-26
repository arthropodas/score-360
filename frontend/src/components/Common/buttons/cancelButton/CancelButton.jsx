import { Button } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

const CancelButton = ({ name, title, disabled, onClick, datatestid ,height }) => {
  return (
    <div>
      <Button 
        variant="contained" 
        data-testid={datatestid}
        color="primary"
        fullWidth
        sx={{
          width: "100px",
          marginTop: "16px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          color: "black",
          border: "1px solid white", 
          backgroundColor: "white",
          textTransform: 'capitalize',
          fontFamily: 'Arial, sans-serif',
          height:{height },
          "&:hover": { 
            backgroundColor: "white", 
            color: "black",
            border: "1px solid #82A4A0",  
          },
        }}
        type="submit"
        title={title}
        disabled={disabled}
        onClick={onClick}
      >
        {name}
      </Button>
    </div>
  );
};

export default CancelButton;

CancelButton.propTypes = {
  name: PropTypes.string, 
  title: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  datatestid: PropTypes.string,
  height: PropTypes.string
};
