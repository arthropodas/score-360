import React from 'react';
import { Box, Typography } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import PropTypes from "prop-types";
const NoDataMessage = ({ message }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="500px"
    >
      <Box
        p={2}
        bgcolor="#f0f0f0"
        borderRadius={8}
        boxShadow={2}
        textAlign="center"
        
      >
        <SentimentVeryDissatisfiedIcon sx={{ fontSize: 48, color: '#6c757d' }} />
        <Typography variant="h6" color="textSecondary" mt={2}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
};


NoDataMessage.propTypes = {
    message: PropTypes.string
}

export default NoDataMessage;
