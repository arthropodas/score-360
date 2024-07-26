import React, { useEffect, useState } from "react";
import TournamentForm from "../../components/TournamentForm/TournamentForm";

import {
  getUserData,
  tournamentRegister,
} from "../../Services/TournamentServices";
import { ToastService } from "../../components/Common/toast/ToastService";

import { TournamentErrorCode } from "../../utils/errorCode/ErrorCode";
import { ThemeProvider } from "@mui/system";
import theme from "../../theme/Theme";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Common/loader/Loader";

const TournamentRegister = () => {
  const navigate = useNavigate();
  const { reset } = useForm();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await getUserData();
      setUserData(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(true);
    }
  };

  const onSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      const authTokens = JSON.parse(localStorage.getItem("authTokens"));
      formData["user_id"] = authTokens.userId;
      const response = await tournamentRegister(formData);
      reset();

      ToastService(response.data.success, "success");

      navigate("/tournament");
    } catch (error) {
      ToastService(TournamentErrorCode(error.response.data.errorCode), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    
      {isLoading ? (
        <Loader />
      ) : (
        <ThemeProvider theme={theme}>
          <TournamentForm
            isEdit={false}
            onSubmit={onSubmit}
            userData={userData}
            defaultValues={{
              organizer_name: userData.first_name + " " + userData.last_name,
               organizer_contact: userData.phone_number,
            }}
            isSubmitting={isSubmitting}
          />
        </ThemeProvider>
      )}
    </>
  );

};

export default TournamentRegister;
