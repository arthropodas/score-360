import React, {useState } from "react";
import { Button, Grid, Typography, Box, Fab } from "@mui/material";
import { useForm } from "react-hook-form";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelButton from "../../components/Common/buttons/cancelButton/CancelButton";
import SubmitButton from "../../components/Common/buttons/submitButton/SubmitButton";
import TextBox from "../../components/Common/TextField/TextField/TextField";
import { teamCreation } from "../../Services/TeamServices";
import AddIcon from "@mui/icons-material/Add";
import { BiSolidCricketBall } from "react-icons/bi";
import { ToastService } from "../../components/Common/toast/ToastService";
import { FormContainer } from "../../layout/formContainer/FormContainer";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
import CustomModal from "../../components/Common/box/modal/Modal";
import { ErrorCode } from "../../utils/errorCode/ErrorCode";
import PropTypes from "prop-types";

export const TeamCreation = (props) => {
  let { tournamentId } = useParams();
  const [selectedFile, setSelectedFile] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [updateActive, setUpdateActive ] =useState (false);
  let flag= 0

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm();

  const handleOpenModal = () => {
    reset();
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedFile("");
    setOpenModal(false);
  };
  

  const onSubmit = async (data) => {
    console.log(updateActive,"first");
    setOpenModal(false);
    console.log(flag);
    flag= 1
    console.log(flag);
    setUpdateActive(true)
    console.log(setUpdateActive(true));
    console.log(updateActive,"second");
    setSelectedFile("");
    try {
      data.tournamentId = tournamentId;
      const response = await teamCreation(data);
      if (response.status === 200) {
        ToastService("Team created successfully", "success"); 
        setUpdateActive(false)
        reset();
        setSelectedFile("");
        handleCloseModal();
        props.updateTeamData();
      } else {
        reset();
        setUpdateActive(false)
      }
    } catch (error) {
      setUpdateActive(false)
      ToastService(ErrorCode(error.response?.data?.errorCode), "error");
    }
  };
  let fileName = "";
  if (selectedFile) {
    fileName = selectedFile.name.substring(0, 10); 
    if (selectedFile.name.length > 10) {
      fileName += "...";
    }
  }

  return (
    <>
              <Tooltip
                title="Add new team"
                 aria-label="add"
                 sx={{ 
                   color: "white",
                   position: "fixed",
                   bottom: { xs: "10%" },
                   top: { md: "26%" },
                   right: "4.5%",
                 }}
              >
                <Fab
                  aria-label="add"
                  color="primary"
                  data-testid="add-team-button"
                  onClick={handleOpenModal}
                  sx={{
                    width: 48, // Adjust width to reduce the size
                    height: 48, // Adjust height to reduce the size
                    marginTop:1,
                  }}
                  label="add-team-button"
                
                >
                  <AddIcon />
                </Fab>
              </Tooltip>

            
     
       

      <CustomModal open={openModal} onClose={handleCloseModal}>   
        <Grid container justifyContent="center" alignItems="center" spacing={2}> 
          <Grid item xs={12}>
            <Typography
              variant="h3"
              style={{ 
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
              textAlign="center"
              gutterBottom
            >
              ADD NEW TEAM
            </Typography>
            <Grid
              container
              justifyContent="center"
              style={{ marginTop: "20px" }} 
            >
              <Grid item xs={12} sm={6}>
                <Grid container justifyContent="center">
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      overflow: "hidden",
                    }}
                  >
                    {selectedFile ? (
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover", 
                        }}
                      />
                    ) : (
                      <BiSolidCricketBall
                        style={{
                          width: "100%",
                          color: "#8B0000",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              marginLeft={1}
              sx={{ "@media (max-width: 600px)": { marginLeft: "29px" } }}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormContainer>
                  <TextBox
                    label={
                      <span>
                        Team name<span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    name="teamName"
                    type="text"
                    variant="outlined"
                    title="Team name"
                    InputProps={{
                      ...register("teamName", {
                        required: "Team name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                        pattern: {
                          value: /^(?!.*\s{2})[^\s].*[^\s]$/g,
                          message: "Invalid Team Name",
                        },
                        maxLength: {
                          value: 100,
                          message: "Name not more than 100 characters",
                        },
                        validate: {
                          whitespace: (value) =>
                            value.trim() !== "" ||
                            "Team name cannot contain only whitespace",
                        },
                      }),
                    }}
                    error={!!errors.teamName}
                    helperText={errors.teamName?.message || ""}
                  />

                  <TextBox
                    label={
                      <span>
                        City<span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    name="city"
                    type="text"
                    variant="outlined"
                    title="city"
                    InputProps={{
                      ...register("city", {
                        required: "City is required",
                        minLength: {
                          value: 2,
                          message: "City must be at least 2 characters",
                        },
                        maxLength: {
                          value: 100,
                          message: "city not more than 100 characters",
                        },
                        pattern: {
                          value:/^(?!\s)(?!.*\s$)(?!.*\s{2})[a-zA-Z\d., -]+$/,
                          message: "Invalid city Name",
                        },
                        validate: {
                          whitespace: (value) =>
                            value.trim() !== "" ||
                            "city name cannot contain only whitespace",
                        },
                      }),
                    }}
                    error={!!errors.city}
                    helperText={errors.city?.message || ""}
                  />
                </FormContainer>
                <Box sx={{ width: "90%" }}>
                  <Grid item xs={12} sm={12}>
                    <Grid
                      sx={{
                        width: "90%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                      padding={"17px"}
                      container
                      alignItems="center"
                    >
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        paddingBottom="6px"
                      >
                        Upload your team logo
                      </Typography>
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        paddingBottom="6px"
                        sx={{ fontSize: "11px" }}
                      >
                        Only PNG, JPG, and JPEG formats are permitted, with a
                        maximum size of 2MB. 
                      </Typography>
                      {selectedFile ? (
                        <Button
                          variant="contained"
                          title="Remove file"
                          sx={{
                            width: "100px",
                            backgroundColor: "#FB8B24",
                            color: "dark",
                            "&:hover": {
                              backgroundColor: "#E36414",
                            },
                          }}
                          onClick={() => {
                            setValue("logo", null);
                            setSelectedFile("");
                          }}
                        >
                          <CloseIcon sx={{ mr: 1 }} /> Remove
                        </Button>
                      ) : (
                        <label htmlFor="file-upload">
                          <Button
                            variant="contained"
                            title="Upload file"
                            sx={{
                              width: "100px",
                              backgroundColor: "#FB8B24",
                              color: "dark",
                              "&:hover": {
                                backgroundColor: "#E36414",
                              },
                            }}
                            component="span"
                          >
                            <CloudUploadIcon sx={{ mr: 1 }} />
                            Upload
                          </Button>
                        </label>
                      )}

                      <input
                        id="file-upload"
                        type="file"
                        style={{ display: "none" }}
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            if (
                              ![
                                "image/png",
                                "image/jpeg", 
                                "image/jpg",
                              ].includes(file.type)
                            ) {
                              setSelectedFile("");
                              setError("logo", {
                                type: "manual",
                                message:
                                  "Only PNG, JPEG, or JPG files are allowed.",
                              });
                            } else if (file.size > 2 * 1024 * 1024) {
                              setError("logo", {
                                type: "manual",
                                message: "File size exceeds 2 MB.",
                              });
                              setSelectedFile("");
                            } else {
                              setValue("logo", file);
                              setSelectedFile(file);
                              clearErrors("logo");
                            }
                          } else {
                            setValue("logo", null);
                            setSelectedFile("");
                          }
                        }}
                      />

                      <Tooltip title={selectedFile ? selectedFile.name : ""}>
                        <Typography variant="body2" color="textPrimary">
                          {fileName}
                        </Typography>
                      </Tooltip>
                      <Tooltip title={errors.logo?.message}>
                        <Typography
                          variant="body2"
                          color="error"
                          style={{ marginTop: "5px" }}
                        >
                          {errors.logo?.message}
                        </Typography>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Box>

                <Grid container spacing={2}> 
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <CancelButton
                      title="Cancel"
                      onClick={handleCloseModal}
                      width="100%"
                      name="Cancel"
                      disabled={false}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <SubmitButton
                      title="Add new team"
                      width="100%"
                      name="Add"
                      disabled={updateActive} 
                    />
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Grid>
      </CustomModal>
    </>
  );
};

TeamCreation.propTypes = {
  updateTeamData: PropTypes.func.isRequired,
};
