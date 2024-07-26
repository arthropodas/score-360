import { Box, Container, Typography } from "@mui/material";

import { HoverLink } from "../../components/Common/link/Link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { validateEmail } from "../../Services/RegisterServices";
import SubmitButton from "../../components/Common/buttons/submitButton/SubmitButton";
import { ToastService } from "../../components/Common/toast/ToastService";
import TextBox from "../../components/Common/TextField/TextField/TextField";
import { ValidateEmailErrorCode } from "../../utils/errorCode/ErrorCode";
import Loader from "../../components/Common/loader/Loader";

const EmailValidation = () => {
  const [isLoading, setIsLoading] = useState(false);
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
  const onSubmit = async (email) => {
    setIsDisable(true);
    setIsLoading(true);
    const response = validateEmail(email);
    response
      .then((res) => {
        if (res.status === 200) {
          ToastService(res?.data?.message, "success");
          setIsLoading(false);
          setTimeout(() => {
            reset();
            setIsDisable(false);
          }, 1250);
        }
      })
      .catch((error) => {
        ToastService(
          ValidateEmailErrorCode(error.response.data.errorCode),
          "error"
        );
        setIsLoading(false);
        setTimeout(() => {
          reset();
          setIsDisable(false);
        }, 1250);
        reset();
      });
  };

  return (
    <>
      {isLoading ? (
      <Loader />
    ) : (
   <></>
    )}
  
        <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center", // Center-align content horizontally
    height: "100vh",
  }}
>
  <Container
    sx={{
      display: "flex",
      alignContent: "center",
      width: { xs: "80%", md: "30%" },
      backgroundColor: "rgba(255, 255, 255, .9)",
      justifyContent: "center",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 5,
        alignItems: "center",
      }}
    >
      <Typography variant="h5">Verify your Email</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "flex", justifyContent: "center" ,
            marginTop: { xs: 4, md: 2 },
          }}
        >
          {" "}
          <TextBox
            label="Email"
            name="email"
            type="text"
            title="Enter your email"
            InputProps={{
              ...register("email", {
                required: true,
                pattern: regexPattern,
              }),
            }}
          />
          
        </Box>
        <Box
          sx={{
            display: "flex", justifyContent: "center" ,
           
          }}>
        {errors.email && errors.email.type === "pattern" && (
          <Typography variant="body2" color="error">
            Email is not valid.
          </Typography>
        )}
        {errors.email && errors.email.type === "required" && (
          <Typography variant="body2" color="error">
            Email is not entered.
          </Typography>
        )}
         </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <SubmitButton
            title="verify"
            name="verify"
            disabled={isDisable}
          />
        </Box>
        <Box sx={{      display: "flex", justifyContent: "center" , }}>
          <p alignItems="center">
            Already have an account?
            <HoverLink to="/login">Login here</HoverLink>
          </p>
        </Box>
      </form>
    </Box>
  </Container>
</Box>

      
    </>
  );
};

export default EmailValidation;
