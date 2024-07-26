import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Badge,
  TableContainer,
} from "@mui/material";
import { green } from "@mui/material/colors";
import { useNavigate, useParams } from "react-router-dom";
import { getMatchCurrentScore, getMatchScore } from "../../Services/MatchServices";
import { BiSolidCricketBall } from "react-icons/bi";


const webSocketEndpoint = require('../../utils/EndPoints');


const LiveScoreView= ()=> {

  const navigate =useNavigate();
 
  const [displayedData, setDisplayedData] = useState([]);
 
  const [scoreData, setScoreData] = useState({
    batterOneStats: {
      name: "",
      runs: 0,
      fours: 0,
      sixes: 0,
      ballsFaced: 0,
      strikeRate: 0,
      id: "",
    },
    batterTwoStats: {
      name: "",
      runs: 0,
      fours: 0,
      sixes: 0,
      ballsFaced: 0,
      strikeRate: 0,
      id: "",
    },
    bowlerStats: {
      name: "",
      balls: 0,
      runs: 0,
      wkts: 0,
      eco: 0,
    },
    teamOvers: 0,
    teamTotal: 0,
    teamWickets: 0,
    teamBowlingOvers: 0,
    teamBowlingTotal: 0,
    teamBowlingwickets: 0,
    battingTeamId: "",
    bowlingTeamId: "",
    striker: "",
    currentOverStats: [],
  });
  const [bowlingTeamData,setBowlingTeamData] = useState({
    teamBowlingOvers: 0,
    teamBowlingTotal: 0,
    teamBowlingwickets: 0,
  });
  const [inningsNo,setInningsNo] = useState(1);
 

  const { id } = useParams();
  

  useEffect(() => {
    const fetchData = async () => {


      try {
       
        const response = await getMatchScore(id);
        
        setDisplayedData(response.data);

        const response1 = await getMatchCurrentScore(id);
        if(response1.data!==0)
          {
            setScoreData(response1.data)
      
            setBowlingTeamData(response1.data)
          }
        
        console.log("current score",response1.data);
      } catch (error) {
        
        const errorCode = error?.response?.data?.errCode;

        if (errorCode === "7777" ) {
          navigate("/notfound");
        } 
      }
    };

    fetchData();

    const sockets = new WebSocket(
      `${webSocketEndpoint}update_score/?match_id=${id}`
    );

    sockets.onopen = () => {
      console.log("WebSocket connected");
     
      
    };
    
    sockets.onmessage = async(event) => {
      
       
        const jsonData = JSON.parse(event.data).replace(/'/g, '"');
       
       
        const parsedNew= JSON.parse(jsonData);
        console.log(typeof(parsedNew));
        console.log(parsedNew);
    
      setScoreData(await parsedNew);
      console.log("statee????????",scoreData);
      setInningsNo(await scoreData?.inningsNo)

    };
   
  }, [inningsNo]);

  let tossWinner = null;
  let losser= null
  const groundIndex = displayedData.ground - 1;
  const ground = displayedData.ground
    ? displayedData.grounds[groundIndex]
    : null;
  if (displayedData.toss_winner === displayedData.opponent_one) {
    tossWinner = displayedData.team_one_name;
    losser=displayedData.team_two_name
  } else if (displayedData.toss_winner === displayedData.opponent_two) {
    tossWinner = displayedData.team_two_name;
    losser=displayedData.team_one_name
  }
console.log("displayedData",displayedData,"display team one name:",displayedData.team_one_name);
  const matchInfo = {
    team1: displayedData?.team_one_name,
    team2: displayedData?.team_two_name,
    venue: displayedData?.city,
    date: displayedData?.match_date,
    time: displayedData?.match_time,
    tossWinner:tossWinner,
    losser:losser,
    tournament: displayedData?.tournamet_name,
    ground: ground,
    toss_decision:displayedData?.toss_decision === 1 ?"bat":"bowling",
    status:displayedData?.status ===6? "Past":"Live"
  };
  
  const batsmen = [
    {
      
      name: scoreData?.batterOneStats?.name,
      runs: scoreData?.batterOneStats?.runs,
      fours: scoreData?.batterOneStats?.fours,
      sixes: scoreData?.batterOneStats?.sixes,
      ballsFaced: scoreData?.batterOneStats?.ballsFaced,
      strikeRate: scoreData?.batterOneStats?.strikeRate, 
      strick: scoreData?.striker===scoreData?.batterOneStats?.id?true:false
    },
    {
      batsmanId:scoreData?.batterTwoStats?.id,
      name: scoreData?.batterTwoStats?.name,
      runs: scoreData?.batterTwoStats?.runs, 
      fours: scoreData?.batterTwoStats?.fours,
      sixes: scoreData?.batterTwoStats?.sixes,
      ballsFaced: scoreData?.batterTwoStats?.ballsFaced,
      strikeRate:scoreData?.batterTwoStats?.strikeRate,
      strick:scoreData?.striker===scoreData?.batterTwoStats?.id?true:false
    },
  ];

  const bowlers = [
    {
      name: scoreData?.bowlerStats?.name,
      balls: scoreData?.bowlerStats?.balls,
      run: scoreData?.bowlerStats?.runs,
      wkts: scoreData?.bowlerStats?.wkts,
      eco: scoreData?.bowlerStats?.eco
     
    },
  ];
  const team_batting = 
   {
    totalOver:scoreData?.teamOvers,
    totalRuns:scoreData?.teamTotal,
    totalWicket:scoreData?.teamWickets,
    teamName: scoreData?.battingTeamId === displayedData?.opponent_one? matchInfo.team1:matchInfo.team2
   }
  
  const team_bowling = 
    {
     totalOver:bowlingTeamData?.teamBowlingOvers,
     totalRuns:bowlingTeamData?.teamBowlingTotal,
     taotalWicket:bowlingTeamData?.teamBowlingwickets,
     teamName: scoreData?.bowlingTeamId === displayedData?.opponent_one? matchInfo.team1:matchInfo.team2
    }


if(scoreData.batterOneStats.name==="")
  {
    team_batting.teamName= matchInfo["toss_decision"]==="bat"?matchInfo["tossWinner"]:matchInfo["losser"]
    team_bowling.teamName= matchInfo["toss_decision"]==="bat"?matchInfo["losser"]:matchInfo["tossWinner"]
  }
    

  const runs=scoreData?.currentOverStats
  const balls = runs?.map((run) => (
    <div key={run} style={{ width: 30, height: 30, borderRadius: '50%',marginTop:10, backgroundColor: '#ccc', marginRight: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontSize:12 }}>{run}</div>
  ));

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Paper style={{ padding: 20, flexGrow: 1 }}>
       
        <Card variant="outlined" >
          <CardContent style={{ backgroundColor: green[50], padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{
                    fontWeight: "bold",
                    color: green[400],
                    marginBottom: 10,
                  }}
                >
                  {matchInfo.tournament}
                </Typography>
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  marginRight: 10,
                  justifyContent: "flex-end",
                }}
              >
                <Badge
                  color={"error"}
                  badgeContent={matchInfo.status}
                  style={{ marginLeft: 10 }}
                >
                
                </Badge>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Typography
                variant="body1"
                gutterBottom
                alignItems="center"
                style={{ fontSize: 16, marginBottom: 5,marginTop:1 }}
              >
                Venue: {matchInfo.venue}, {matchInfo.ground}, {matchInfo.date},
                {matchInfo.time}  <BiSolidCricketBall color="red"  style={{ marginTop: 8 }}/>
              </Typography>
             
              

              <Typography
                variant="body1"
                gutterBottom
                
                style={{ fontSize: 15, marginBottom: 5 , color: green[300],}}
              >
                Toss Decision: {matchInfo["tossWinner"]} opt to {matchInfo["toss_decision"]}
              </Typography>

              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <Typography
                    variant="body1"
                    gutterBottom
                    style={{
                      fontSize: 20,
                      fontWeight:50,
                      fontStyle: "italic",
                      marginBottom: 5,
                    }}
                  >
                  <b>  {team_batting.teamName}</b>
                  </Typography>
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    fontWeight:50,
                    fontSize: 20,
                    marginRight: 10,
                    justifyContent: "flex-end",
                  }}
                >
                  <b>{team_batting?.totalRuns}/{team_batting?.totalWicket} </b>({team_batting?.totalOver})
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <Typography
                    variant="body1"
                    gutterBottom
                    style={{
                      fontSize: 20,
                      fontWeight:50,
                      fontStyle: "italic",
                      marginBottom: 5,
                    }}
                  >
                   <b> {team_bowling.teamName}</b>
                  </Typography>
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    fontWeight:20,
                    fontSize: 18,
                    marginRight: 10,
                    justifyContent: "flex-end"
                  }}
                >
                  {team_bowling.totalOver===0? (<b><i>not yet</i></b>):(<><b>{team_bowling?.totalRuns}/{team_bowling?.taotalWicket}  </b> ({(team_bowling?.totalOver)})</>)}
                 
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div style={{ marginTop: 20, overflow: "auto", flexGrow: 1 }}>
          <Card variant="outlined" sx={{ marginBottom: 4 }}>
            <CardContent style={{ padding: 20 }}>
            <TableContainer style={{ maxHeight: 400 }}>
              <Table>
                <TableHead
                style={{
                  backgroundColor:
                     green[50] ,
                }}>
                
                  <TableRow>
                    <TableCell>
                      <strong>Batsman</strong>
                    </TableCell>
                    <TableCell>
                      <strong>R</strong>
                    </TableCell>
                    <TableCell>
                      <strong>B</strong>
                    </TableCell>
                    <TableCell>
                      <strong>4s</strong>
                    </TableCell>
                    <TableCell>
                      <strong>6s</strong>
                    </TableCell>
                    <TableCell>
                      <strong>SR</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {batsmen.map((batsman) => (
                    <TableRow
                      key={batsman}
                      
                    >
                     <TableCell  style={{ width: '30%', wordBreak: 'break-all' }}>{batsman?.name} ({team_batting.teamName})    {batsman === batsmen[0]&& 
                          <span role="img" aria-label="bat">
                                🏏
                              </span>
                          }</TableCell>
                      <TableCell>{batsman.runs}</TableCell>
                      <TableCell>{batsman.ballsFaced}</TableCell>
                      <TableCell>{batsman.fours}</TableCell>
                      <TableCell>{batsman.sixes}</TableCell>
                      <TableCell>{batsman.strikeRate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </TableContainer>
              </CardContent>
              </Card>
              <Card variant="outlined">
            <CardContent style={{ padding: 20 }}>
            <TableContainer style={{ maxHeight: 400 }}>
              <Table>
                <TableHead  style={{
                        backgroundColor:
                           green[50] ,
                      }}>
                  <TableRow>
                    <TableCell>
                      <strong>Bowler</strong>
                    </TableCell>
                    <TableCell>
                      <strong>O</strong>
                    </TableCell>
                    <TableCell>
                      <strong>R</strong>
                    </TableCell>
                    <TableCell>
                      <strong>W</strong>
                    </TableCell>
                    <TableCell>
                      <strong>ECO</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bowlers.map((bowlers) => (
                    <TableRow
                      key={bowlers}
                     
                    >
                       <TableCell  style={{ width: '30%', wordBreak: 'break-all' }}>{bowlers.name} ({team_bowling.teamName})</TableCell>
                      <TableCell>{bowlers.balls}</TableCell>
                      <TableCell>{bowlers.run}</TableCell>
                      <TableCell>{bowlers.wkts}</TableCell>
                      <TableCell>{bowlers.eco}</TableCell>
                    </TableRow>
                  
                  ))}
                    
                </TableBody>
               
              </Table>
              
              
              </TableContainer>
              <div style={{ display: 'flex', flexDirection: 'row' , marginTop:15 , overflowX: 'auto', 
    maxWidth: '100%',  flexWrap: 'wrap', }}> {balls}
             </div>
            </CardContent>
            
          </Card>
          
        </div>
      </Paper>
    </div>
  );
};
export default LiveScoreView;
