import {
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { Box } from "@mui/system";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { green } from "@mui/material/colors";

const TournamentCard = ({ tournamentData, id, setOpenDialog, setSelected }) => {
  const navigate = useNavigate();
  const maxLength = 20;
  const truncatedName =
    tournamentData?.tournament_name?.length > maxLength
      ? `${tournamentData?.tournament_name?.substring(0, maxLength)}...`
      : tournamentData?.tournament_name;
  const capitalizedName =
    truncatedName?.charAt(0).toUpperCase() + truncatedName?.slice(1);
  const firstLetter = tournamentData?.tournament_name?.charAt(0)?.toUpperCase();
  const bgColor = "green";

  const matchStatus = (tournamentData) => {
    if (tournamentData?.status === 1) {
      return "UPCOMING";
    } else if (
      tournamentData?.status === 2 ||
      tournamentData?.status === 3 ||
      tournamentData?.status === 4
    ) {
      return "ONGOING";
    } else {
      return "ENDED";
    }
  };
  const handleClick = (id) => {
    navigate(`/tournament/TournamentDetails/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/tournament-edit/${id}`);
  };

  const openModal = (id) => {
    setOpenDialog(true);
    setSelected([id]);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div onClick={() => handleClick(tournamentData?.id)}>
        <Card
          sx={{
            display: "flex",
            height: 145,
            width: {xs:'auto',md:500},
            padding: 1,
            gap: 2,
            backgroundColor: "white",
            borderRadius: 6,
            cursor: "pointer",
            "&:hover": {
              backgroundColor: green[50],
            },
          }}
          key={tournamentData?.id}
          variant="outlined"
        >
          <div
            style={{
              backgroundColor: bgColor,
              marginTop: 12,
              marginLeft: 10,
              height: "120px",
              width: "110px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "48px",
              fontWeight: "bold",
              color: "white",
              borderRadius: "10px",
            }}
          >
            {firstLetter}
          </div>
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              title={tournamentData?.tournament_name}
              noWrap
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: 160,
              }}
            >
              <b>{capitalizedName}</b>
            </Typography>{" "}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                color: "grey",
              }}
            >
              <Typography sx={{ width: 200, fontSize: "14px" }}>
                {tournamentData?.start_date + " To " + tournamentData?.end_date}{" "}
              </Typography>
            </Box>
            <Typography sx={{ width: 100, fontSize: "14px", color: "grey" }}>
              {tournamentData?.venue}
            </Typography>
          </CardContent>
        </Card>
      </div>
      <div
        style={{
          display: "flex",
          position: "relative",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: "10px",
            right: "20px",
            marginBottom:4,
          }}
        >
          <Typography
            sx={{
              boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.5)",
              borderRadius: 16,
              height: 12,
              p: 1,
              width: 100,
          
              fontSize: "12px",
              textAlign: "center",
              mt:1,
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center" 
            }}
          >
            <b>{matchStatus(tournamentData)}</b>
          </Typography>

          <Box
            className="actions"
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Tooltip title="Edit tournament">
              <IconButton
                onClick={() => {
                  handleEdit(id);
                }}
              >
                <EditIcon color="black" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete tournament">
              <IconButton
                aria-label="remove match"
                onClick={() => {
                  openModal(id);
                }}
              >
                <DeleteIcon color="red" />
              </IconButton>
            </Tooltip>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default TournamentCard;
