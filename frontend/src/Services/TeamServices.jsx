import { axiosPrivate } from "./CommonService/Interceptor";

export const teamCreation = (data) => {
  return axiosPrivate.post("team/create/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const teamList = (page, pageSize, search, order, id) => {
  return axiosPrivate.get("team/list/", {
    params: {
      page: page,
      pageSize: pageSize,
      search: search,
      order: order,
      tournamentId: id,
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const deleteTeam = (id) => {
  const data = {
    teamId: id,
  };

  return axiosPrivate.patch("team/delete/", data);
};
export const teamPlayerListing = (teamId) => {
  return axiosPrivate.get(`team/team_players_list`, { params: { teamId } });
};

export const getPlayers=(searchTerm,teamId)=>{
  return axiosPrivate.get('team/get_players/',{params:{searchTerm,teamId}})
}

export const addPlayer=(email,teamId)=>{
const data={"email":email}
  return axiosPrivate.post('team/add_player/',data,{params:{teamId}});
}

export const RemovePlayer = (playerId) => {
  return axiosPrivate.patch('team/remove_player', playerId )
}

export const getTeamData=(teamId) =>{
  return axiosPrivate.get("team/get_team/",{params:{teamId}},{headers:
  {
    "content-type":"multipart/form-data",
  }})
}

export const teamUpdation = (data, teamId) => {
  return axiosPrivate.patch(`team/update_team/`, data, {
    params: { teamId },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const addPlayingEleven =(data) =>{

  
  return axiosPrivate.post('match/add_playing11/',data)
}
export const getSquad = (teamId) =>{
  return axiosPrivate('match/get_squad',{params:{teamId}})
}