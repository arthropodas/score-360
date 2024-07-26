import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { addPlayer, getPlayers } from "../../Services/TeamServices";
import SearchButton from "../../components/Common/buttons/searchButton/SearchButton";
import SearchField from "../../components/Common/TextField/TextField/TextField";
import { useForm } from "react-hook-form";
import { ToastService } from "../../components/Common/toast/ToastService";
import PropTypes from "prop-types";
import CustomModal from "../../components/Common/box/modal/Modal";
import { AddPlayerToTeamErrorMessage } from "../../utils/errorCode/ErrorCode";
import CancelButton from "../../components/Common/buttons/cancelButton/CancelButton";
import SubmitButton from "../../components/Common/buttons/submitButton/SubmitButton";
import PersonIcon from "@mui/icons-material/Person";
import Loader from "../../components/Common/loader/Loader";
import { Stack } from "@mui/system";

export const AddPlayers = ({ setIsAddOpen, isAddOpen, id , setIsRefresh,isRefresh}) => {
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [changed, setChanged] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [selected, setSelected] = useState([]);
  const [disabled,setDisabled]=useState()
  const [openDialog, setOpenDialog] = useState(false);
  const [loading,setLoading]=useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const handleAddCancel = () => {
    setOpenDialog(false);
  };
  const teamId = id;
  const isSelected = (email) => selected.indexOf(email) !== -1;

  const handleClick = (event, email) => {
    const selectedIndex = selected.indexOf(email);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, email];
    } else if (selectedIndex === 0) {
      newSelected = selected.slice(1);
    } else if (selectedIndex === selected.length - 1) {
      newSelected = selected.slice(0, -1);
    } else {
      newSelected = [
        ...selected.slice(0, selectedIndex),
        ...selected.slice(selectedIndex + 1),
      ];
    }

    setSelected(newSelected);
    console.log(newSelected.length); 
  };
  const myPlayers = () => {
    getPlayers(searchTerm, teamId)
      ?.then((res) => {
        setPlayers(res.data);
      })
      .catch((err) => {
        setPlayers([]);
      });
  };

  useEffect(() => {
    myPlayers();
  }, [searchTerm]);

  const onSubmit = (data) => {
    setSearchTerm(btoa(data.searchTerm));
    setClicked(!clicked);
  };

  const addToTeam = async (email, teamId) => {
    setDisabled(true)
    setLoading(true)
   

    try {
      const response = await addPlayer(email, teamId);
      if (response.status === 200) {
        setIsRefresh(prevIsRefresh => !prevIsRefresh);
        ToastService(" Added player successfully", "success");
        myPlayers();
        setTimeout(() => {
          setChanged(!changed);
        }, 1250);
        setSelected([]);
        setOpenDialog(false);
        setDisabled(false)
        setLoading(false)
        setIsAddOpen(false)


      }
    } catch (err) {
      ToastService(
        AddPlayerToTeamErrorMessage(err.response?.data?.errorCode),
        "error"
      );
      setOpenDialog(false);

      setChanged(!changed);
      setDisabled(false)
      setLoading(false)


    } finally {
      setTimeout(() => {
      }, 1250);
      setDisabled(false)
    }
  };

  return (
    <>
   {loading ?<Loader/>:<>
      <CustomModal open={isAddOpen} width={"50%"}>
      <Box label="Add Player">
        <Box>
       
            <Typography
              variant="h3"
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                
                
              }}
              textAlign="center"
              gutterBottom
            >
              ADD PLAYERS
            </Typography>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              label="searchbox"
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "center",
                marginBottom: 3,
                
              }}
            >    
              <Box  marginTop={1}sx={{ alignContent: "center" }}>
                <SearchField
                size='small'
                  label={"Search"}
                  borderRadius={"30px"}
                  placeholder="Search by player name and ID"
                  datatestid="search"
                  InputProps={{
                    ...register("searchTerm", {
                      required: false,
                      pattern: /^\S(?:.*\S)?$/,
                    }),
                  }}
                />
                {errors.searchTerm &&
                  errors.searchTerm.type === "pattern" && (
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{ marginLeft: 5 }}
                    >
                      Search term is not valid.
                    </Typography>
                  )}
              </Box>
              <Box >
                <SearchButton datatestid={"search"}  />
              </Box>

            </Box>
            <Box  marginTop={1}><p >Selection Count : { selected.length}</p></Box>
          </form>
          {players.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center ",  maxHeight: 220,
            width: { xs: "35rem", md: "35rem" },
            whiteSpace: "nowrap",
            overflow: "auto",
            textOverflow: "ellipsis",
            border: "2px solid #e0e0e0", // Add a solid border with a light gray color
            borderRadius: "10px", // Add border radius for rounded corners
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", 
            }}>
              <Typography>No players to display</Typography>
            </Box>
          ) : (
            <Box
              sx={{
                maxHeight: 220,
                width: { xs: "35rem", md: "35rem" },
                whiteSpace: "nowrap",
                overflow: "auto",
                textOverflow: "ellipsis",
                border: "2px solid #e0e0e0", // Add a solid border with a light gray color
                borderRadius: "10px", // Add border radius for rounded corners
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Add a subtle shadow for depth
                
                
              }}
            >
               <Box sx={{ display: "flex" }}>

                    
                    <Typography
                       sx={{
                        marginTop: 1,
                        marginLeft:14,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: { xs: "15rem", md: "17.5rem" },
                        display: "flex",
                        fontWeight: "bold", 
                        gap: 2,
                      }}
                    >
                         Name
                      
                    </Typography>
                    <Typography
                      sx={{
                        marginTop: 1,
                        fontWeight: "bold", 
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        ml: 4,
                      }}
                    >
                    Player ID
                    </Typography>
                  </Box>
              {players.map((player, index) => (
                <Box
                  key={players.player_id}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                    marginLeft:4
                  }}
                >
                  <Box sx={{ display: "flex" }}>
                    <Checkbox
                      onClick={(event) => handleClick(event, player.email)}
                      checked={isSelected(player.email)}
                      data-testid="playername"
                    />
                    <Typography
                      sx={{
                        marginTop: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: { xs: "15rem", md: "20rem" },
                        display: "flex",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <PersonIcon />
                      </Box>
                      {player.first_name + " " + player.last_name}
                    </Typography>
                    <Typography
                      sx={{
                        marginTop: 1,
                       
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        ml: 4,
                      }}
                    >
                      {player.player_id}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-evenly" , }}>
          
        <Stack
                direction="row"
                justifyContent="center"
                spacing={0}
                gap={4}
                container
              >
          <CancelButton
            datatestid="cancelButton"
            name="Cancel"
            onClick={() => {
              setIsAddOpen(false)
              setSearchTerm(null);
              setSelected([]);
              reset();
            }}
          />
          <SubmitButton
            name="Add"
            datatestid={"addButton"}
            disabled={selected.length < 1}
            onClick={() => {
              setOpenDialog(true);
             
            }}
            width={"50px"}
          />
          </Stack>
        </Box>
      </Box>
    </CustomModal>
<Dialog open={openDialog}>
      <DialogTitle>Add player confirmation</DialogTitle>
      <DialogContent>
        Are you sure you want to add the selected players to the team?
      </DialogContent>
      <DialogActions>
        <Button
          data-testid="cancelButton"
          onClick={handleAddCancel}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          data-testid="confirmButton"
          onClick={() => {
            
            addToTeam(selected, teamId);
          }}
          disabled={disabled}
          color="error"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
    </>
    }

    </>
  );
};

AddPlayers.propTypes = {
  setIsAddOpen: PropTypes.func.isRequired,
  isAddOpen: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  setIsRefresh:PropTypes.func,
  isRefresh:PropTypes.bool
};
