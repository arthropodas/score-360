import { Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TextBox from "../../components/Common/TextField/TextField/TextField";
import { Box } from "@mui/system";
import { FormContainer } from "../../layout/formContainer/FormContainer";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ToastService } from "../../components/Common/toast/ToastService";
import { getTeamData, teamUpdation } from "../../Services/TeamServices";
import SubmitButton from "../../components/Common/buttons/submitButton/SubmitButton";
import CloseIcon from "@mui/icons-material/Close";
import { BiSolidCricketBall } from "react-icons/bi";

import PropTypes from "prop-types";

import {
  getTeamErrorCode,
  teamUpdationErrorCode,
} from "../../utils/errorCode/ErrorCode";
import CustomModal from "../../components/Common/box/modal/Modal";
import CancelButton from "../../components/Common/buttons/cancelButton/CancelButton";

const TeamEdit = ({ id, isOpen, setIsOpen, setChanges }) => {
  const [selectedFile, setSelectedFile] = useState();
  const [teamData, setTeamData] = useState();
  const [isUpdated, setIsUpdated] = useState(false);
  let imageSrc = null;

  if (teamData?.logo) {
    imageSrc = teamData?.logo;
  } else if (selectedFile) {
    imageSrc = URL.createObjectURL(selectedFile);
  } else {
    imageSrc = "";
  }
  let content;
  if (imageSrc) {
    content = (
      <img
        src={imageSrc}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    );
  } else {
    content = (
      <BiSolidCricketBall
        style={{
          width: "100%",
          color: "#8B0000",
          height: "100%",
          objectFit: "cover",
        }}
      />
    );
  }

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm();

  useEffect(() => {
    getTeamData(id)
      .then((res) => {
        setTeamData(res?.data);
        console.log(res.data);
        reset({ teamName: res?.data?.team_name, city: res?.data?.city });
      })
      .catch((err) => {
        ToastService(getTeamErrorCode(err.response?.data?.errorCode), "error");
      });
  }, [id, isOpen]);

  const onSubmit = async (data) => {
    setIsUpdated(true)
    setSelectedFile("");

    try {
      await teamUpdation(data, id);
      reset()
      ToastService("Team updated successfully", "success");
      setSelectedFile("");
      setChanges(true);
        setIsOpen(false);
        setIsUpdated(false)

   
    } catch (error) {
      reset();
      ToastService(
        teamUpdationErrorCode(error?.response?.data?.errorCode),
        "error"
      );
      setIsUpdated(false)
    }
  };

  return (
    <CustomModal open={isOpen}>
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
            EDIT TEAM
          </Typography>
          <Grid container justifyContent="center" style={{ marginTop: "20px" }}>
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
                  {content}
                </div>
              </Grid>
            </Grid>
          </Grid>

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
                title="Team Name"
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  ...register("city", {
                    required: "City is required",
                    minLength: {
                      value: 2,
                      message: "City must be at least 2 characters",
                    },
                    pattern: {
                      value: /^(?!\s)(?!.*\s$)(?!.*\s{2})[a-zA-Z\d., -]+$/,

                      message: "Invalid city Name",
                    },
                    maxLength: {
                      value: 100,
                      message:
                        "city name should not be more than 100 characters",
                    },
                  }),
                }}
                error={!!errors.city}
                helperText={errors.city?.message || ""}
              />
            </FormContainer>
            <Box sx={{ marginTop: "5px", width: "90%" }}>
              <Grid item xs={12} sm={12} style={{ marginTop: "10px" }}>
                <Grid
                  container
                  padding={"17px"}
                  sx={{
                    display: "flex",
                    width: "90%",
                    justifyContent: "space-between",
                  }}
                  alignItems="center"
                >
                  <Typography
                    color="textPrimary"
                    variant="body1"
                    paddingBottom="6px"
                  >
                    Upload your team logo
                  </Typography>
                  <Typography
                    paddingBottom="6px"
                    color="textPrimary"
                    variant="body1"
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
                        backgroundColor: "#FB8B24",
                        width: "100px",
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
                        title="Upload file"
                        sx={{
                          width: "100px",
                          backgroundColor: "#FB8B24",
                          color: "dark",
                          "&:hover": {
                            backgroundColor: "#E36414",
                          },
                        }}
                        variant="contained"
                        component="span"
                      >
                        <CloudUploadIcon sx={{ mr: 1 }} />
                        Upload
                      </Button>
                    </label>
                  )}

                  <input
                    type="file"
                    id="file-upload"
                    accept="image/png, image/jpeg, image/jpg"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files[0];

                      if (file) {
                        if (
                          !["image/jpeg", "image/png", "image/jpg"].includes(
                            file.type
                          )
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
                  onClick={() => {
                    reset()
                    setIsOpen(false);
                    setSelectedFile(null);
                    
                  }}
                  title="Cancel"
                  width="100%"
                  name="Cancel"
                  datatestid={'cButton'}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <SubmitButton
                  label="update team"
                  title="Update"
                  width="100%"
                  name="Update"
                  disabled={isUpdated}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: "flex", justifyContent: "center" }}
              ></Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              ></Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default TeamEdit;
TeamEdit.propTypes = {
  id: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  setChanges: PropTypes.func.isRequired,
};
