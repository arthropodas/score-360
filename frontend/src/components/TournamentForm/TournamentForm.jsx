import React from "react";
import { useForm, Controller } from "react-hook-form";
import MuiTextField from "../Common/TextField/MuiTextFiled";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import { PropTypes } from "prop-types";
import SubmitButton from "../../components/Common/buttons/submitButton/SubmitButton";
import CancelButton from '../../components/Common/buttons/cancelButton/CancelButton'
import {
  Avatar,
  Box,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme/Theme";
import { useNavigate } from "react-router-dom";


const TournamentForm = ({ onSubmit, defaultValues, isEdit, isSubmitting }) => {
  const {
    control,
    handleSubmit,
    register,
    getValues,
    trigger,
    formState: { errors },
  } = useForm({ defaultValues, mode: "onChange" });


  const navigate = useNavigate();
  TournamentForm.propTypes = {
    readOnlyFields: PropTypes.array,
    onSubmit: PropTypes.func.isRequired,
    defaultValues: PropTypes.shape({
      start_date: PropTypes.string,
      end_date: PropTypes.string,
    }),
    isEdit: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
  };


  const validateStartDate = (value) => {
    const startDate = new Date(value);
    startDate.setHours(0, 0, 0, 0);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const defaultStartdate = new Date(defaultValues.start_date);
    defaultStartdate.setHours(0, 0, 0, 0);


    if (isEdit && startDate.getTime() === defaultStartdate.getTime()) {
      return null;
    }
    if (isEdit && defaultStartdate < currentDate) {
      return "Start date cannot be changed after the tournament start";
    }
    if (startDate < currentDate) {
      return "Start date cannot be in the past.";
    }
    if (startDate > new Date(getValues("end_date")).setHours(0, 0, 0, 0)) {
      return "Start date must be less than end date.";
    }
    const endDateError = errors["end_date"];
    if (endDateError) {
      trigger("end_date");
    }
    return null;
  };


  const validateEndDate = (value) => {
    const endDate = new Date(value);
    endDate.setHours(0, 0, 0, 0);
    const startDate = new Date(getValues("start_date"));
    startDate.setHours(0, 0, 0, 0);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);


    if (
      isEdit &&
      endDate.getTime() ===
      new Date(defaultValues.end_date).setHours(0, 0, 0, 0)
    ) {
      return null;
    }
    if (endDate < startDate) {
      return "End date cannot be less than start date.";
    }
    if (endDate < currentDate) {
      return "End date cannot be in the past.";
    }


    const startDateError = errors["start_date"];
    if (startDateError) {
      trigger("start_date");
    }
    return null;
  };


  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="md"
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box
          sx={{
            width: "90%",
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <SportsCricketIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isEdit ? "Update Tournament" : "Create Tournament"}
          </Typography>


          <Paper
            elevation={3}
            sx={{
              padding: 3,
              marginTop: 3,
              marginBottom: 5,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              data-testid="tournament-form"
            >
              <Grid container spacing={4} marginRight={2}>
                <Grid item xs={12} md={6}>
                  <MuiTextField
                    inputProps={{ "data-testid": "tournament_name" }}
                    label="Tournament name"
                    type="text"
                    error={!!errors.tournament_name}
                    helperText={errors.tournament_name?.message}
                    registerProps={register("tournament_name", {
                      required: "Tournament name is required.",
                      pattern: {
                        value: /^(?!.*\s{2})[^\s].*[^\s]$/g,
                        message: "Invalid Tournament name",
                      },
                      maxLength: {
                        value: 100,
                        message: "Maximum length should be 100",
                      },
                      minLength: {
                        value: 2,
                        message: "Minimum length should be 2",
                      },
                    })}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MuiTextField
                    inputProps={{ "data-testid": "venue" }}
                    label="Venue"
                    type="text"
                    error={!!errors.venue}
                    getUserData
                    helperText={errors.venue?.message}
                    registerProps={register("venue", {
                      required: "Venue is required.",
                      pattern: {
                        value: /^(?!.*\s{2})[^\s].*[^\s]$/g,
                        message: "Invalid venue",
                      },
                      maxLength: {
                        value: 100,
                        message: "Maximum length should be 100",
                      },
                      minLength: {
                        value: 2,
                        message: "Minimum length should be 2",
                      },
                    })}
                    required
                  />
                </Grid>


                <Grid item xs={12} md={6}>
                  <MuiTextField
                    inputProps={{
                      readOnly: !isEdit,
                      "data-testid": "organizer_name",
                    }}
                    label="Organizer name"
                    type="text"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.organizer_name}
                    helperText={errors.organizer_name?.message}
                    registerProps={register("organizer_name", {
                      required: "Organizer Name is required.",
                      pattern: {



                        value: /^[a-zA-Z]+(?:[ .][a-zA-Z]+)*$/,
                        message: "Invalid Organizer Name",
                      },
                      maxLength: {
                        value: 100,
                        message: "Maximum length should be 100",
                      },
                      minLength: {
                        value: 2,
                        message: "Minimum length should be 2",
                      },
                    })}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MuiTextField
                    inputProps={{
                      readOnly: !isEdit,
                      "data-testid": "organizer_contact",
                    }}
                    label="Organizer contact"
                    type="text"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.organizer_contact}
                    helperText={
                      errors.organizer_contact &&
                      "Please enter a valid organizer contact."
                    }
                    registerProps={register("organizer_contact", {
                      required: true,


                      pattern: /^\d{10}$/,
                    })}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MuiTextField
                    inputProps={{ "data-testid": "ground" }}
                    label="Ground"
                    type="text"
                    error={!!errors.ground}
                    helperText={errors.ground?.message}
                    registerProps={register("ground", {
                      required: "Ground is required.",
                      pattern: {
                        value: /^(?!.*\s{2})[^\s].*[^\s]$/g,
                        message: "Invalid Ground",
                      },
                      maxLength: {
                        value: 100,
                        message: "Maximum length should be 100",
                      },
                      minLength: {
                        value: 2,
                        message: "Minimum length should be 2",
                      },
                    })}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MuiTextField
                    inputProps={{ "data-testid": "start_date",}}
                    label="Start date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.start_date}
                    helperText={errors.start_date?.message}
                    onKeyDown={(e) => e.preventDefault()} 
                    registerProps={register("start_date", {
                      validate: validateStartDate,
                      required: "Please select a start date",
                    })}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MuiTextField
                    inputProps={{ "data-testid": "end_date" }}
                    label="End date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.end_date}
                    helperText={errors.end_date?.message}
                    onKeyDown={(e) => e.preventDefault()} 
                    registerProps={register("end_date", {
                      validate: validateEndDate,
                      required: "Please select an end date",
                    })}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    control={control}
                    name="tournament_category"
                    rules={{ required: "Please select a tournament category" }}
                    render={({ field }) => (
                      <MuiTextField
                        inputProps={{ "data-testid": "tournament_category" }}
                        label="Tournament category"
                        select
                        error={!!errors.tournament_category}
                        helperText={errors.tournament_category?.message}
                        {...field}
                        required
                      >
                        <MenuItem data-testid="Open" value="open">
                          Open
                        </MenuItem>
                        <MenuItem value="corporate">Corporate</MenuItem>
                        <MenuItem value="school">School</MenuItem>
                      </MuiTextField>
                    )}
                  />
                </Grid>


                <Grid item xs={12} md={6} marginTop={2}>
                  <FormControl component="fieldset">
                    <Controller
                      rules={{ required: true }}
                      control={control}
                      name="ball_type"
                      render={({ field }) => (
                        <RadioGroup {...field} data-testid="ball_type">
                          <FormLabel component="legend">
                            Ball type
                            <Typography
                              component="span"
                              style={{ color: "red" }}
                            >
                              *
                            </Typography>
                          </FormLabel>


                          <Stack direction={"row"} spacing={-0.5}>
                            <FormControlLabel
                              data-testid="tennisball"
                              value="tennis"
                              control={<Radio data-testid="tennis-button" />}
                              label="Tennis"
                            />
                            <FormControlLabel
                              value="leather"
                              control={<Radio data-testid="leather" />}
                              label="Leather"
                            />
                            <FormControlLabel
                              value="others"
                              control={<Radio data-testid="others" />}
                              label="Others"
                            />
                          </Stack>
                        </RadioGroup>
                      )}
                    />
                    {errors.ball_type && (
                      <Typography variant="body2" color="error">
                        Please select a ball type.
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <MuiTextField
                    inputProps={{ "data-testid": "description" }}
                    label="Tournament description"
                    multiline
                    rows={3}
                    type="text"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    registerProps={register("description", {
                      pattern: {
                        value: /^(?!.*\s{2})[^\s].*[^\s]$/g,
                        message: "Invalid description",
                      },
                      maxLength: {
                        value: 255,
                        message: "Maximum length should be 255",
                      },
                      minLength: {
                        value: 5,
                        message: "Minimum length should be 5",
                      },
                    })}
                  />
                </Grid>
              </Grid>


              <Stack
                direction="row"
                justifyContent="center"
                spacing={0}
                gap={4}
                container
              >
                <Grid item md={6}>
                  <CancelButton
                    datatestid="cancel"
                    type="button"
                    fullWidth
                    sx={{ mt: 2 }}
                    name="cancel"
                    onClick={() => navigate("/tournament")}
                    height={'38.5px'}
                  />
                </Grid>
                <Grid item md={6}>
                  <SubmitButton
                    datatestid="submit"
                    type="submit"
                    width={"100%"}
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 3 }}
                    name={isEdit ? "Update" : "Register"}
                    disabled={isSubmitting}
                  />
                </Grid>
              </Stack>
            </form>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};


export default TournamentForm;
