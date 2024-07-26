import React from "react";
import { Modal, Box, Typography, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";


const CustomModal = ({ open, handleClose,width,padding, children,height,maxHeight }) => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  return (
    <Modal
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: isSmallScreen ? "80%" : width ||"300px", 
          maxHeight: maxHeight ||"500px",
          height:height || '750px',
  
          padding: padding ||"20px", 
          backgroundColor: { xs: "white", md: "white" }, 
          overflowY: "auto", 
          "&::-webkit-scrollbar": { 
            width: "auto", 
          },
          display: "flex", 
          flexDirection: "column",
          justifyContent:'center',
          alignItems: "center",
        }}
      >
        <Typography variant="body1">{children}</Typography>   
      </Box> 
    </Modal> 
  );
};

CustomModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
  children: PropTypes.node.isRequired,
  width:PropTypes.string,
  padding:PropTypes.string,
  maxHeight:PropTypes.string,
  height:PropTypes.string,
};

export default CustomModal;
