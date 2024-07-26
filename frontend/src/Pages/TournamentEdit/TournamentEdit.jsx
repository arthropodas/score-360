import React, { useEffect, useState } from "react";
import TournamentForm from "../../components/TournamentForm/TournamentForm";
import {
  getTournamentData,
  tournamentEdit,
} from "../../Services/TournamentServices";
import { ToastService } from "../../components/Common/toast/ToastService";
import { useNavigate, useParams } from "react-router-dom";
import { TournamentErrorCode } from "../../utils/errorCode/ErrorCode";
import Loader from "../../components/Common/loader/Loader";
import NotFound from "../../components/Common/notFound/NotFound";
const TournamentEdit = () => {
  const { tournamentId } = useParams();
  const [tournamentData, setTournamentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchTournamentData(tournamentId);
  }, [tournamentId]);

  const fetchTournamentData = async (id) => {
    try {
      const response = await getTournamentData(id);
      setTournamentData(response.data);
      setIsLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setIsNotFound(true);
      } else {
        ToastService(
          TournamentErrorCode(error.response.data.errorCode),
          "error"
        );
      }
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const onSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      const authTokens = JSON.parse(localStorage.getItem("authTokens"));
      formData["user_id"] = authTokens.userId;
      formData["tournament_id"] = tournamentId;
      const response = await tournamentEdit(formData);
      ToastService(response.data["success"], "success");
      navigate("/tournament");
    } catch (error) {
      ToastService(TournamentErrorCode(error.response.data.errorCode), "error");
    }
  };

  if (isNotFound) {
    return <NotFound />;
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <TournamentForm
          onSubmit={onSubmit}
          readOnlyFields={["organizer_name", "organizer_contact"]}
          defaultValues={tournamentData}
          isEdit={true}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
};

export default TournamentEdit;
