
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PropTypes from "prop-types";


import {
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Tooltip,
  Badge,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";


const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  width: "100%",
  margin: "auto",
  padding:10,
  
  borderRadius: theme.spacing(1),


  [theme.breakpoints.up("xs")]: {
    maxWidth: "90%",
  },
}));

export default function TeamCard({
  id,
  teamName,
  city,
  logo,
  onDelete,
  dataTestId,
  handleEditClick,
  setIsAddOpen,
  handleAddClick,
  player_count
}) {
  const [openDialog, setOpenDialog] = useState(false);
console.log(player_count,"..>>>>")

  const navigate = useNavigate();
  const handleDeleteClick = () => {
    setOpenDialog(true);
  };


  const handleDeleteConfirm = () => {
    onDelete();
    setOpenDialog(false);
  };


  const handleDeleteCancel = () => {
    setOpenDialog(false);
  };
  const handlesAddClick = () => {
    handleAddClick(id);
    setIsAddOpen(true);
  };



  const renderLogo = () => {
    if (logo) {
      return (
        <div
          style={{
            width: "100%",
            height: "150px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "100%",
              height: "auto",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      );
    } else {
      const firstLetter = teamName.charAt(0).toUpperCase();
      const bgColor = "green";
      return (
        <div
          style={{
            backgroundColor: bgColor,
            width: "100%",
            height: "150px",
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
  const badgeColor = player_count < 11 ? 'error' : 'primary';

  return (
    <StyledCard>
      <Grid container justifyContent="flex-end">
      <Tooltip title="Number of players">
      <IconButton sx={{ padding: '20px' }}>
      <Badge badgeContent={`${player_count}/15`} color={badgeColor}/>
      </IconButton>
</Tooltip>
        <Tooltip title="List players">

          <IconButton
            aria-label="Add person"
            onClick={() => {
              navigate(`team-players/${id}`);
            }}
          >
            <FormatListBulletedIcon />{" "}
          </IconButton>
        </Tooltip>

        <Tooltip title="Add Player">


          <IconButton aria-label="Add player" onClick={handlesAddClick}>
        
         
          <PersonAddAlt1Icon />
  
            
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit team">

          <IconButton
            data-testid={dataTestId + "edit"}
            onClick={() => handleEditClick(id)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete team">

          <IconButton data-testid={dataTestId} onClick={handleDeleteClick}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      {renderLogo()}
      <Dialog open={openDialog}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this team?
        </DialogContent>
        <DialogActions>
          <Button
            data-testid="cancelButton"
            onClick={handleDeleteCancel}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            data-testid="deleteButton"
            onClick={handleDeleteConfirm}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>


      <Grid
        style={{ paddingLeft: 12, paddingRight: 12, flexDirection: "column" }}
      >
       
        <CardHeader
          sx={{ justifyContent: "center", textAlign: "center", paddingBottom: 1 }}
          style={{ flexDirection: "column" }}
          title={
            <Tooltip title={teamName} arrow>
              {teamName.length > 20 ? (
                <Typography
                  variant="h6"
                  justifyContent={"center"}
                  sx={{
                    lineHeight: "0.8rem",
                    fontSize: { xs: "0.750rem", md: "0.9rem" },
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    
                    paddingBottom:1,
                    cursor: "pointer",
                  }}
                  component="div"
                >
                 
                  <span>{`${teamName.substring(0, 20)}...`}</span>
                </Typography>
              ) : (
                <Typography
                  variant="h6"
                  justifyContent={"center"}
                  sx={{
                    lineHeight: "0.9rem",
                    fontSize: { xs: "0.750rem", md: "0.9rem" },
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    paddingBottom:1,
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  component="div"
                >
                  {teamName}
                </Typography>
              )}
            </Tooltip>
          }
          subheader={
            <Tooltip title={city} arrow>
              {city.length > 20 ? (
                <Typography
                  variant="h6"
                  justifyContent={"center"}
                  sx={{
                    fontSize: { xs: "0.550rem", md: "0.8rem" },
                    lineHeight: "0.8rem",
                    color: "-moz-initial",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  component="div"
                >
                  <span>{`${city.substring(0, 20)}...`}</span>
                </Typography>
              ) : (
                <Typography
                  variant="h6"
                  justifyContent={"center"}
                  sx={{
                    fontSize: { xs: "0.550rem", md: "0.8rem" },
                    lineHeight: "0.8rem",
                    color: "-moz-initial",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  component="div"
                >
                  {city}
                </Typography>
              )}
            </Tooltip>
          }
        />
      </Grid>
    </StyledCard>
  );
}
TeamCard.propTypes = {
  id: PropTypes.number.isRequired,
  teamName: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  logo: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  dataTestId: PropTypes.string.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  setIsAddOpen: PropTypes.func.isRequired,
  handleAddClick: PropTypes.func.isRequired,
  player_count:PropTypes.string
};



