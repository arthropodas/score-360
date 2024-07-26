import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  MenuItem,
  Pagination,
  Popover,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import { TournamentErrorCode } from "../../utils/errorCode/ErrorCode";
import { Box, Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getTournamentLists,
  tournamentDelete,
} from "../../Services/TournamentServices";
import TournamentCard from "../../components/Common/cards/tournamentCard/TournamentCard";
import TextBox from "../../components/Common/TextField/TextField/TextField";
import MuiTextField from "../../components/Common/TextField/MuiTextFiled";
import FilterListIcon from "@mui/icons-material/FilterList";
import { ToastService } from "../../components/Common/toast/ToastService";
import MyBreadcrumbs from "../../components/Common/breadcrumbs/breadcrumbs";
import { Link, useNavigate } from "react-router-dom";
import NoDataMessage from "../../components/Common/noData/NoData";
import AddIcon from "@mui/icons-material/Add";

const TournamentsList = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const { register, watch } = useForm();
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [orderby, setOrderBy] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const handleKey = (event) => {
    if (event.key === "Enter") {
      setSearch(watch("search"));
    }
  };

  const capitalizeFirstLetter = (sentence) => {
    return sentence
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const userData = JSON?.parse(localStorage?.getItem("authTokens"));

  useEffect(() => {
    if (userData) {
      getData();
    } else {
      navigate("/login");
    }
  }, [page, pageSize, search, category, orderby]);

  const handleCloseDialog = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpenDialog(false);
    }
  };

  const getData = () => {
    getTournamentLists(
      page,
      pageSize,
      search,
      category,
      userData.userId,
      orderby
    ).then((res) => {
      setRows(
        res?.data?.results.map((row) => ({
          ...row,
          tournament_category: capitalizeFirstLetter(row.tournament_category),
          ball_type: capitalizeFirstLetter(row.ball_type),
        }))
      );

      setCount(res?.data?.count);
    });
  };
  const handleDeleteConfirmed = () => {
    tournamentDelete(selected)
      .then((res) => {
        ToastService("Tournament deleted successfully", "success");
        getData();
      })
      .catch((error) => {
        ToastService(
          TournamentErrorCode(error.response.data.errorCode),
          "error"
        );
      });
    setSelected([]);
    handleCloseDialog();
  };

  return (
    <form>
      <Box paddingTop={3}>
        <MyBreadcrumbs />
      </Box>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: { xs: "block", md: "flex" },
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            width: { xs: "auto", md: "20%" },
            height: { xs: "35vh", md: "35%", padding: "25px" },
          }}
        >
          <h4>Type</h4>

          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group"></FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              defaultValue={"all"}
              onChange={(e) => {
                setOrderBy(e.target.value);
              }}
            >
              <FormControlLabel value="all" control={<Radio />} label="All" />
              <FormControlLabel
                value="ongoing"
                control={<Radio />}
                label="Ongoing"
              />
              <FormControlLabel
                value="upcoming"
                control={<Radio />}
                label="Upcoming"
              />
              <FormControlLabel
                value="ended"
                control={<Radio />}
                label="Ended"
              />
            </RadioGroup>
          </FormControl>
        </Box>
        <Box
          className="right-box"
          sx={{
            display: "block",
            margin: 5,
            height: "auto",
            width: { xs: "100%", md: "100%" },
          }}
        >
          <Box
            className="search-and-heading"
            sx={{
              display: { xs: "bock", md: "flex" },
              marginTop: -8,
              width: "100%",
              ml: "auto",
              justifyContent: "center",
            }}
          >
            <Box
              className="Heading"
              sx={{
                padding: 3,
                marginLeft: { xs: -1, md: -6 },
                color: "grey",
                mt: 3,
              }}
            >
              <Typography sx={{ fontSize: { xs: 20, md: 25 } }}>
                All Cricket Tournaments
              </Typography>
            </Box>
            <Box
              className="search-field"
              sx={{
                ml: { xs: 0, md: "auto" },
                padding: 5,
                display: "flex",
                marginLeft: { md: "35%" },
              }}
            >
              <TextBox
                name="search"
                size="small"
                label="Search"
                type="text"
                title="Enter search term"
                InputProps={{
                  ...register("search", {
                    required: false,
                  }),
                  placeholder: "Search by Name,City",
                  onKeyDown: handleKey,
                }}
                borderRadius={40}
              />
              <IconButton
                sx={{ padding: 1,paddingTop:1,marginTop:-4, marginLeft: 0.5, mt: { xs: 3, md: 4 } }}
                size="small"
                onClick={handleSortClick}
                data-testId="sortBtn"
              >
                <FilterListIcon sx={{ marginTop: -3, height: 30  }} />
              </IconButton>
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Stack data-testId="options">
                  <Typography
                    style={{
                      border: "none",
                      outline: "none",
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                    data-testId="corporate"
                    component="button"
                    onClick={() => setCategory("Corporate")}
                  >
                    Corporate
                  </Typography>
                  <Typography
                    style={{
                      border: "none",
                      outline: "none",
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                    data-testId="Open"
                    component="button"
                    onClick={() => setCategory("Open")}
                  >
                    Open
                  </Typography>
                  <Typography
                    data-testId="School"
                    style={{
                      border: "none",
                      outline: "none",
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                    component="button"
                    onClick={() => setCategory("School")}
                  >
                    School
                  </Typography>
                  <Typography
                    style={{
                      border: "none",
                      outline: "none",
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                    data-testId="All"
                    component="button"
                    onClick={() => setCategory("")}
                  >
                    All
                  </Typography>
                </Stack>
              </Popover>
              <Link to="/tournament-register">
                <Tooltip
                  title="Create Tournament"
                  aria-label="add"
                  sx={{
                    color: "white",
                    position: "stickey",
                    bottom: { xs: "10%" },
                    top: { md: "29%" },
                    right: "4.5%",
                    marginTop: { xs: 1.5, md: -0.5 },
                    marginLeft: { xs: 1, md: 2 },
                  }}
                >
                  <Fab size="small" aria-label="add" color="primary">
                    <AddIcon color="white" />
                  </Fab>
                </Tooltip>
              </Link>
            </Box>
          </Box>
          <Box
            className="card-list"
            sx={{
              display: "flex",
              height: "auto",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                height: "auto",
                width: "75%",
                flexWrap: "wrap",
                flexGrow: 1,
                gap: 2,
                boxSizing: "border-box",
                justifyContent: "flex-start",
                ml: { xs: 0, md: 3 },
              }}
            >
              {rows.length > 0 ? (
                rows.map((row) => (
                  <TournamentCard
                    key={row.id} // Don't forget to add a unique key for each item when using map
                    tournamentData={row}
                    id={row.id}
                    setOpenDialog={setOpenDialog}
                    setSelected={setSelected}
                  />
                ))
              ) : (
                <Box sx={{ width: "80vw" }}>
                  <NoDataMessage
                    alignSelf={"center"}
                    message="No tournament found"
                  />
                </Box>
              )}
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", bottom: 0 }}>
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
                sx={{ marginTop: 0 }}
                label="rows"
                type="select"
                defaultValue="10"
                registerProps={register("pageSize")}
                select
                onChange={(e) => {
                  setPageSize(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </MuiTextField>
            </Box>
          </Box>
        </Box>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          disableEscapeKeyDown={true}
          disableBackdropClick={true}
        >
          <DialogTitle id="alert-dialog-title">
            {"Delete Confirmation"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete the selected tournament?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              data-testid="cancelButton"
              onClick={handleCloseDialog}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              data-testid="deleteButton"
              label="deleteButton"
              onClick={handleDeleteConfirmed}
              color="error"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </form>
  );
};

export default TournamentsList;
