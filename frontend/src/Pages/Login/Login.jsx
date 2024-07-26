import React, { useState } from "react";
import {
  Grid,
  IconButton,
  Container,
  InputAdornment,
  Typography,
  CardContent,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { useForm } from "react-hook-form";
import TextBox from "../../components/Common/TextField/TextField/TextField";
import { HoverLink } from "../../components/Common/link/Link";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";

import { authenticateUser } from "../../Services/LoginServices";
import Formcard from "../../components/Common/cards/formCard/FormCard";
import SubmitButton from "../../components/Common/buttons/submitButton/SubmitButton";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastService } from "../../components/Common/toast/ToastService";
import backgroundImage from "../../assets/loginBackground.png";
import Loader from "../../components/Common/loader/Loader";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authenticateUser(data); 

      if (response.status === 200) {
        const access_token = response?.data?.access_token;
        const refresh_token = response?.data?.refresh_token;
        const user_type = response?.data?.user_type;
        const decoded = jwtDecode(access_token);
        const user_id = decoded?.user_id;

        let authTokens = JSON.stringify({
          accessToken: access_token,
          refreshToken: refresh_token,
          userId: user_id,
          user_type: user_type,
        });
        localStorage.setItem("authTokens", authTokens); 
        navigate("/tournament");
      } else { 
        ToastService("Login failed!, Please check your credentials!", "error");
        reset();
      }
    } catch (error) {
      ToastService("Login failed!, Please check your credentials!", "error");
      reset();
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (<></>)}
        <div
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            height: "auto",
          }}
        >
          <Container
            style={{
              display: "flex",
              justifyContent: "center",  
              alignItems: "center",
              minHeight: "100vh", 
            }}
            component="main"
            xs={8}
            sm={6}
            md={4}
            lg={2}
          >
            <Formcard
              maxWidth={"300px"}
              margin={"auto"}
              align={"center"} 
              padding={"20px"}
            >
              <CardContent>
                <Grid container justifyContent="center" alignItems="center">
                  <Grid item xs={12}>
                    <Typography variant="h5" align="center" gutterBottom>
                      <Typography
                        variant="h6"
                        style={{
                          fontSize: "1.5rem",
                          textAlign: "center",
                          marginBottom: "10px",
                          marginRight: "15px",  
                        }}
                      >
                        <SportsCricketIcon /> Score360 
                      </Typography>
                      Login
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)}>
                      <TextBox
                        label={
                          <span>
                            Email<span style={{ color: "red" }}> *</span>
                          </span>
                        }
                        name="email" 
                        type="text" 
                        title="Enter your email"
                        InputProps={{
                          ...register("email", { 
                            required: "Email is required", 
                            pattern: {
                              value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                              message: "Enter a valid email address",
                            },
                          }),
                        }}
                        error={!!errors.email}
                        helperText={errors.email?.message || ""}
                      />

                      <TextBox
                        label={
                          <span>
                            Password<span style={{ color: "red" }}> *</span>
                          </span>
                        }
                        type={showPassword ? "text" : "password"}
                        name="password"
                        InputProps={{ 
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                data-testid="visibility-toggle"
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
                          }),
                        }} 
                        error={!!errors.password}
                        helperText={errors.password?.message || ""} 
                      />

                      <Grid
                        item
                        xs={12}
                        style={{
                          textAlign: "right",
                          marginRight: "9px",
                          marginTop: "10px",
                        }}
                      >
                        <HoverLink to="/forgotPassword">
                          Forgot password
                        </HoverLink>
                      </Grid>
                      <SubmitButton
                        title="login"
                        name="Login"
                        disabled={false} 
                      />
                    </form>

                    <Grid item xs={12} style={{ textAlign: "center" }}>
                      <p>
                        Don't have an account?{" "} 
                        <HoverLink to="/validate-email" > 
                          Register here
                        </HoverLink>
                      </p> 
                    </Grid> 
                  </Grid>
                </Grid>
              </CardContent>
            </Formcard>
          </Container> 
        </div>
      
    </>
  );
}

export default Login;
