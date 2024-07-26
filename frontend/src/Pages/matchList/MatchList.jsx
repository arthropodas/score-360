import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Fab,
  Tooltip,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useParams } from "react-router-dom";
import MatchCard from "../../components/Common/matchCard/MatchCard";
import NoDataMessage from "../../components/Common/noData/NoData";
import AddIcon from "@mui/icons-material/Add";
import {
  deleteMatch,
  listMatches,
  matchFixture,
} from "../../Services/MatchServices";
import {
  MatchDeleteErrorCode,
  matchErrorCode,
} from "../../utils/errorCode/ErrorCode";
import { ToastService } from "../../components/Common/toast/ToastService";
import Loader from "../../components/Common/loader/Loader";

import CoinToss from "../coinToss/CoinToss";
import MatchEdit from "../matchEdit/MatchEdit";
import MuiTextField from "../../components/Common/TextField/MuiTextFiled";
import { useForm } from "react-hook-form";
import SubmitButton from "../../components/Common/buttons/submitButton/SubmitButton";
import CustomModal from "../../components/Common/box/modal/Modal";
import vs from "../../assets/vs.png";
import SearchField from "../../components/Common/TextField/TextField/TextField";
import PlayingEleven from "../playingEleven/PlayingEleven";

const altMsg = "Yet to be updated";
const MatchList = () => {
  let { tournamentId } = useParams();
  const [matchData, setMatchData] = useState([]);
  const [matchInfo, setMatchInfo] = useState();
  const [loading, setLoading] = useState(false);
  const [teamOne, setTeamOne] = useState("");
  const [teamTwo, setTeamTwo] = useState("");
  const [grounds, setGrounds] = useState([]);

  const [close, setClose] = useState(false);
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpens, setIsOpens] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [matchId, setMatchId] = useState();
  const pageSize =12
  const [search, setSearch] = useState();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(null);
  const [isLoadmoreDisplayed, setIsLoadmoreDisplayed] = useState(false);
  const [elevenOpen,setElevenOpen]=useState(false)
  const [teams,setTeams]=useState({team1:{},team2:{}})
  

  const { register, handleSubmit } = useForm();
  const getRoundLabel = (id) => {
    const roundLabels = {
      1: "Round one",
      2: "Semi-finals",
     
    };
    return roundLabels[id] || "Final";
  };
  const handlePageChange = () => {

   
        setPage(prevPage => prevPage + 1);        
      
    
  };
  useEffect(() => {
   
    listMatch();
  }, [tournamentId, refresh, sort, search, page, pageSize, refresh]);

  const onSubmit = async (data) => {
    setSearch(data.search);
    setIsLoadmoreDisplayed(false); 
    setPage(1)
    setMatchData([])
   
  };

  const listMatch = async () => {
    setLoading(true);
    try {
      const response = await listMatches(
        tournamentId,
        sort,
        search,
        page,
        pageSize
      );
      setMatchData((prevData) => [...prevData, ...response?.data?.results]);
     
      if (response?.data?.next==null)
        {
          setIsLoadmoreDisplayed(true); 
        }
     
    } catch (error) {
    
      ToastService(" unexpected error", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchData = async () => {
    setClose(true);
    setIsLoadmoreDisplayed(false); 
    try {
      setLoading(true);
      
      await matchFixture(tournamentId);
      setMatchData([])
      setPage(1)
      setRefresh((prevRefresh) => !prevRefresh);
      ToastService("Match fixture generated", "success");
      
      setTimeout(() => {
        setClose(false);
      }, 1950);
    } catch (error) {
      ToastService(matchErrorCode(error?.response?.data?.errorCode), "error");

      setTimeout(() => {
        setClose(false);
      }, 1950);
    } finally {
      setLoading(false);
    }
  };
  const handleReply = (teamOneDetails, teamTwoDetails, matchId) => {
    setTeamOne(teamOneDetails);

    setTeamTwo(teamTwoDetails);
    setMatchId(matchId);

    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const openModal = () => {
    setIsOpens(true);
  };
  const closeModal = () => {
    setIsOpens(false);
  };

  const handleDeleteConfirmed = async () => {
    try {
      console.log(loading);
      const response = await deleteMatch({ tournamentId: tournamentId });
      setIsOpens(false);
      if (response.status === 200) {
        ToastService("Match Deleted successfully", "success");
        setMatchData([])
        setRefresh((prevRefresh) => !prevRefresh);
      }
    } catch (error) {
      setIsOpens(false);
      ToastService(
        MatchDeleteErrorCode(error.response.data.errorCode),
        "error"
      );
    }
  };

  const renderMatchContent = () => {
    if (matchData?.length > 0) {
      return (
        <>
        <Box sx={{ flexGrow: 1, mt: 3 }}>
          <Grid container spacing={1}>
            {matchData.map((matchData) => (
              <Grid item  key={matchData.id} xs={12} md={4}>
                <MatchCard
                  opponent_one={matchData.opponent_one}
                  opponent_two={matchData.opponent_two}
                  tossDecision={matchData.toss_decision}
                  onReply={handleReply}
                  setRefresh={setRefresh}
                  matchId={matchData.id}
                  setIsOpen={setIsOpen}
                  setMatchId={setMatchId}
                  matchIds={matchData.id}
                  grounds={grounds}
                  matchData={matchData}
                  setIsInfoOpen={setIsInfoOpen}
                  setMatchInfo={setMatchInfo}
                  setElevenOpen={setElevenOpen}
                  setTeams={setTeams}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
         <Grid item xs={12} md={12}>
         <Box
           sx={{
             display: "flex",
             justifyContent: "center",
             alignContent: "center",
             width: "100%",
             mt: 2,
             flexDirection: { xs: "column", md: "row" },
           }}
         >
           <Button label="loadmore" title="Load more matches" disabled={isLoadmoreDisplayed} onClick={handlePageChange}>Load more</Button>
         </Box>
       </Grid>
       </>
      );
    } else {
      return <NoDataMessage message="No matches found" />;
    }
  };

  return (
    <>
      {loading ? <Loader /> : <></>}
      
      <Grid container justifyContent="center">
        <Grid
          item
          xs={12}
          md={12}
          sm={12}
          sx={{ marginLeft: { xs: "0%", sm: "50%", md: "50%" } }}
        >
          <Box
            className="controls"
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexDirection: { xs: "column", md: "row" },
              padding: 1,
              alignContent: "center",
          
            }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box
                className="controls"
                sx={{
                  display: "flex",
                  gap: 2,
                  width: { xs: "100%", md: "row" },
                  justifyContent: "center",
                  flexDirection: { xs: "column", md: "row" },
                  padding: 0,
                  alignContent: "center",
                }}
              >
                <Box>
                  <SearchField
                    size="small"
                    label={"Search"}
                    placeholder="Search by team"
                    borderRadius={"30px"}
                    data-testid="search"
                    title="Enter search team"
                    InputProps={{
                      ...register("search", {
                        required: false,
                        pattern: /^\S(?:.*\S)?$/,
                      }),
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit(onSubmit)();
                      }
                    }}
                  />
                </Box>

                <Box sx={{ width: { xs: "100%", md: 150 } }}>
                  <MuiTextField
                    textAlign="true"
                    size="small"
                    title="Please select round"
                    width="200px"
                    inputProps={{ "data-testid": "ground" }}
                    label={
                      <span>
                        Round<span style={{ color: "red" }}></span>
                      </span>
                    }
                    type="select"
                    defaultValue="None"
                    registerProps={register("filter", {
                      required: "gender is required",
                    })}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setIsLoadmoreDisplayed(false); 
                      setPage(1)
                      setMatchData([])
                        }
                    }
                    select
                  >
                    <MenuItem value={1} data-testid="male">
                      Round one
                    </MenuItem>
                    <MenuItem value={2} data-testid="male">
                      Semifinal{" "}
                    </MenuItem>
                    <MenuItem value={3} data-testid="male">
                      Final{" "}
                    </MenuItem>
                    <MenuItem value={10} data-testid="male">
                      All{" "}
                    </MenuItem>
                  </MuiTextField>
                </Box>
              </Box>
            </form>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                "@media (max-width: 600px)": {
                  justifyContent: "right", // Adjust for phone view
                  paddingLeft: "10px", // Add left padding for phone view
                },
              }}
            >
              <SubmitButton
                datatestid="delete"
                label="Delete"
                name="delete"
                title={"Delete match fixtures"}
                onClick={openModal}
                width="100%"
                marginTop={2}
                sx={{ marginTop: { xs: 0, md: 2 } }}
              />
            </Box>
            <Box
              sx={{
                justifyContent: "center",
                mt:.2,
                "@media (max-width: 600px)": {
                  justifyContent: "right", // Adjust for phone view
                  paddingLeft: 40, // Add left padding for phone view
                },
              }}
            >
              <Tooltip
                title="Generate match"
                aria-label="add"
                sx={{
                  color: "white",
                  position: "relative",
                  bottom: { xs: "10%" },
                  top: { md: "26%" },
                  right: "4.5%",
                  
                }}
              >
                <Fab
                  aria-label="add"
                  color="primary"
                  data-testid="generate"
                  onClick={() => {
                    fetchMatchData();
                  }}
                  sx={{
                    width: 48, // Adjust width to reduce the size
                    height: 48, // Adjust height to reduce the size
                    marginTop: 1,
                  }}
                  label="generate"
                  disabled={close}
                >
                  <AddIcon />
                </Fab>
              </Tooltip>
            </Box>
          </Box>
        </Grid>
        {renderMatchContent()}
       
      </Grid>
       <CustomModal open={elevenOpen} width={'60vw'} height={'70vh'} >
        <PlayingEleven setElevenOpen={setElevenOpen} teams={teams} matchId={matchId } />
       </CustomModal>
      <CustomModal open={open} width={"30%"} height={"50%"}>
        <CoinToss
          teamOne={teamOne}
          teamTwo={teamTwo}
          matchId={matchId}
          setRefresh={setRefresh}
          refresh={refresh}
          onCloseModal={handleModalClose}
          setTeams={setTeams}
        />
      </CustomModal>
      {matchId && (
        <MatchEdit
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          matchId={matchId}
          setGrounds={setGrounds}
        />
      )}
      <CustomModal open={isInfoOpen} padding={0}>
        <Box
          sx={{
            display: "flex",
            gap: 5,
            width: "100%",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Grid maxWidth={70}>
            <Box
              variant="h6"
              justifyContent="center"
              sx={{
                fontWeight: "600",
                lineHeight: "0.8rem",
                fontSize: { xs: "0.750rem", md: "0.8rem" },
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <Tooltip title={matchInfo?.opponent1}>
                <Typography variant="h6">
                  {matchInfo?.opponent2.length > 7
                    ? `${matchInfo?.opponent1.substring(0, 7)}.....`
                    : matchInfo?.opponent1}
                </Typography>
              </Tooltip>
            </Box>
          </Grid>
          <Grid sx={{ width: 30, height: 30 }}>
            <img
              src={vs}
              alt="VS"
              style={{ width: "100%", height: "auto", padding: 2 }}
            />
          </Grid>
          <Grid maxWidth={70}>
            <Tooltip title={matchInfo?.opponent2}>
              <Typography variant="h6">
                {matchInfo?.opponent2.length > 7
                  ? `${matchInfo?.opponent2.substring(0, 7)}...`
                  : matchInfo?.opponent2}
              </Typography>
            </Tooltip>
          </Grid>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography>
            Match date : {matchInfo?.match_date || altMsg}
          </Typography>
          <Typography>
            Match time : {matchInfo?.match_time || altMsg}
          </Typography>
          <Typography>Ground : {grounds[matchInfo?.ground -1 ]|| altMsg}</Typography>
          <Typography>Round:{getRoundLabel(matchInfo?.round) || altMsg} </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <SubmitButton
            onClick={() => {
              setIsInfoOpen(false);
            }}
            name="Ok"
          />
        </Box>
      </CustomModal>

      <Dialog
        open={isOpens}
        onClose={closeModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disablebackdropclick={true.toString()}
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete generated match fixture?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            data-testid="cancelButton"
            onClick={closeModal}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            data-testid="deleteButton"
            onClick={handleDeleteConfirmed}
            color="error"
            autoFocus
            disabled={false}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MatchList;
