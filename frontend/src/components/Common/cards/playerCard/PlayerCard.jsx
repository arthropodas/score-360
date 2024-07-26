import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';

const StyledCard = styled(Card)({
  maxWidth: 250,
  maxHeight: 300,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: ' 1px 1px 2px 2px rgba(0, 0, 0, 0.1)',
});

const CardContent = styled('div')({
  textAlign: 'center',

});

const HeaderTitle = styled('span')({
  fontSize: '14px',
  fontWeight: 'bold',
  overflow: 'hidden',
  textOverflow: 'ellipsis', 
  whiteSpace: 'nowrap',
  display: 'inline-block',
  maxWidth: '20ch', // limit to 20 characters
  '@media (max-width: 600px)': {
    fontSize: '12px', // Adjust font size for smaller screens
    maxWidth: '15ch', // Reduce max width for smaller screens
  },
});

const SubheaderText = styled('span')({
  fontSize: '12px',
  color: 'gray',
});

const ContactText = styled('p')({
  fontSize: '12px',
  color: 'gray',
});

export default function PlayerCard({ playerName, lastName, playerId, contactNumber, image, children }) {
  const fullName = `${playerName} ${lastName}`;
  const [showTooltip, setShowTooltip] = useState(false);

  const handleNameClick = () => {
    setShowTooltip(true);
  };

  const handleTooltipClose = () => {
    setShowTooltip(false);
  };

  return (
    <StyledCard>
      <img src={image} alt="Player" style={{ width: 150, height: '50%', objectFit: 'cover', paddingTop:15 }} />
      <CardContent>
        <CardHeader 
          padding={'0px'} 
          style={{ marginBottom: '-20px' }}
          title={
            <Tooltip
              open={showTooltip} 
              onClose={handleTooltipClose} 
              title={fullName}
              interactive
              placement="top"
              arrow
            >
              <HeaderTitle onClick={handleNameClick}> 
                {fullName.length > 20 ? fullName.slice(0, 20) + '...' : fullName}
              </HeaderTitle>
            </Tooltip>
          }
          subheader={<SubheaderText>{`Player ID: ${playerId}`}</SubheaderText>} 
        />
        <ContactText>Contact Number: {contactNumber}</ContactText>  
        {children}
      </CardContent>
    </StyledCard>
  );
}

PlayerCard.propTypes = {
  playerName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  playerId: PropTypes.string.isRequired,
  contactNumber: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  children: PropTypes.node,
};
