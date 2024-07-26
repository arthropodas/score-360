import { IconButton } from '@mui/material'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import PropTypes from "prop-types";

const SearchButton = ({title,disabled,datatestid,marginTop}) => {
  return (
    <IconButton
    sx={{
        marginTop: "22px",
        backgroundColor: "#2e7d32",
        color: "white",
        "&:hover": {
          backgroundColor: "#1b5e20",
        },
      }}
    variant="contained" 
    color="primary"
    type="submit" 
    title={title} 
    disabled={disabled} 
    data-testid={datatestid}>
<SearchIcon/>
    </IconButton>
  )
}

export default SearchButton


SearchButton.propTypes = {
  title: PropTypes.string,
  disabled: PropTypes.string,
  datatestid: PropTypes.bool,
  marginTop: PropTypes.string,
}