import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  ButtonBase,
  MenuItem,
  Tooltip,
  Button,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import SubmitButton from "../../components/Common/buttons/submitButton/SubmitButton";
import CustomModal from "../../components/Common/box/modal/Modal";
import { useLocation, useParams } from "react-router-dom";
import MuiTextField from "../../components/Common/TextField/MuiTextFiled";
import {
  getMatchCurrentScore,
  getPlayingEleven,
} from "../../Services/MatchServices";
import CancelButton from "../../components/Common/buttons/cancelButton/CancelButton";
import { ToastService } from "../../components/Common/toast/ToastService";
import { green } from "@mui/material/colors";

const buttonStyle = {
  height: { xs: 35, md: 50 },
  width: 50,
  backgroundColor: green[50],
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 2,
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
  "&:hover": {
    backgroundColor: "white",
  },
};

const webSocketEndpoint = require('../../utils/EndPoints');

const AddScore = () => {
  const [wsConnected, setWsConnected] = useState(false);
  const [webSocket, setWebSocket] = useState();
  const [runs, setRuns] = useState(0);
  const [batsman, setBatsman] = useState({
    striker: "",
    nonStriker: "",
    bowler: "",
  });
  const [isDisabled, setIsDisabled] = useState(true);
  const [open, setOpen] = useState(false);
  const [scoreData, setScoreData] = useState();
  const [tossWinner, setTossWinner] = useState();
  const [playingEleven, setPlayingEleven] = useState();
  const location = useLocation();
  const [innings1, setInnings1] = useState([]);
  const [innings2, setInnings2] = useState([]);
  const [inningsNumber, setInningsNumber] = useState(1);
  const [wicketOpen, setWicketOpen] = useState(false);
  const [battingTeam, setBattingTeam] = useState();
  const [bowlingTeam, setBowlingTeam] = useState();
  const [ChangeBowler, setChangeBowler] = useState(false);
  const [overNo, setOverNo] = useState(1);
  const [matchStatus, setMatchStatus] = useState();
  const { team1, team2 } = location?.state || null;

  const { id } = useParams();
  const token = JSON.parse(localStorage.getItem("authTokens"));
  let message = {};
  const [checkboxValues, setCheckboxValues] = useState({
    wide: 0,
    noBall: 0,
    wicket: 0,
    byes: 0,
    legByes: 0,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const {
    register: registerForm2,
    handleSubmit: handleSubmitForm2,
   
    watch: watch2,
  } = useForm();
  const {
    register: registerForm3,
    handleSubmit: handleSubmitForm3,
   

  } = useForm();
  const selectPlayers = async (data) => {
    setBatsman({
      striker: data?.striker,
      nonStriker: data?.nonStriker,
      bowler: data?.bowler,
    });
    setOpen(false);
    if (ChangeBowler === true) {
      setChangeBowler(false);
    }
  };
  console.log(matchStatus);
  const handleErrorCode = (errorCode, data) => {
    switch (errorCode) {
      case "9140":
        setChangeBowler(true);
        truncateString("player_name", 10);
        truncateString("player_name", 15);

        break;
      case "9156":
        setIsDisabled(false);
        setInningsNumber(2);
        ToastService("You have reached end of the innings", "success");
        console.log(inningsNumber);
        break;
      default:
        ToastService(data.message, "error");
        break;
    }
  };
  const handleNonErrorCodeData = (data) => {
    const jsonData = data.replace(/'/g, '"');
    const parsedNew = JSON.parse(jsonData);
    setScoreData(parsedNew);
  };
  const inningsEnd = ()=>{
    setIsDisabled(true);      
                  setOverNo(1);  
                  setOpen(true);
  }

  function extras() {
    if (
      checkboxValues.noBall === 1 ||
      checkboxValues.wide === 1 ||
      checkboxValues.byes === 1 ||
      checkboxValues.legByes === 1
    ) {
      return 1;
    } else return 0;
  }
  function typeOfExtra() {
    const extraTypes = {
      wide: 1,
      noBall: 2,
      byes: 3,
      legByes: 4,
    };

    for (const [key, value] of Object.entries(extraTypes)) {
      if (checkboxValues[key] === 1) {
        return value;
      }
    }

    return 5;
  }
  const handleChangeBowler = async (data) => {
    setBatsman((prevBatsman) => ({
      ...prevBatsman,
      bowler: data?.bowler,
    }));
    let flooredNumber = Math.floor(scoreData?.teamOvers);
    setOverNo(flooredNumber);
    setOverNo((prev) => prev + 1);
    setBatsman((prevBatsman) => ({
      ...prevBatsman,
      striker: prevBatsman?.nonStriker,
      nonStriker: prevBatsman?.striker,
    }));
    setChangeBowler(false);
  };
  const handleWicketLoss = (data) => {
    message = {
      type: "add_score",
      data: {
        inningsNo: inningsNumber,
        striker: batsman?.striker,
        nonStriker: batsman?.nonStriker,
        bowlerId: batsman?.bowler,
        runs: runs,
        extras: extras(),
        ...(extras() === 1 ? { typeOfExtras: typeOfExtra() } : {}),
        wicket: checkboxValues?.wicket,
        ...(checkboxValues?.wicket === 1 && [2, 4, 5].includes(data.dismissal)
          ? {
              typeOfDismissal: data.dismissal,
              dismissedByFielder: data.fielder,
            }
          : { typeOfDismissal: data.dismissal }),
        battingTeam: battingTeam,
        bowlingTeam: bowlingTeam,
        overNo: overNo,
      },
    };

    sendMessage(message);
    setWicketOpen(false);
  };
  const fetchPlyingEleven = () => {
    const response = getPlayingEleven(team1?.id, team2?.id, id);
    response
      ?.then((res) => {
        setPlayingEleven({
          team1: res?.data?.teamOnePlayers,
          team2: res?.data?.teamTwoPlayers,
          tossWinner: res?.data?.toss_winner,
          tossDecision: res?.data?.toss_decision,
        });

        setTossWinner(res?.data?.toss_winner);
        const tossLoser = tossWinner === team1?.id ? team2?.id : team1?.id;
        res?.data?.toss_decision === 1
          ? setBattingTeam(tossWinner)
          : setBattingTeam(tossLoser);
        res?.data?.toss_decision === 2
          ? setBowlingTeam(tossWinner)
          : setBowlingTeam(tossLoser);
        const tossConditions = {
          [`${team1}-1`]: {
            innings1: playingEleven?.team1,
            innings2: playingEleven?.team2,
          },
          [`${team1}-2`]: {
            innings1: playingEleven?.team2,
            innings2: playingEleven?.team1,
          },
          [`${team2}-1`]: {
            innings1: playingEleven?.team2,
            innings2: playingEleven?.team1,
          },
          [`${team2}-2`]: {
            innings1: playingEleven?.team1,
            innings2: playingEleven?.team2,
          },
        };
        const tossKey = `${res?.data?.tossWinner}-${
          res?.data?.toss_decision || res?.data?.tossDecision
        }`;
        const { innings1, innings2 } = tossConditions[tossKey] || {
          innings1: playingEleven?.team1,
          innings2: playingEleven?.team2,
        };

        setInnings1(innings1);
        setInnings2(innings2);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchPlyingEleven();
    const current = getMatchCurrentScore(id);
    current
      .then((res) => {
        setScoreData(res?.data);

        setMatchStatus(res?.data?.match_status);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [open]);

  useEffect(() => {
    const sockets = new WebSocket(
  
      `${webSocketEndpoint}update_score/?match_id=${id}&token=${token?.accessToken}`
    );
    setWebSocket(sockets);
    sockets.onopen = () => {
      console.log("WebSocket connected");
      setWsConnected(true);
    };

    sockets.onmessage = (event) => {
      let data = JSON.parse(event.data);

      if (Object.keys(data).length === 2) {
        handleErrorCode(data.errorCode, data);
      } else {
        handleNonErrorCodeData(data);
      }
    };
  }, [runs]);

  const sendMessage = async (message) => {
    if (wsConnected && webSocket) {
      webSocket.send(JSON.stringify(message));
    } 
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const newValue = checked ? 1 : 0;
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };
  const handleRunClick = (run) => {
    setRuns(run);
    if (run % 2 !== 0) {
      setBatsman((prevBatsman) => ({
        ...prevBatsman,
        striker: prevBatsman?.nonStriker,
        nonStriker: prevBatsman?.striker,
      }));
    }
    if (checkboxValues.wicket === 1) {
      setWicketOpen(true);
    } else {
      message = {
        type: "add_score",
        data: {
          inningsNo: inningsNumber,
          striker: batsman?.striker,
          nonStriker: batsman?.nonStriker,
          bowlerId: batsman?.bowler,
          runs: run,
          extras: extras(),
          ...(extras() === 1 ? { typeOfExtras: typeOfExtra() } : {}),
          wicket: checkboxValues?.wicket,
          battingTeam: battingTeam,
          bowlingTeam: bowlingTeam,
          overNo: overNo,
        },
      };
      sendMessage(message);
    }
  };

  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  }

  return (
    <>
      <Box
        className="container"
        sx={{ height: "100vh", width: "100%", padding: 2 }}
      >
        <Box
          sx={{
            height: "90%",
            width: { xs: "100%", md: "40%" },
            backgroundColor: "white",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            border: 0.5,
          }}
        >
          <Box
            className="Head"
            sx={{
              display: "flex",
              backgroundColor: green[50],
              height: "8%",
              justifyContent: "space-evenly",
              p: 1,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Tooltip title={team1?.team_name}>
                <Typography variant="h6">
                  {team1.team_name.length > 7
                    ? `${team1.team_name.substring(0, 7)}.....`
                    : team1.team_name}
                </Typography>
              </Tooltip>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Tooltip title={team1?.team_name}>
                <Typography variant="h6">Vs</Typography>
              </Tooltip>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Tooltip title={team2?.team_name}>
                <Typography variant="h6">
                  {team2.team_name.length > 7
                    ? `${team2.team_name.substring(0, 7)}.....`
                    : team2.team_name}
                </Typography>
              </Tooltip>
            </Box>
          </Box>
          <Box
            className="match-stats"
            sx={{
              display: "flex",
              height: "10%",
              justifyContent: "space-evenly",
            }}
          >
            <Box
              className="score"
              sx={{
                width: "20%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Typography
                label="score"
                alignSelf={"center"}
                sx={{
                  fontSize: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <b>
                  {scoreData?.teamTotal}/{scoreData?.teamWickets}
                </b>
              </Typography>
            </Box>
            <Box
              className="CRR"
              sx={{
                width: "20%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                flexDirection: "column",
              }}
            >
              <Typography label="score" sx={{ fontSize: "22px" }}>
                <b>{scoreData?.crr}</b>
              </Typography>
              <Typography label="score" sx={{ fontSize: "15px" }}>
                CRR
              </Typography>
            </Box>

            <Box
              className="runrate"
              sx={{
                width: "20%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                flexDirection: "column",
              }}
            >
              <Typography label="score" sx={{ fontSize: "22px" }}>
                <b>{scoreData?.teamOvers}</b>
              </Typography>
              <Typography label="score" sx={{ fontSize: "15px" }}>
                Overs
              </Typography>
            </Box>
          </Box>

          <Box className="scoreCard" sx={{ height: "25%", width: "100%" }}>
            {!batsman.striker || !batsman.nonStriker || !batsman.bowler ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyItems: "center",
                }}
              >
                <Typography sx={{ mt: { xs: 10, md: 8 } }}>
                  <b>Select players to start match scoring</b>
                </Typography>
                <Button
                  onClick={handleChangeBowler}
                  label="hcb"
                  data-testId="change-bowler-button"
                  sx={{cursor:"auto"}}
                  
                />
                <Button
                  onClick={(data) => {
                    handleErrorCode("9156", { message: "Hii" });
                    handleErrorCode("9140", { message: "hey" });
                    handleWicketLoss(data)
                    inningsEnd()
                  }}
                  label="hec"
                  data-testId="error-code-button"
                  sx={{cursor:"auto"}}
                />
              </Box>
            ) : (
              <TableContainer
                component={Box}
                sx={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)" }}
              >
                <Table sx={{ minWidth: 500 }} aria-label="simple table">
                  <TableHead sx={{ backgroundColor: "lightgreen" }}>
                    <TableRow sx={{ backgroundColor: green[50] }}>
                      <TableCell>Batsman</TableCell>
                      <TableCell align="right">Runs</TableCell>
                      <TableCell align="right">Balls</TableCell>
                      <TableCell align="right">4s</TableCell>
                      <TableCell align="right">6s</TableCell>
                      <TableCell align="right">SR</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Tooltip title={scoreData?.batterOneStats?.name}>
                          <Typography variant="h6" sx={{ fontSize: "14px" }}>
                            {scoreData?.batterOneStats?.name.length > 7
                              ? `${scoreData?.batterOneStats?.name.substring(
                                  0,
                                  7
                                )}.....`
                              : scoreData?.batterOneStats?.name}{" "}
                            <span role="img" aria-label="bat">
                              🏏
                            </span>
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        {scoreData?.batterOneStats?.runs}
                      </TableCell>
                      <TableCell align="right">
                        {scoreData?.batterOneStats?.ballsFaced}
                      </TableCell>
                      <TableCell align="right">
                        {scoreData?.batterOneStats?.fours}
                      </TableCell>
                      <TableCell align="right">
                        {scoreData?.batterOneStats?.sixes}
                      </TableCell>
                      <TableCell align="right">
                        {scoreData?.batterOneStats?.strikeRate}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Tooltip title={scoreData?.batterTwoStats?.name}>
                          <Typography variant="h6" sx={{ fontSize: "14px" }}>
                            {scoreData?.batterTwoStats?.name.length > 7
                              ? `${scoreData?.batterTwoStats?.name.substring(
                                  0,
                                  7
                                )}.....`
                              : scoreData?.batterTwoStats?.name}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        {scoreData?.batterTwoStats?.runs}
                      </TableCell>
                      <TableCell align="right">
                        {scoreData?.batterTwoStats?.ballsFaced}
                      </TableCell>
                      <TableCell align="right">
                        {scoreData?.batterTwoStats?.fours}
                      </TableCell>
                      <TableCell align="right">
                        {scoreData?.batterTwoStats?.sixes}
                      </TableCell>
                      <TableCell align="right">
                        {scoreData?.batterTwoStats?.strikeRate}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
          <Box sx={{ height: "10%", mt: 2 }}>
            <Box
              sx={{
                width: "100%",
                backgroundColor: green[50],
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Tooltip title={scoreData?.bowlerStats?.name}>
                <Typography variant="h6" sx={{ fontSize: "17px" }}>
                  {scoreData?.bowlerStats?.name.length > 7
                    ? ` Bowler: ${scoreData?.bowlerStats?.name.substring(
                        0,
                        7
                      )}.....`
                    : " Bowler:" + scoreData?.bowlerStats?.name}
                </Typography>
              </Tooltip>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                mt: 1,
              }}
            >
              <Box>Over:{scoreData?.bowlerStats?.balls}</Box>
              <Box>Wickets:{scoreData?.bowlerStats?.wkts}</Box>
              <Box>Runs:{scoreData?.bowlerStats?.runs}</Box>
              <Box>Economy:{scoreData?.bowlerStats?.eco}</Box>
            </Box>
          </Box>

          <Box
            className="checkboxes"
            sx={{
              boxSizing: "border-box",
              height: "15%",
              display: "flex",
              justifyContent: "center",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          >
            <FormGroup
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    data-testid="wide"
                    disabled={
                      checkboxValues.byes || checkboxValues.legByes
                        ? true
                        : false
                    }
                    checked={checkboxValues.wide}
                    onChange={handleCheckboxChange}
                    name="wide"
                  />
                }
                label="Wide"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    disabled={checkboxValues.wide === 1}
                    checked={checkboxValues.byes}
                    onChange={handleCheckboxChange}
                    name="byes"
                  />
                }
                label="Byes"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    disabled={checkboxValues.wide === 1}
                    checked={checkboxValues.legByes}
                    onChange={handleCheckboxChange}
                    name="legByes"
                  />
                }
                label="Leg Byes"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={checkboxValues.wicket ? true : false}
                    size="small"
                    checked={
                      checkboxValues.wicket ? false : checkboxValues.noBall
                    }
                    onChange={handleCheckboxChange}
                    name="noBall"
                  />
                }
                label="No ball"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    disabled={checkboxValues.noBall === 1}
                    checked={checkboxValues.Wicket}
                    onChange={handleCheckboxChange}
                    name="wicket"
                  />
                }
                label="Wicket"
              />
            </FormGroup>
          </Box>

          <Box
            className="scoreUpdate"
            sx={{ height: "25%", display: "flex", gap: 1 }}
          >
            <Box
              className="actions"
              sx={{
                width: "35%",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              <SubmitButton
                datatestid="add-players"
                name="Add players"
                height={"30px"}
                marginTop={"6px"}
                width={"120px"}
                onClick={() => {
                  setOpen(true);
                }}
              />
              <SubmitButton
                name="End innings"
                height={"30px"}
                marginTop={"6px"}
                width={"120px"}
                disabled={isDisabled}
                onClick={() => {
                inningsEnd()
                }}
              />
            </Box>
            <Box
              className="score"
              sx={{
                width: "60%",
                padding: 1,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: { xs: 3, md: 0 },
                }}
              >
                <ButtonBase
                  sx={buttonStyle}
                  onClick={() => {
                    handleRunClick(0);
                  }}
                  data-testid="zero"
                >
                  0
                </ButtonBase>
                <ButtonBase
                  sx={buttonStyle}
                  onClick={() => {
                    handleRunClick(1);
                  }}
                  data-testid="one"
                >
                  1
                </ButtonBase>
                <ButtonBase
                  sx={buttonStyle}
                  onClick={() => {
                    handleRunClick(2);
                  }}
                  data-testid="two"
                >
                  2
                </ButtonBase>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: 2,
                }}
              >
                <ButtonBase
                  sx={buttonStyle}
                  onClick={() => {
                    handleRunClick(3);
                  }}
                  data-testid="three"
                >
                  3
                </ButtonBase>
                <ButtonBase
                  sx={buttonStyle}
                  onClick={() => {
                    handleRunClick(4);
                  }}
                  data-testid="four"
                >
                  4
                </ButtonBase>
                <ButtonBase
                  sx={buttonStyle}
                  onClick={() => {
                    handleRunClick(5);
                  }}
                  data-testid="five"
                >
                  5
                </ButtonBase>
                <ButtonBase
                  sx={buttonStyle}
                  onClick={() => {
                    handleRunClick(6);
                  }}
                  data-testid="six"
                >
                  6
                </ButtonBase>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <CustomModal open={open} width={"30%"} height={"60%"}>
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography>Select players</Typography>
          <Box sx={{ width: "100%" }}>
            <form onSubmit={handleSubmit(selectPlayers)}>
              <Box sx={{ width: "15rem" }}>
                <MuiTextField
                  size="small"
                  textAlign="true"
                  title="Please select striker"
                  inputProps={{ "data-testid": "striker" }}
                  label={
                    <span>
                      Striker<span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  type="select"
                  error={!!errors.striker}
                  helperText={errors.striker && "Please select striker."}
                  defaultValue=""
                  value={watch("striker")}
                  registerProps={register("striker", {
                    required: "Striker is required",
                  })}
                  select
                >
                  {inningsNumber === 1 &&
                    innings1?.map((player) => (
                      <MenuItem
                        disabled={player?.id === watch("nonStriker")}
                        key={player?.id}
                        value={player?.id}
                        data-testid={player?.id}
                      >
                        <Typography
                          title={player?.first_name + "  " + player?.last_name}
                        >
                          {truncateString(player?.first_name, 15) +
                            "  " +
                            truncateString(player?.last_name, 15)}
                        </Typography>
                      </MenuItem>
                    ))}
                  {inningsNumber === 2 &&
                    innings2?.map((player) => (
                      <MenuItem
                        disabled={player?.id === watch("nonStriker")}
                        key={player?.id}
                        value={player?.id}
                        data-testid={player?.id}
                      >
                        <Typography
                          title={player?.first_name + "  " + player?.last_name}
                        >
                          {truncateString(player?.first_name, 15) +
                            " " +
                            truncateString(player?.last_name, 15)}
                        </Typography>
                      </MenuItem>
                    ))}
                </MuiTextField>

                <MuiTextField
                  size="small"
                  textAlign="true"
                  title="Please select  non striker"
                  width="200px"
                  inputProps={{ "data-testid": "nonStriker" }}
                  label={
                    <span>
                      Non-striker<span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  type="select"
                  error={!!errors?.striker}
                  helperText={errors?.striker && "Please select striker."}
                  defaultValue=""
                  value={watch("nonStriker")}
                  registerProps={register("nonStriker")}
                  select
                >
                  {inningsNumber === 1 &&
                    innings1?.map((player) => (
                      <MenuItem
                        disabled={player?.id === watch("striker")}
                        key={player?.id}
                        value={player?.id}
                        data-testid={player?.id}
                      >
                        <Typography
                          title={player?.first_name + "  " + player?.last_name}
                        >
                          {truncateString(player?.first_name, 15) +
                            "  " +
                            truncateString(player?.last_name, 15)}
                        </Typography>
                      </MenuItem>
                    ))}
                  {inningsNumber === 2 &&
                    innings2?.map((player) => (
                      <MenuItem
                        disabled={player?.id === watch("striker")}
                        key={player?.id}
                        value={player?.id}
                        data-testid={player?.id}
                      >
                        <Typography
                          title={player?.first_name + "  " + player?.last_name}
                        >
                          {truncateString(player?.first_name, 15) +
                            "  " +
                            truncateString(player?.last_name, 15)}
                        </Typography>
                      </MenuItem>
                    ))}
                </MuiTextField>

                <MuiTextField
                  size="small"
                  textAlign="true"
                  title="Please select bowler"
                  width="200px"
                  inputProps={{ "data-testid": "bowler" }}
                  label={
                    <span>
                      Bowler<span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  type="select"
                  error={!!errors.striker}
                  helperText={errors.striker && "Please select bowler."}
                  defaultValue=""
                  value={watch("bowler")}
                  registerProps={register("bowler", {})}
                  select
                >
                  {inningsNumber === 1 &&
                    innings2?.map((player) => (
                      <MenuItem
                        key={player?.id}
                        value={player?.id}
                        data-testid={player?.id}
                      >
                        <Typography
                          title={player?.first_name + " " + player?.last_name}
                        >
                          {truncateString(player?.first_name, 15) +
                            "  " +
                            truncateString(player?.last_name, 15)}
                        </Typography>
                      </MenuItem>
                    ))}
                  {inningsNumber === 1 &&
                    innings2?.map((player) => (
                      <MenuItem
                        key={player?.id}
                        value={player?.id}
                        data-testid={player?.id}
                      >
                        <Typography
                          title={player?.first_name + " " + player?.last_name}
                        >
                          {truncateString(player?.first_name, 15) +
                            "  " +
                            truncateString(player?.last_name, 15)}
                        </Typography>
                      </MenuItem>
                    ))}
                  {inningsNumber === 2 &&
                    innings1?.map((player) => (
                      <MenuItem
                        key={player?.id}
                        value={player?.id}
                        data-testid={player?.id}
                      >
                        <Typography
                          title={player?.first_name + " " + player?.last_name}
                        >
                          {truncateString(player?.first_name, 15) +
                            "  " +
                            truncateString(player?.last_name, 15)}
                        </Typography>
                      </MenuItem>
                    ))}
                </MuiTextField>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                  <SubmitButton
                    datatestid="submit-batters"
                    name="Submit"
                    type="submit"
                  />
                  <CancelButton
                    onClick={() => {
                      setOpen(false);
                      reset();
                    }}
                    name="Cancel"
                    datatestid="Cancel-players"
                  />
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </CustomModal>
      <CustomModal open={wicketOpen} width={"30%"} height={"60%"}>
        <form onSubmit={handleSubmitForm2(handleWicketLoss)}>
          <Box
            sx={{
              height: "auto",
              width: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <Typography alignSelf={"center"}>
                <b>Fall of wickets</b>
              </Typography>
            </Box>

            <Box sx={{ width: { xs: "60vw", md: "20vw" } }}>
              <MuiTextField
                size="small"
                textAlign="true"
                title="Please select type of dismissal"
                datatestid="dismissal"
                inputProps={{ "data-testid": "striker" }}
                label={
                  <span>
                    Dismissal<span style={{ color: "red" }}>*</span>
                  </span>
                }
                type="select"
                error={!!errors.dismissal}
                helperText={
                  errors.dismissal && "Please select type of dismissal."
                }
                defaultValue=""
                registerProps={registerForm2("dismissal", {})}
                select
              >
                <MenuItem value={1} data-testid={"Bowled"}>
                  Bowled
                </MenuItem>
                <MenuItem value={2} data-testid={"Bowled"}>
                  Catch
                </MenuItem>
                <MenuItem value={3} data-testid={"HitWicket"}>
                  Hit wicket
                </MenuItem>
                <MenuItem value={4} data-testid={"RunOut"}>
                  Run Out{" "}
                </MenuItem>
                <MenuItem value={5} data-testid={"Bowled"}>
                  Stumping
                </MenuItem>
              </MuiTextField>
            </Box>
          </Box>
          <Box sx={{ width: { xs: "60vw", md: "20vw" } }}>
            {[2, 4, 5].includes(watch2("dismissal")) && (
              <MuiTextField
                size="small"
                textAlign="true"
                title="Please select fielder"
                width="200px"
                inputProps={{ "data-testid": "fielder" }}
                label={<span>Fielder</span>}
                type="select"
                error={!!errors.striker}
                defaultValue=""
                registerProps={registerForm2("fielder")}
                select
              >
                {inningsNumber === 1 &&
                  innings2?.map((player) => (
                    <MenuItem
                      key={player.id}
                      value={player.id}
                      data-testid={player.id}
                    >
                      {player.first_name + " " + player.last_name}
                    </MenuItem>
                  ))}
                {inningsNumber === 2 &&
                  innings1?.map((player) => (
                    <MenuItem
                      key={player.id}
                      value={player.id}
                      data-testid={player.id}
                    >
                      {player.first_name + " " + player.last_name}
                    </MenuItem>
                  ))}
              </MuiTextField>
            )}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <CancelButton
                name="Close"
                label="close"
                onClick={() => {
                  setWicketOpen(false);
                  reset();
                }}
              />
              <SubmitButton label="confirm" name="Confirm" type="submit" />
            </Box>
          </Box>
        </form>
      </CustomModal>
      <CustomModal open={ChangeBowler} height={"30%"}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography alignContent={"center"}>
            <b>Change bowler</b>
          </Typography>
        </Box>
        <form onSubmit={handleSubmitForm3(handleChangeBowler)}>
          <Box sx={{ width: "15rem" }}>
            <MuiTextField
              size="small"
              textAlign="true"
              title="Please select bowler"
              width="200px"
              inputProps={{ "data-testid": "bowler" }}
              label={
                <span>
                  Bowler<span style={{ color: "red" }}>*</span>
                </span>
              }
              type="select"
              error={!!errors.striker}
              helperText={errors.striker && "Please select bowler."}
              defaultValue=""
              registerProps={registerForm3("bowler", {})}
              select
            >
              {inningsNumber === 1 &&
                innings2?.map((player) => (
                  <MenuItem
                    key={player.id}
                    value={player.id}
                    data-testid={player.id}
                  >
                    <Typography
                      title={player.first_name + " " + player.last_name}
                    >
                      {truncateString(player.first_name, 15) +
                        truncateString(player.last_name, 15)}
                    </Typography>
                  </MenuItem>
                ))}
              {inningsNumber === 2 &&
                innings1?.map((player) => (
                  <MenuItem
                    key={player.id}
                    value={player.id}
                    data-testid={player.id}
                  >
                    <Typography
                      title={player.first_name + " " + player.last_name}
                    >
                      {truncateString(player.first_name, 15) +
                        truncateString(player.last_name, 15)}
                    </Typography>
                  </MenuItem>
                ))}
            </MuiTextField>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <CancelButton
                label="close"
                name="Close"
                onClick={() => {
                  setChangeBowler(false);
                }}
              />
              <SubmitButton name="Change" type="submit" />
            </Box>
          </Box>
        </form>
      </CustomModal>
    </>
  );
};

export default AddScore;
