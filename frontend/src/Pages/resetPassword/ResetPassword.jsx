import React, { useEffect, useState } from "react";
import {
  Grid,
  Container,
  Typography,
  CardContent,
  InputAdornment,
  IconButton,
} from "@mui/material";

import { useForm } from "react-hook-form";
import FormCard from "../../components/Common/cards/formCard/FormCard";
import TextBox from "../../components/Common/TextField/TextField/TextField";
import SubmitButton from "../../components/Common/buttons/submitButton/SubmitButton";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import { linkValidation, resetPassword } from "../../Services/PasswordServices";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { ToastService } from "../../components/Common/toast/ToastService";
import { useNavigate } from "react-router-dom";

import Loader from "../../components/Common/loader/Loader";
import { ErrorCode } from "../../utils/errorCode/ErrorCode";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export const ResetPassword = () => {
  const [token, setToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDisable, setIsDisable] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  const handleTogglePasswordVisibilitys = () => {
    setShowPassword((prev) => !prev);
  };
  const handleToggleConfmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const jwtToken = urlParams.get("s");
      setToken(jwtToken);

      try {
        const response = await linkValidation({ token: jwtToken });
        if (response.status === 200) {
          setLoading(false);
        } else {
          setToken(1);
        }
      } catch (error) {
        setToken(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data) => {
    data.token = token;

    try {
      setIsDisable(true);
      const response = await resetPassword(data);
      reset();
      setIsDisable(false);
      if (response.status === 200) {
        ToastService("Your password has been successfully reset", "success"); 

        setTimeout(() => { 
          navigate("/login");
        }, 2800);
      } else {
        reset();
        ToastService(ErrorCode(response.data.errorCode), "error");
      }
    } catch (error) {
      reset();
      setIsDisable(false);
      ToastService(ErrorCode(error.response.data.errorCode), "error");
    }
  };

  if (loading) {
    return (
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Loader />
      </Container>
    );
  }

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
      component="main"
    >
      {token === 1 ? (
        <Typography variant="body1" color="error" gutterBottom>
          This link has expired.
        </Typography>
      ) : (
        <FormCard width="400px" height="auto" padding="10px">
          <CardContent>
            <Grid
              container
              justifyContent="center"
              alignItems="center" 
              display="flex"
              flexDirection="column" 
              spacing={2}
            >
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  style={{
                    fontSize: "1.5rem", 
                    textAlign: "center", 
                    marginBottom: "10px",
                  }}
                >
                  <SportsCricketIcon /> Score360 
                </Typography>
                <Typography
                  variant="h3"
                  style={{
                    fontSize: "1.5rem",
                    textAlign: "center",
                    marginBottom: "10px",
                  }}
                >
                  <VpnKeyIcon style={{ fontSize: 30 }} />
                  <br />
                  Reset password
                </Typography> 

                <Grid alignItems={"center"}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <TextBox
                      label={
                        <span>
                          New password<span style={{ color: "red" }}> *</span>
                        </span>
                      }
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      title="Enter New password"
                      InputProps={{
                        endAdornment: ( 
                          <InputAdornment position="end">
                            <IconButton
                              data-testid="visibility-toggle"
                              onClick={handleTogglePasswordVisibilitys}
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
                        ...register("newPassword", {
                          required: "New password is required",
                          minLength: {
                            value: 8,
                            message: "Password must  be at least 8  characters",
                          },

                          pattern: {
                            value:
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
                            message:
                              "Password must contain Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
                          },
                        }),
                      }}
                      error={!!errors.newPassword}
                      helperText={errors.newPassword?.message || ""}
                    />
                    <TextBox
                      label={
                        <span>Confirm password<span style={{ color: "red" }}>*</span></span>
                      }
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      title="Enter confirm password "
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              data-testid="visibility-toggle"
                              onClick={handleToggleConfmPasswordVisibility}
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <VisibilityIcon />
                              ) : (
                                <VisibilityOffIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                        ...register("confirmPassword", {
                          required: "Confirm password is required ",
                          validate: (value) =>
                            value === getValues("newPassword") ||
                            "Passwords are not matching ",
                        }),
                      }}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message || ""} 
                    />
                    <Grid container justifyContent="center" alignItems="center"> 
                      <SubmitButton
                        title="Reset password" 
                        name="Reset" 
                        disabled={isDisable} 
                      />
                    </Grid>
                  </form>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </FormCard> 
      )}
    </Container>
  );
};
