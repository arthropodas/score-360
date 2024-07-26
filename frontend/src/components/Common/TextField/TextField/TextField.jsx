import React from "react";
import {TextField, ThemeProvider, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";
import theme from "../../../../theme/Theme";

const TextBox = ({
  borderRadius,
  type,
  name,
  title,
  label,
  InputProps,
  required = false,
  disabled,
  error,
  helperText,
  inputLabelProps,
  ...otherProps

}) => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  return (
    <div>
      <ThemeProvider theme={theme}></ThemeProvider>
      <TextField
        variant="outlined"
        
      
        margin={isSmallScreen ? "dense" : "normal"}
        fullWidth={!isSmallScreen}
        label={label}
        type={type}
        name={name}
        title={title}
        required={required}
        error={error}
       InputLabelProps={inputLabelProps || {shrink:true} }
        InputProps={{
          ...InputProps,
        
        }}
        {...otherProps}
        disabled={disabled}
        helperText={helperText}
        backgroundColor="transparent"
        sx={{
          borderRadius: borderRadius,
          width: isSmallScreen ? "250px" : "251px",
          

       
          // background: "rgba(255, 255, 255, 0.9)",
          '& .MuiOutlinedInput-root': {
            borderRadius: {borderRadius}, 
          },
          '& .MuiOutlinedInput-input': {
            paddingRight: {borderRadius}, 
            fontSize: "10px",
          },
          '.MuiInputBase-input': { fontSize: '14px' },
          '& .MuiFormHelperText-root': {
            backgroundColor: "transparent", // Change background color here
          },
        }}
      />
    </div>
  );
};

export default TextBox;

TextBox.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  InputProps: PropTypes.object,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  helperText: PropTypes.string,
  borderRadius: PropTypes.string,
  inputLabelProps: PropTypes.object,
};
