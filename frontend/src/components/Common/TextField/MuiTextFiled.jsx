import { TextField } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import { ThemeProvider } from "@emotion/react";
import theme from "../../../theme/Theme";
import { createTheme } from "@mui/system";
import { green } from "@mui/material/colors";

const customTheme = createTheme(theme, {
  components: {
    MuiTextField: {
      styleOverrides: {
        "& .MuiOutlinedInput-root": {
          backgroundColor: "transparent", // Make the TextField background transparent
        },
      },
    },
    MuiPickersDay: {
      daySelected: {
        backgroundColor: green[500], // Set the selection color to green
        "&:hover": {
          backgroundColor: green[700], // Change color on hover if needed
        },
      },
    },
  },
});
const 
MuiTextField = ({
  registerProps,
  textAlign,
  error,
  required,
  width,
  minDate,
  ...otherProps
}) => {
  const label = (
    <>
      {otherProps.label} {required && <span style={{ color: "red" }}>*</span>}
    </>
  );

  return (
    <ThemeProvider theme={customTheme}>
    <TextField
      fullWidth
      
      backgroundColor="transparent"
      sx={{
      
        background: "transparent",
        textAlign:textAlign && 'left'
      }}
      width={width}
      margin="normal"
      variant="outlined"
      {...registerProps}
      error={!!error}
      {...otherProps}
      label={label}
      inputLabelProps={{ shrink: true }}
      
      minDate = {minDate}
    />
    </ThemeProvider>
  );
};

MuiTextField.propTypes = {
  registerProps: PropTypes.object.isRequired,
  error: PropTypes.string,
  value: PropTypes.string,
  width: PropTypes.string,
  required: PropTypes.string,
  textAlign: PropTypes.string
};
export default MuiTextField;
