import { Box, Typography,Checkbox, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import SubmitButton from "../../components/Common/buttons/submitButton/SubmitButton";
import { addPlayingEleven,getSquad} from "../../Services/TeamServices";
import CancelButton from "../../components/Common/buttons/cancelButton/CancelButton";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../components/Common/loader/Loader";
import { ToastService } from "../../components/Common/toast/ToastService";
import { AddPlayerElevenErrorMessage } from "../../utils/errorCode/ErrorCode";
const teamBoxStyle={
    width: { xs: "100%", md: "50%" },
    height: { xs: "50%", md: "100%" },
  }
const boxStyle={
    height: "100%",
    width: "auto",
    whiteSpace: "nowrap",
    overflow: "auto",
    textOverflow: "ellipsis",
    border: "2px solid #e0e0e0",
    borderRadius: "10px", // Add border radius for rounded corners
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Add a subtle shadow for depth
  }
  const commonBoxStyle={display: "flex", justifyContent: "center"}
const PlayingEleven = () => {
  const [playersOne, setPlayersOne] = useState([]);
  const [playersTwo, setPlayersTwo] = useState([]);
  const [selectedTeamOne, setSelectedTeamOne] = useState([]);
  const [selectedTeamTwo, setSelectedTeamTwo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  let { team1, team2, matchId } = location?.state || {};
  useEffect(() => {
    const response = getSquad(team1?.id);
    response
      .then((res) => {
        setPlayersOne(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [team1?.id]);
  useEffect(() => {
    const response = getSquad(team2?.id);
    response
      .then((res) => {
        setPlayersTwo(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [team2?.id]);
  useEffect(() => {
    setIsAddButtonDisabled(
      selectedTeamOne.length === 11 && selectedTeamTwo.length === 11
        ? true
        : false
    );
  }, [selectedTeamOne, selectedTeamTwo]);

  console.log(isAddButtonDisabled);
  const handleClick = (event, email, team) => {
    if (team === "team1") {
      const selectedIndex = selectedTeamOne.indexOf(email);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = [...selectedTeamOne, email];
      } else {
        newSelected = selectedTeamOne.filter(
          (selectedEmail) => selectedEmail !== email
        );
      }

      setSelectedTeamOne(newSelected);
    } else if (team === "team2") {
      const selectedIndex = selectedTeamTwo.indexOf(email);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = [...selectedTeamTwo, email];
      } else {
        newSelected = selectedTeamTwo.filter(
          (selectedEmail) => selectedEmail !== email
        );
      }

      setSelectedTeamTwo(newSelected);
    }
  };
  const handleCancel = () => {
    navigate(-1);
  };
  console.log(selectedTeamOne, selectedTeamTwo);
  const isSelected = (email, team) => {
    if (team === "team1") {
      return selectedTeamOne.indexOf(email) !== -1;
    } else if (team === "team2") {
      return selectedTeamTwo.indexOf(email) !== -1;
    }
  };
  const data = {
    matchId: matchId,
    teamOnePlayers: selectedTeamOne,
    teamOneId: team1?.id,
    teamTwoPlayers: selectedTeamTwo,
    teamTwoId: team2?.id,
  };
  const AddElevenClick = () => {
    setIsLoading(true);
    const response = addPlayingEleven(data);
    response
      .then((res) => {
        if (res.status === 200) {
          setIsLoading(false);
          ToastService("Players added to playing eleven",'success')
          navigate(`/add-score/${matchId}`,{state:{"team1":team1,"team2":team2}})
          
        }
      })
      .catch((err) => {
setIsLoading(false);
ToastService(AddPlayerElevenErrorMessage(err.response.data.errorCode),'error')
      });
  };
  
  function renderBox(){
   return( <Box
    sx={{
      display: "flex",
      justifyContent: "center ",
      height: "100%",
      whiteSpace: "nowrap",
      overflow: "auto",
      textOverflow: "ellipsis",
      border: "2px solid #e0e0e0", // Add a solid border with a light gray color
      borderRadius: "10px", // Add border radius for rounded corners
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    }}
  >
    <Typography alignSelf={"center"}>
      No players to display 
    </Typography>
  </Box>)
  }
  function renderTypography(player){
    return(  <Typography
        title={player.first_name + " " + player.last_name}
        sx={{
          marginTop: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: { xs: "10rem", md: "10rem" },
          display: "flex",
          gap: 2,
        }}
      >
        <Box>
          <PersonIcon />
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >

          {player.first_name + " " + player.last_name}
        </Box>
      </Typography>)
  }
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Box
          className="container"
          sx={{ width: "55vw", height: "60vh", padding: 5, margin: "auto" }}
        >
          <Box
            sx={{...commonBoxStyle, height: "10%" }}
          >
            <Typography sx={{ fontSize: "30px", alignSelf: "center" }}>
              <b>Playing 11</b>
            </Typography>
          </Box>

          <Box
            sx={{
              height: { xs: "50%", md: "60%" },
              display: "flex",
              boxSizing: "border-box",
              gap: 5,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box
              className="team1"
              sx={teamBoxStyle}
            >
              <Box sx={{ ...commonBoxStyle, mt: 2 }}>
               <Tooltip title={team1?.team_name}>
                <Typography variant="h6" sx={{fontSize:'18px'}}>
                  {team1?.team_name.length > 7
                    ? `${team1?.team_name.substring(0, 7)}.....`
                    : team1?.team_name}
                </Typography>
              </Tooltip>
              </Box>
              {playersOne.length === 0 ? (
              renderBox()
              ) : (
                <Box
                  sx={boxStyle}
                >
                  {playersOne.map((player) => (
                    <Box
                      key={player.first_name}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        flexDirection: "row",
                        marginLeft: 4,
                      }}
                    >
                      <Box sx={{ display: "flex" }}>
                        <Checkbox
                          onClick={(event) =>
                            handleClick(event, player.email, "team1")
                          }
                          checked={isSelected(player.email, "team1")}
                          data-testid="playername"
                        />
                       { renderTypography(player)}
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            <Box
              className="team2"
              sx={teamBoxStyle}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Tooltip title={team1?.team_name}>
                <Typography variant="h6" sx={{fontSize:'18px'}}>
                  {team2?.team_name.length > 7
                    ? `${team2?.team_name.substring(0, 7)}.....`
                    : team2?.team_name}
                </Typography>
              </Tooltip>
              </Box>
              {playersTwo.length === 0 ? (
             renderBox()
              ) : (
                <Box
                  sx={boxStyle}
                >
                  {playersTwo.map((player, index) => (
                    <Box
                      key={player.first_name}
                      sx={{
                        ...commonBoxStyle,
                        flexDirection: "row",
                        marginLeft: 4,
                      }}
                    >
                      <Box sx={{ display: "flex" }}>
                        <Checkbox
                          onClick={(event) =>
                            handleClick(event, player.email, "team2")
                          }
                          checked={isSelected(player.email, "team2")}
                          data-testid="playername"
                        />

                       {renderTypography(player)}
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
          <Box sx={ commonBoxStyle}>
            <Box
              sx={{...commonBoxStyle, gap: 2, mt: 10 }}
            >
              <CancelButton name="Cancel " onClick={handleCancel} />

              <SubmitButton name="Add" onClick={AddElevenClick} />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default PlayingEleven;
