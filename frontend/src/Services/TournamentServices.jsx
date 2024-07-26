import { axiosPrivate } from "../Services/CommonService/Interceptor";

export const getUserData = async () => {
  return await axiosPrivate.get("player/user-data/");
};

export const tournamentRegister = (formData) => {
  return axiosPrivate.post("tournament/create/", formData);
};

export const tournamentEdit = (formData) => {
  return axiosPrivate.put("tournament/edit/", formData);  
};

export const getTournamentData = (tournamentId) => {
  return axiosPrivate.get(`/tournament/get/${tournamentId}/`);
};

export const tournamentDelete = (selectedIds) => { 
  const data = {
    tournament_ids: selectedIds,
  };
  return axiosPrivate.patch("/tournament/delete/", data);
};

export const getTournamentLists = (
  page,
  pageSize,
  search,
  
  category,
  id,
  sortTerm
) => {
  return axiosPrivate.get(`tournament/tournaments/`, {
    params: { page, pageSize, search, category, id,sortTerm },  
  });
};