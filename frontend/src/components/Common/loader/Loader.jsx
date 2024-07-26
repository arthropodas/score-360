import React from "react";
import { makeStyles } from "@mui/styles";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";

const useStyles = makeStyles({
  container: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "9999", 
    background: "rgba(255, 255, 255, 0.5)",
  }, 
  animationContainer: { 
    position: "relative",
    width: "200px",
    height: "200px",
    overflow: "hidden",
  },
  batsman: {
    position: "absolute",
    bottom: "0",
    left: "50%",
    transform: "translateX(-50%)",
    animation: "$batsmanAnimation 2s linear infinite",
  },
  ball: {
    position: "absolute",
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    color: "#8b0000", // Dark red color
    animation: "$ballAnimation 2s linear infinite",
  },
  "@keyframes batsmanAnimation": {
    "0%": { transform: "translateX(-50%)" },
    "50%": { transform: "translateX(-30%)" },
    "100%": { transform: "translateX(-50%)" },
  },
  "@keyframes ballAnimation": {
    "0%": { transform: "translate(-50%, 0)" },
    "25%": { transform: "translate(-50%, -50px)" },
    "50%": { transform: "translate(-50%, 0)" },
    "75%": { transform: "translate(-50%, -50px)" },
    "100%": { transform: "translate(-50%, 0)" },
  },
});

const Loader = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.animationContainer}>
       
        <div className={classes.ball}>
          <SportsBaseballIcon  sx={{ fontSize: 90 }}  /> 
        </div> 
      </div>
    </div>
  );
};

export default Loader;