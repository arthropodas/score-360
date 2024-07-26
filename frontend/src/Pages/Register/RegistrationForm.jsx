import {
  Box,
  InputAdornment,
  MenuItem,
  Typography,
  IconButton,
  Grid,
  Button,
} from "@mui/material";
import SubmitButton from "../../components/Common/buttons/submitButton/SubmitButton";
import { useForm } from "react-hook-form";

import React, { useState } from "react";
import MuiTextField from "../../components/Common/TextField/MuiTextFiled";
import { useNavigate, useParams } from "react-router-dom";
import { playerRegister } from "../../Services/RegisterServices";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { ToastService } from "../../components/Common/toast/ToastService";
import { HoverLink } from "../../components/Common/link/Link";
import { PlayerRegistrationErrorCode } from "../../utils/errorCode/ErrorCode";
import { Container } from "@mui/system";
import FormCard from "../../components/Common/cards/formCard/FormCard";
import CustomModal from "../../components/Common/box/modal/Modal";
import Loader from "../../components/Common/loader/Loader";
const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [render, setRender] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({});
  const { token } = useParams();
  console.log(token)
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const domainPattern =
    "(?:com|org|edu|in|net|ai|gov|me|co(?:\\.in)?|us|au|jp|ca|uk)";
  const regexPattern = new RegExp(
    `^[a-z0-9](?:[a-z0-9.+]*[a-z0-9])?@[a-z0-9]+\\.${domainPattern}$`
  );
  const currentDate = new Date();
  const maxDate = new Date(
    currentDate.getFullYear() - 10,
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const formattedMaxDate = maxDate.toISOString().split("T")[0]; // Format as yyyy-MM-dd
  const minDate = new Date(
    currentDate.getFullYear() - 80,
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const formattedMinDate = minDate.toISOString(0).split("T")[0];
  const validateStartDate = (value) => {
    const dob = new Date(value);
    const today = new Date();
    const tenYearsAgo = new Date(
      today.getFullYear() - 10,
      today.getMonth(),
      today.getDate()
    );
    if (dob > tenYearsAgo) {
      return "Date of birth is not valid.";
    }
    return null;
  };
  const onSubmit = async (registrationData) => {
    setIsLoading(true);

    const regData = {
      first_name: registrationData.firstName,
      last_name: registrationData.lastName,
      email: registrationData.email,
      dob: registrationData.dob,
      phone_number: registrationData.phoneNumber,
      password: registrationData.password,
      batting_style: registrationData.battingStyle,
      bowling_style: registrationData.bowlingStyle,
      gender: registrationData.gender,
    };
    const response = playerRegister(regData, token);
    
    response
      .then((res) => {
        setIsLoading(false);
        console.log(res.data.message)
        ToastService("Player registration successful",'success');
        navigate('/login')

      })
      .catch((error) => {
        if (error.response?.data?.errorCode === "3116") {
          setIsLoading(false);
          navigate("/validate-email");
        }
        ToastService(
          PlayerRegistrationErrorCode(error?.response?.data?.errorCode),
          "error"
        );
        
        setRender(!render);
        setIsLoading(false);
      });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    
    <>
    {isLoading ? (
      <Loader />
    ) : (
   <></>
    )}
     
        <Container  component="main" maxWidth="md">
          <Box
            sx={{
              marginTop: 10,
              marginBottom:10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FormCard
              maxWidth={"300px"}
              margin={"auto"}
              align={"center"}
              padding={"10px"}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <Typography variant="h4">Player Registration</Typography>
                  </Grid>

                  <Grid item md={4} xs={12}>
                    <MuiTextField
                      inputProps={{ "data-testid": "firstName" }}
                      label="First name"
                      type="text"
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      registerProps={register("firstName", {
                        required: "First name is not entered.",

                        pattern: {
                          value: /^[a-zA-Z]{2,100}$/,
                          message: "First name is not valid.",
                        },
                      })}
                      required
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <MuiTextField
                      inputProps={{ "data-testid": "lastName" }}
                      label="Last name"
                      type="text"
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      registerProps={register("lastName", {
                        required: "Last name is not entered.",
                        pattern: {
                          value:
                            /^(?!.*(?:\s\.|\.\s|\s\s|\.\.))[a-zA-Z\s.]{1,100}$/,
                          message: "Last name is not valid.",
                        },maxLength: {
                          value: 50,
                          message: "Maximum length should be 50",
                        },
                        minLength: {
                          value: 1,
                          message: "Minimum length should be 1",
                        }
                      })}
                      required
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <MuiTextField
                      inputProps={{
                        "data-testid": "dob",
                        min: formattedMinDate,
                        max: formattedMaxDate,
                      }}
                      label="Date of Birth"
                      type="date"
                      InputLabelProps={{ shrink: true, dateFormat: false }}
                      error={!!errors.dob}
                      helperText={errors.dob?.message}
                      onKeyDown={(e) => e.preventDefault()}
                      registerProps={register("dob", {
                        validate: validateStartDate,
                        required: "Please select a start date",
                      })}
                      required
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <MuiTextField
                      textAlign="true"
                      title="Please select your gender"
                      width="200px"
                      inputProps={{ "data-testid": "gender" }}
                      label={
                        <span>
                          Gender<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      type="select"
                      error={!!errors.gender}
                      helperText={errors.gender && "Please select gender."}
                      defaultValue=""
                      value={watch('gender')}
                      registerProps={register("gender", {
                        required: "gender is required",
                      })}
                      select
                    >
                      <MenuItem value="Male" data-testid="male">
                        Male
                      </MenuItem>
                      <MenuItem value="Female" label="Female">
                        Female
                      </MenuItem>
                    </MuiTextField>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <MuiTextField
                      textAlign="true"
                      title="Please select your bowling style"
                      inputProps={{ "data-testid": "bowling_style" }}
                      error={!!errors.bowlingStyle}
                      helperText={
                        errors.bowlingStyle && "Please select a bowling style."
                      }
                      label={
                        <span>
                          Bowling style<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      type="select"
                      defaultValue=""
                      value={watch('bowlingStyle')}
                      registerProps={register("bowlingStyle", {
                        required: true,
                      })}
                      select
                    >
                      <MenuItem value="Right arm pace/seam bowling">
                        Right arm pace/seam bowling
                      </MenuItem>
                      <MenuItem value="Left arm pace/seam bowling">
                        Left arm pace/seam bowling
                      </MenuItem>
                      <MenuItem value="Right-arm spin bowling">
                        Right-arm spin bowling
                      </MenuItem>
                      <MenuItem value="Left-arm spin bowling">
                        Left-arm spin bowling
                      </MenuItem>
                    </MuiTextField>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <MuiTextField
                      textAlign="true"
                      title="Please select your batting style"
                      inputProps={{ "data-testid": "batting_style" }}
                      label={
                        <span>
                          Batting style<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      type="select"
                      error={!!errors.battingStyle}
                      helperText={
                        errors.battingStyle && "Please select a batting style."
                      }
                      defaultValue=""
                      value={watch('battingStyle')}
                      registerProps={register("battingStyle", {
                        required: true,
                      })}
                      select
                    >
         
                      <MenuItem value="left">Left</MenuItem>
                      <MenuItem value="right">Right</MenuItem>
                    </MuiTextField>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <MuiTextField
                      inputProps={{ "data-testid": "phoneNumber" }}
                      label="Phone number"
                      type="text"
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber?.message}
                      registerProps={register("phoneNumber", {
                        required: "Phone number is not entered.",
                        pattern: {
                          value: /^\d{10}$/,
                          message: "Phone number is not valid.",
                        },
                      })}
                      required
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <MuiTextField
                      inputProps={{ "data-testid": "email" }}
                      label="Email"
                      type="text"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      registerProps={register("email", {
                        required: "Email is not entered.",
                        pattern: {
                          value: regexPattern,

                          message: "Email is not valid.",
                        },
                      })}
                      required
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <MuiTextField
                      label={
                        <span>
                          Password<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      name="password"
                      type={showPassword ? "text" : "password"}
                      title="Enter your password"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityIcon />
                              ) : (
                                <VisibilityOffIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                        ...register("password", {
                          required: "Password is required",
                          pattern: {
                            value:
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
                            message:
                              "Password must contain Minimum eight and maximum 32 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
                          },
                        }),
                      }}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <SubmitButton title={"Register"} name={"register"} />
                  </Grid>
                </Grid>
              </form>

              <p>
                Already have an account?
                <HoverLink to="/">Login here</HoverLink>
              </p>
            </FormCard>
          </Box>
        </Container>
      
      <CustomModal open={isOpen} width={500}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box>
            <Typography variant="h5">
              <u>Rules for Registration</u>
            </Typography>
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <Typography height={40} display={"flex"}>
              <p>1.</p>
              <p>User must be atleast 10 years old to register.</p>
            </Typography>
            <Typography height={40} display={"flex"}>
              <p>2.</p>
              <p>Phone number must contain 10 digits.</p>
            </Typography>
            <Typography height={50} display={"flex"}>
              <p>3.</p>
              <p>
                Password must contain atleast one uppercase,lowercase,number and
                a special character
              </p>
            </Typography>
            <Typography height={50} display={"flex"}>
              <p>4.</p>
              <p>
                Password must have a minimum of 8 and maximum of 32 characters
              </p>
            </Typography>
            <Typography height={50} display={"flex"}>
              <p>5.</p>
              <p>
                Only emails ending with [.com, .co.in, .au, .edu, .jp, .ca, .us,
                .gov, .org, .in, .net, .ai] are allowed.
              </p>
            </Typography>
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <Button
              data-testId="regModalBtn"
              title="Ok"
              variant="contained"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Ok
            </Button>
          </Box>
        </Box>
      </CustomModal>
    </>
  );
};

export default RegistrationForm;
