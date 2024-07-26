import React, { useCallback, useEffect, useState } from "react";
import TeamCard from "../../components/Common/teamCard/TeamCard";
import { Grid, IconButton, MenuItem, Pagination, Tooltip } from "@mui/material";
import { Box, ThemeProvider } from "@mui/system";
import MuiTextField from "../../components/Common/TextField/MuiTextFiled";
import { useForm } from "react-hook-form";
import { teamList, deleteTeam } from "../../Services/TeamServices";
import { useParams } from "react-router-dom";
import SearchField from "../../components/Common/TextField/TextField/TextField";
import theme from "../../theme/Theme";
import { ToastService } from "../../components/Common/toast/ToastService";
import Loader from "../../components/Common/loader/Loader";
import { TeamCreation } from "../teamCreation/TeamCreation";
import TeamEdit from "../teamEdit/TeamEdit";
import NoDataMessage from "../../components/Common/noData/NoData";
import { TeamErrorCode } from "../../utils/errorCode/ErrorCode";
import { AddPlayers } from "../../Pages/addPlayers/AddPlayers";
import NotFound from "../../components/Common/notFound/NotFound";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

function TeamList() {
  const [teamData, setTeamData] = useState([]);
  const [count, setCount] = useState(0);
  const [isRefresh, setIsRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [order, setOrder] = useState("");
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [changes, setChanges] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);

  let { tournamentId } = useParams();
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const handleEditClick = (value) => {
    setId(value);
    setIsOpen(true);
  };
  const handleAddClick = (value) => {
    setId(value);
    setIsAddOpen(true);
  };

  const updateTeamData = () => {
    getData();
  };
  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await teamList(page, pageSize, search, order, tournamentId);
      setTeamData(res?.data?.results || []);
      setCount(res?.data?.count || 0);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setIsNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, order, isOpen, tournamentId]);

  useEffect(() => {
    getData();
  }, [getData, changes, isOpen, isRefresh]);

  const onSubmit = (data) => {
    setSearch(data.search);
    setOrder(data.order);
  };

  const handleAscending = () => {
    setOrder("ascending");
  };

  const handleDescending = () => {
    setOrder("descending");
  };

  const handleDelete = async (teamId) => {
    try {
      await deleteTeam(teamId);
      ToastService("team deleted successfully", "success");
      getData();
    } catch (error) {
      ToastService(TeamErrorCode(error.response.data.errorCode), "error");
    }
  };

  if (isNotFound) {
    return <NotFound />;
  }
  return (
    <ThemeProvider theme={theme}>
      {loading && <Loader />}

      <Grid item xs={12} md={6} sx={{ marginLeft: { xs: 0, sm: 10, md: 110 } }}>
        <Box
          className="controls"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center", // Align items vertically centered
            justifyContent: "center",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center", // Align items vertically centered
                justifyContent: "center",
                gap: -4,
              }}
            >
              <SearchField
                size="small"
                label={"Search"}
                borderRadius={"30px"}
                placeholder="Search by team"
                data-testid="search"
                title="Enter search term"
                InputProps={{
                  ...register("search", {
                    required: false,
                    pattern: /^\S(?:.*\S)?$/,
                  }),
                }}
              />

              <Tooltip title="Ascending">
                <IconButton
                  aria-label="Order"
                  onClick={handleAscending}
                  color={order === "ascending" ? "primary" : "default"}
                  sx={{ marginLeft: 1, marginTop: 1 }} // Adjust spacing between search field and IconButton
                >
                  <ArrowUpward style={{ fontSize: 32 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Descending">
                <IconButton
                  onClick={handleDescending}
                  color={order === "descending" ? "primary" : "default"}
                  sx={{ marginLeft: -1, marginRight: 1, marginTop: 1 }} // Adjust spacing between IconButton components
                >
                  <ArrowDownward style={{ fontSize: 32 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </form>
          <Box
            sx={{
              justifyContent: "center",
            }}
          >
            <TeamCreation updateTeamData={updateTeamData} />
          </Box>
        </Box>
      </Grid>
      {/* </Grid> */}

      {teamData.length > 0 ? (
        <Box sx={{ flexGrow: 1, mt: 6 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {teamData.map((team) => (
              <Grid
                item
                xs={12}
                md={4}
                key={team.id}
                alignItems="center"
                justify="center"
                padding={{ xs: 0 }}
              >
                <TeamCard
                  setIsAddOpen={setIsAddOpen}
                  setIsOpen={setIsOpen}
                  id={team.id}
                  teamName={team.team_name}
                  player_count={team.player_count}
                  city={team.city}
                  logo={team.logo}
                  dataTestId={"testid" + team.id}
                  onDelete={() => handleDelete(team.id)}
                  handleEditClick={(value) => handleEditClick(value)}
                  handleAddClick={(value) => handleAddClick(value)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <NoDataMessage message="No teams found" />
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <Pagination
          label="pagination"
          count={Math.ceil(count / pageSize)}
          color="primary"
          sx={{ marginTop: 2 }}
          page={page}
          onChange={handlePageChange}
        />

        <Box sx={{ width: { xs: 100, md: 85, marginTop: 5 } }}>
          <MuiTextField
            inputProps={{ "data-testid": "pageSize" }}
            sx={{ marginTop: 0 }}
            label="rows"
            type="select"
            defaultValue="12"
            registerProps={register("pageSize")}
            select
            onChange={(e) => {
              setPageSize(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value={12}>10</MenuItem>
            <MenuItem value={24}>15</MenuItem>
          </MuiTextField>
        </Box>

        {id && (
          <TeamEdit
            id={id}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setChanges={setChanges}
            isEditLoading={isEditLoading}
            setIsEditLoading={setIsEditLoading}
          />
        )}
        {id && (
          <AddPlayers
            id={id}
            isAddOpen={isAddOpen}
            setIsAddOpen={setIsAddOpen}
            setIsRefresh={setIsRefresh}
            isRefresh={isRefresh}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default TeamList;
