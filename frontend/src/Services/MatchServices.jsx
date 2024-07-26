import { axiosPrivate } from "../Services/CommonService/Interceptor";

export const matchFixture = (tournamentId) => {
  
    return axiosPrivate.post("/match/match_fixture", {tournamentId});
  };



  export const matchToss = (tossData) => {

    return axiosPrivate.patch("/match/toss",tossData);

  };
  export const deleteMatch = (tournamentId) => {
    return axiosPrivate.patch("/match/delete_match_fixture", tournamentId);
  };
  export const listMatches = (tournamentId,sort,search,page,pageSize) => {
    
    return axiosPrivate.get("/match/match_fixture_list", { params: { tournamentId,sort,search,page,pageSize } });
  };

  export const getMatch = (matchId) =>{
        return axiosPrivate.get("/match/get_match",{params:{matchId}})
  }

  export const getMatchScore = (matchId) =>{
    return axiosPrivate.get("/match/get_match_score",{params:{matchId}})
}


export const getMatchCurrentScore = (matchId) =>{
  return axiosPrivate.get("/score/match_score_data",{params:{matchId}})
}


  export const updateMatchSchedule =(matchId,data)=>{
    data["matchId"]=matchId
    return axiosPrivate.put("/match/update_match_schedule",data)
  }
  export const getPlayingEleven = (team1id,team2id,id)=>{
    return axiosPrivate.get("/match/getPlaying11",{params:{team1id,team2id,id}})
  }


  