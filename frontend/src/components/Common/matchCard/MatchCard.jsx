import React, { useEffect, useState } from "react";
import { Card, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { getTeamData } from "../../../Services/TeamServices";
import { Box, Stack } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";

import PropTypes from "prop-types";

import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import InfoIcon from "@mui/icons-material/Info";
const StyledCard = styled(Card)(({ theme }) => ({
  width: "80%",
  margin: "auto",
  padding: 15,
  
  height: 190,
  border: "1px solid grey",
  boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  borderRadius: theme.spacing(1),
  [theme.breakpoints.up("xs")]: {
    maxWidth: "345px",
  },
}));
const getRoundLabel = (id) => {
  const roundLabels = {
    1: "Round one",
    2: "Semi-finals",
    3: "Finals",
  };

  return roundLabels[id] || "";
};

const MatchCard = ({
  opponent_one,
  opponent_two,
  setIsOpen,
  setMatchId,
  matchIds,
  matchData,
  setIsInfoOpen,
  setMatchInfo,
  matchId,
  onReply,
  tossDecision,
  setElevenOpen,
  setTeams

}) => {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const team1Data = await getTeamData(opponent_one);
        const team2Data = await getTeamData(opponent_two);
        setTeam1(team1Data.data);
        setTeam2(team2Data.data);
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };
    fetchData();
  }, [opponent_one, opponent_two]);

  const handleEdit = () => {
    setMatchId(matchIds);
    setIsOpen(true);
  };

  const handleInfoModal = () => {
    setIsInfoOpen(true);
    setMatchInfo({
      ...matchData,
      opponent1: team1.team_name,
      opponent2: team2.team_name,
    });
  };
  const generateColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = Math.floor(
      Math.abs(((Math.sin(hash) * 10000) % 1) * 16777215)
    ).toString(16);
    return "#" + Array(6 - color.length + 1).join("0") + color;
  };

  const renderTeamName = (team) => {
    if (!team?.team_name) return null;
    const maxLength = 20;
    const truncatedName =
      team.team_name.length > maxLength
        ? `${team.team_name.substring(0, maxLength)}...`
        : team.team_name;
    const capitalizedName =
      truncatedName.charAt(0).toUpperCase() + truncatedName.slice(1);
    return (
      <Box
        variant="h6"
        justifyContent="center"
        sx={{
          fontWeight: "600",
          lineHeight: "0.8rem",
          fontSize: { xs: "0.750rem", md: "0.7rem" },
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
          cursor: "pointer",
          textAlign: "center",
        }}
      >
        {capitalizedName}
      </Box>
    );
  };

  const renderLogo = (team) => {
    if (!team) return null;
    if (team.logo) {
      return (
        <div
          style={{
            height: "124px",
          }}
        >
          <img
            src={team.logo}
            alt="Logo"
            style={{
              height: "100px",
              width: "100px",
              objectFit: "fill",
              borderRadius: "55px",
            }}
          />
        </div>
      );
    } else {
      const firstLetter = team.team_name.charAt(0).toUpperCase();
      const bgColor = generateColor(team.team_name);
      return (
        <div
          style={{
            backgroundColor: bgColor,
            height: "100px",
            width: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "48px",
            fontWeight: "bold",
            color: "white",
            borderRadius: "80px",
          }}
        >
          {firstLetter}
        </div>
      );
    }
  };

  return (
    <>
      <StyledCard >
        <Grid container justifyContent="flex-end">
          <Grid item xs={6}>
            <Box
              sx={{
                width: 90,
                backgroundColor: "#FF5733",
                textAlign: "center",
                height: 30,
                alignItems: "center",
                borderRadius: 8,
               
              }}
            >
              <Typography padding={0.5}>
                {" "}
                {getRoundLabel(matchData?.round)}
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >

            
            {!tossDecision && (
              <Tooltip title="Toss">
                <IconButton
                  data-testid="toss"
                  onClick={() => onReply(team1, team2, matchId)}
                >
                  <CurrencyExchangeIcon />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Information">
              <IconButton onClick={handleInfoModal}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit match">
              <IconButton onClick={handleEdit}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Stack
              direction="row"
              justifyContent="space-evenly"
              alignItems="center"
            >
              <Box sx={{ width: "110px", height: "100px" }}>
                {renderLogo(team1)}
              </Box>
              <div
                style={{
                  marginTop: "35px",
                  width: "70px",
                  height: "70px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p>vs</p>
              </div>
              <Box sx={{ width: "110px", height: "100px" }}>
                {renderLogo(team2)}
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={1}
        >
          <Grid item xs={5} padding="0" alignContent="center">
            <Box
              sx={{
                padding: 1,
                backgroundColor: "azure",
                boxShadow: " 0px 0px 5px 2px rgba(0, 0, 0, 0.5)",
                borderRadius: 8,
              }}
            >
             <Tooltip title={team1.team_name ? team1.team_name.charAt(0).toUpperCase() + team1.team_name.slice(1) : ""} arrow>
 
                {renderTeamName(team1)}
              </Tooltip>
            </Box>
          </Grid>

          <Grid item xs={5} padding="0" alignContent="center">
            <Box
              sx={{
                padding: 1,
                backgroundColor: "azure",
                boxShadow: " 0px 0px 5px 2px rgba(0, 0, 0, 0.5)",
                borderRadius: 8,
              }}
            >
              <Tooltip title={team2.team_name ? team2.team_name.charAt(0).toUpperCase() + team2.team_name.slice(1) : ""} arrow>
                {renderTeamName(team2)}
              </Tooltip>
            </Box>
          </Grid>
        </Stack>
      </StyledCard>
    </>
  );
};

MatchCard.propTypes = {
  opponent_one: PropTypes.string,
  opponent_two: PropTypes.string,
  matchId: PropTypes.string,

  setIsOpen: PropTypes.func,
  setIsInfoOpen: PropTypes.func,
  setMatchInfo: PropTypes.func,
  matchData: PropTypes.object,
  matchIds: PropTypes.string,
  setMatchId: PropTypes.func,
  onReply: PropTypes.func,
  tossDecision: PropTypes.bool,
};

export default MatchCard;
