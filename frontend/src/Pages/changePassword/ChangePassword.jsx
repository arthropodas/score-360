import React, { useState } from "react";
import {
  Grid,
  Container,
  Typography,
  CardContent,
  InputAdornment,
  IconButton,
} from "@mui/material";
import FormCard from "../../components/Common/cards/formCard/FormCard";
import TextBox from "../../components/Common/TextField/TextField/TextField";
import SubmitButton from "../../components/Common/buttons/submitButton/SubmitButton";
import { useForm } from "react-hook-form";
import { changePassword } from "../../Services/PasswordServices";
import { ToastService } from "../../components/Common/toast/ToastService";
import { ErrorCode } from "../../utils/errorCode/ErrorCode";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();
  const [currentPassword, setCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setCurrentPassword((prev) => !prev);
  };
  const handleToggleNewPasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    try {
      setIsActive(true);
      const response = await changePassword(data);
      setIsActive(false);
      if (response.status === 200) {
        ToastService(response.data.message, "success");

        reset();
        setTimeout(() => {
          localStorage.removeItem("authTokens");
          navigate("/login");
        }, 2800);
      }
    } catch (error) {
      setIsActive(false);
      ToastService(ErrorCode(error.response.data.errorCode), "error");

      reset();
    }
  };

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "75vh",
      }}
      component="main"
    >
      <FormCard width="350px" height="auto" padding="10px">
        <CardContent>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Typography
              variant="h6"
              style={{
                fontSize: "1.5rem", 
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              Change password
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextBox
                label={
                  <span>
                    Current password<span style={{ color: "red" }}> *</span>
                  </span>
                }
                name="currentPassword"
                type={currentPassword ? "text" : "password"}
                title="Current password"
                InputProps={{ 
                  endAdornment: (
                    <InputAdornment position="end"> 
                      <IconButton
                        data-testid="visibility-toggle"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {currentPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment> 
                  ),
                  ...register("currentPassword", {
                    required: "Password is required",
                  }),
                }}
                error={!!errors.currentPassword}
                helperText={errors.currentPassword?.message || ""}
              />
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
                        onClick={handleToggleNewPasswordVisibility}
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
                      message: "Password must be at least 8 characters",
                    },

                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
                      message:
                        "Password must contain Minimum eight and maximum 32 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
                    },
                  }),
                }}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message || ""}
              />
              <TextBox
                label={
                  <span>
                    Confirm password<span style={{ color: "red" }}> *</span>
                  </span>
                }
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                title="Enter confirm password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        data-testid="visibility-toggle"
                        onClick={handleToggleConfirmPasswordVisibility}
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
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === getValues("newPassword") ||
                      "Passwords do not match",
                  }),
                }}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message || ""}
              />
              <Grid container justifyContent="center" alignItems="center">
                <SubmitButton
                  title="Reset password"
                  name="Change"
                  disabled={isActive}
                />
              </Grid>
            </form>
          </Grid>
        </CardContent>
      </FormCard>
    </Container>
  );
};
