import React, { useEffect, useState } from "react";
import { RemovePlayer, teamPlayerListing } from "../../Services/TeamServices";
import { useNavigate, useParams } from "react-router-dom";
import PlayerCard from "../../components/Common/cards/playerCard/PlayerCard";
import playerProfile from "../../assets/user_profile.png";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ToastService } from "../../components/Common/toast/ToastService";
import "react-toastify/dist/ReactToastify.css";
import NoDataMessage from "../../components/Common/noData/NoData";
import { PlayerListErrorCode } from "../../utils/errorCode/ErrorCode";

function PlayerList() {
  const [playerData, setPlayerData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const { teamId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await teamPlayerListing(teamId);
        setPlayerData(response.data);
      } catch (error) {
        setPlayerData([]);
        const errorCode = error.response.data.errorCode;

        if (errorCode === "4603" || errorCode === "4601") {
          navigate("/notfound");
        } else {
          setPlayerData([]);
          ToastService(
            PlayerListErrorCode(error.response.data.errorCode),
            error
          );
        }
      }
    };
    fetchData();
  }, [openDialog, teamId, navigate]);

  const handleOpenDialog = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpenDialog(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    setIsActive(true);
    try {
      const response = await RemovePlayer({ playerListId: selectedId });
      handleCloseDialog(false);
      if (response.status === 200) {
        ToastService("Deleted successfully", "success");
        setIsActive(false);
      } else {
        handleCloseDialog(false);
        ToastService(PlayerListErrorCode(response.data.errorCode), "error");
        setIsActive(false);
      }
    } catch (error) {
      handleCloseDialog(false);
      ToastService(PlayerListErrorCode(error.response.data.errorCode), "error");
      setIsActive(false);
    }
  };

  const handleViewProfile = (id) => {
    console.log("profile view", id);
  };
  return (
    <>
    <Grid marginTop={5} container justifyContent="center">
       
      {playerData.length > 0 ? (
        <Grid container spacing={3}>
          {playerData.map((player) => (
            <Grid
              paddingTop={20}
              item
              key={player.id}
              xs={6}
              sm={6}
              md={3}
              lg={3}
            >
              <PlayerCard
                playerName={player.first_name}
                lastName={player.last_name}
                playerId={player.player_id}
                image={playerProfile}
                contactNumber={player.phone_number}
              >
                <Tooltip title="Remove Player">
                  <IconButton
                    aria-label="remove player"
                    onClick={() => handleOpenDialog(player.id)}
                  >
                    <DeleteIcon style={{ color: "red" }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View Profile">
                  <IconButton
                    aria-label="view profile"
                    onClick={() => handleViewProfile(player.player_id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              </PlayerCard>
            </Grid>
          ))}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            disablebackdropclick={true.toString()}
          >
            <DialogTitle id="alert-dialog-title">{"Delete Confirmation"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete the selected player?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                data-testid="cancelButton"
                onClick={handleCloseDialog}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                data-testid="deleteButton"
                onClick={handleDeleteConfirmed}
                color="error"
                autoFocus
                disabled={isActive}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      ) : (
        <NoDataMessage message="No players found" />
      )}
      </Grid>
    
    </>
  );
}

export default PlayerList;
