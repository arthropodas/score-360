import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

const CenteredTabs = ({ tabLabels, defaultValue, onTabClick }) => {
  const [value, setValue] = useState(defaultValue);

  const handleTabClick = (index) => {
    if (index === undefined || index < 0 || index >= tabLabels.length) {
      setValue(defaultValue);
      onTabClick?.(value);
    } else {
      setValue(index);
      onTabClick?.(index);
    }
  };

  const style={backgroundColor:'azure'}

  

  return (
    <Box
      sx={{
        zIndex: 999,
        width: { xs: "100%", md: "100%" },
        bgcolor: "#eceff1",
        textAlign: "left",
        height:3,
        fontFamily:"sans-serif",
        fontSize: "14px",
        
        marginTop: 8,
      }}
    >
      <div style={style} >
        {tabLabels.map((label, index) => (
          <Link
            key={label}
            onClick={() => handleTabClick(label)}
            underline="none"
            sx={{
              color: value === index ? "#rgba(0, 75, 80, 0.8)" : "",
              backgroundColor: value === index ? "#e8f5e9" : "", // Set background color when selected
              padding: "8px 16px",
              marginTop:1,
              height:25,
                textTransform: "uppercase",
              display: "inline-block",
              cursor: "pointer",
              "&:hover": {
                color: "rgba(0, 75, 80, 0.8)",
              },
            }}
          >
            {label}
          </Link>
        ))}
      </div>
    </Box>
  );
};

CenteredTabs.propTypes = {
  tabLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  defaultValue: PropTypes.number,
  onTabClick: PropTypes.func,
};

export default CenteredTabs;
