import React from 'react';
import PropTypes from 'prop-types';

const RenderLogo = ({ team }) => {
  const generateColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = Math.floor(Math.abs(((Math.sin(hash) * 10000) % 1) * 16777215)).toString(16);
    return "#" + Array(6 - color.length + 1).join("0") + color;
  };

  if (!team) return null;

  if (team.logo) {
    return (
      <div style={{ height: "124px",width:"124px"}}>
       
        <img
          src={team.logo}
          alt="Logo"
          style={{
            width: "100%",
            height: "inherit",
            objectFit: "fill",
          }}
        />
      </div>
    );
  } else if(team.team_name !==" ") {
    console.log("team name", team.team_name)
    const firstLetter = team.team_name.charAt(0).toUpperCase();
    const bgColor = generateColor(team.team_name);
    return (
      <div
      
        style={{
          
          backgroundColor: bgColor,
          height: "124px",
          // marginLeft:"9px",
          width:"124px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "48px",
          fontWeight: "bold",
          color: "white",
        }}
      >
        {firstLetter}
      </div>
    );
  }
};

export default RenderLogo;
RenderLogo.propTypes = {
  team: PropTypes.shape({
    logo: PropTypes.string,
    team_name: PropTypes.string
  })
};