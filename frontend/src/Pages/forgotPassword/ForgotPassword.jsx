import React, { useState } from "react";
import { Grid, Container, Typography, InputAdornment } from "@mui/material";
import FormCard from "../../components/Common/cards/formCard/FormCard";
import TextBox from "../../components/Common/TextField/TextField/TextField";
import SubmitButton from "../../components/Common/buttons/submitButton/SubmitButton";
import { useForm } from "react-hook-form";
import { forgotPassword } from "../../Services/PasswordServices";
import { Email as EmailIcon } from "@mui/icons-material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBack";
import { HoverLink } from "../../components/Common/link/Link";
import { ToastService } from "../../components/Common/toast/ToastService";
import { ErrorCode } from "../../utils/errorCode/ErrorCode";

export const ForgotPassword = () => {
  const [isDisable, setIsDisable] = useState(false);
  const domainPattern =
    "(?:com|org|edu|in|net|ai|gov|me|co(?:\\.in)?|us|au|jp|ca|uk)";
  const regexPattern = new RegExp(
    `^[a-z0-9](?:[a-z0-9.+]*[a-z0-9])?@[a-z0-9]+\\.${domainPattern}$`
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsDisable(true);
      const response = await forgotPassword(data);
      setIsDisable(false);
      if (response.status === 200) {
        reset();
        ToastService(
          "An email has been sent to your email address. Please check it ",
          "success"
        );
      } else {
        reset();
      }
    } catch (error) {
      reset();
      ToastService(ErrorCode(error.response.data.errorCode), "error");
      setIsDisable(false);
    }
  };

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
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <FormCard padding="20px" align="center">
            <Typography
              variant="h6"
              style={{
                fontSize: "1.5rem",
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              Forgot password
            </Typography>
            <Typography
              variant="h6"
              style={{
                fontSize: "0.8rem",
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              Enter your email and we'll send you a link to reset your password
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextBox
                label="Email"
                name="email"
                type="text"
                title="Enter your email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                  ...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: regexPattern,
                      message: "Enter a valid email address",
                    },
                  }),
                }}
                error={!!errors.email}
                helperText={errors.email?.message || ""}
              />
              <SubmitButton
                title="Send reset mail"
                name="Send"
                style={{ paddingTop: "90px" }}
                disabled={isDisable}
              />
            </form>
            <HoverLink
              to="/login"
              style={{
                textDecoration: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <ArrowBackIosNewIcon />
              <Typography
                variant="body1"
                style={{ marginLeft: "5px", color: "black" }}
              >
                Back to Login
              </Typography>
            </HoverLink>
          </FormCard>
        </Grid>
      </Grid>
    </Container>
  );
};
