import { Button } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/system";

const SubmitButton = ({ name, title, disabled, datatestid,borderRadius,onClick,marginTop,boxStyle,marginBottom,height}) => {
  return (
    <Box style={boxStyle}> 
      <Button 
        variant="contained" 
        color="primary"
        fullWidth
        sx={{
          height: height || '38px',
          width: '100px', 
          marginTop:marginTop || 2 ,
          backgroundColor: "#2e7d32",
          color: "white",
          padding:0,
          marginBottom:marginBottom||0,
          borderRadius:borderRadius,
          textTransform: 'capitalize',
          fontFamily: 'Arial, sans-serif',
          "&:hover": {
            backgroundColor: "#1b5e20",
           
          },
        }}
        onClick={onClick}
        type="submit"
        title={title}
        disabled={disabled}
        data-testid={datatestid}
      >
        {name}
      </Button> 
      </Box> 
  );
};

export default SubmitButton;

SubmitButton.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  datatestid: PropTypes.string,
  borderRadius:PropTypes.string,
  onClick:PropTypes.func,
  marginTop:PropTypes.number,
  boxStyle:PropTypes.object,
  height:PropTypes.string




};