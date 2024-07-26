import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import MuiTextField from "../../components/Common/TextField/MuiTextFiled";
import { useForm } from "react-hook-form";
import SubmitButton from "../../components/Common/buttons/submitButton/SubmitButton";
import { getMatch, updateMatchSchedule } from "../../Services/MatchServices";
import CustomModal from "../../components/Common/box/modal/Modal";
import CancelButton from "../../components/Common/buttons/cancelButton/CancelButton";
import { MatchScheduleUpdateErrorCode } from "../../utils/errorCode/ErrorCode";
import { ToastService } from "../../components/Common/toast/ToastService";
import PropTypes from "prop-types";

const MatchEdit = ({ isOpen, setIsOpen, matchId, setGrounds }) => {
  const {
    handleSubmit,
    watch,
    register,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const [checker, setChecker] = useState();
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [disable, setDisable] = useState();



  useEffect(() => {
    if (!isOpen) {
     
      setChecker('');
      setStart('');
      setEnd('');
      reset();
    }
  }, [isOpen, reset]);



  useEffect(() => {
    const response = getMatch(matchId);
   
    response
      ?.then((res) => {
        
        setGrounds(res?.data?.grounds);
        setChecker(res?.data?.city);
        setStart(res?.data?.tournament_start);
        setEnd(res?.data?.tournament_end);

       
      const groundIndex = res?.data?.ground - 1;
      const ground = res?.data?.ground ? res?.data?.grounds[groundIndex] : null;
      const matchTime = res?.data?.match_time ? res?.data?.match_time.substring(0, 5) : null;

        reset({
          ground: ground,
          overs: res?.data?.number_of_overs,
          city: res?.data?.city,
          matchDate: res?.data?.match_date,
          matchTime: matchTime,
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [matchId, isOpen]);

  const onClose = () => {
    setChecker('');
    setStart('');
    setEnd('');
    reset();
    console.log("isOpen",isOpen);
  
    setIsOpen(prevIsOpen => !prevIsOpen); // Toggles the value of isOpen
    console.log("isOpen2",isOpen);
    reset()

    
  };

  const onSubmit = async (data) => {
    setIsOpen(false);
    setDisable(true);
    const response = updateMatchSchedule(matchId, data);
    response
      ?.then((res) => {
        if (res.status === 200) {
          setIsOpen(false);
          ToastService("Match schedule updated successfully", "success");
          setDisable(false);
          reset();
        }
      })
      .catch((err) => {
        setIsOpen(false);

        ToastService(
          MatchScheduleUpdateErrorCode(err?.response?.data?.errCode),
          "error"
        );
        setDisable(false);
        reset();
      });
  };
  return (
    <CustomModal open={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          spacing={1}
          sx={{
            width: "100%",
            backgroundColor: "transparent",
            background: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <Grid item xs={12} md={12}>
            <Box
              sx={{ display: "flex", justifyContent: "center", width: "100%" }}
            >
              <Typography variant="h4">
                <b>Schedule Match</b>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={12}>
            <MuiTextField
              size="small"
              inputProps={{
                readOnly: false,
                "data-testid": "ground",
              }}
              label={
                <span>
                  Ground<span style={{ color: "red" }}>*</span>
                </span>
              }
              type="text"
              InputLabelProps={{ shrink: true }}
              error={!!errors.ground}
              helperText={errors.ground?.message}
              registerProps={register("ground", {
                required: "Ground name is required.",
                pattern: {
                  value:/^(?!.*\s{2})[^\s].*[^\s]$/g,
                  message: "Invalid ground Name",
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
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <MuiTextField
              size="small"
              inputProps={{
                readOnly: false,
                "data-testid": "Overs",
              }}
              label={
                <span>
                  Overs<span style={{ color: "red" }}>*</span>
                </span>
              }
              type="number"
              defaultValue={watch("overs") || ""}
              InputLabelProps={{ shrink: true }}
              error={!!errors.overs}
              helperText={errors.overs?.message}
              registerProps={register("overs", {
                required: "Number of overs is required.",
                min: {
                  value: 1,
                  message: "Number of overs must be greater than 0.",
                },
              })}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <MuiTextField
              size="small"
              inputProps={{
                readOnly: false,
                "data-testid": "city",
              }}
              label={
                <span>
                  City<span style={{ color: "red" }}>*</span>
                </span>
              }
              type="text"
              InputLabelProps={{ shrink: true }}
              error={!!errors.city}
              helperText={errors.city?.message}
              registerProps={register("city", {
                required: "City Name is required.",
                pattern: {
                  value: /^(?!\s)(?!.*\s$)(?!.*\s{2})[a-zA-Z\d., -]+$/,
                  message: "Invalid city Name",
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
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <MuiTextField
              size="small"
              inputProps={{ "data-testid": "matchDate", min: start, max: end }}
              label={
                <span>
                  Match date<span style={{ color: "red" }}>*</span>
                </span>
              }
              type="date"
              InputLabelProps={{ shrink: true }}
              onKeyDown={(e) => e.preventDefault()}
              registerProps={register("matchDate", {
                required: "Please select a match date",
              })}
              error={!!errors.matchDate}
              helperText={errors.matchDate?.message}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <MuiTextField
              size="small"
              inputProps={{ "data-testid": "matchTime" }}
              ampm={false}
              label={
                <span>
                  Match Time<span style={{ color: "red" }}>*</span>
                </span>
              }
              type="time"
              defaultValue={watch("matchTime") || ""}
              InputLabelProps={{ shrink: true }}
              onKeyDown={(e) => e.preventDefault()}
              registerProps={register("matchTime", {
                required: "Please select a time",
              })}
              error={!!errors.matchTime}
              helperText={errors.matchTime?.message}
            />
          </Grid>
          <Grid xs={12} md={12}>
            <Box
              sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}
            >
              <CancelButton
                onClick={onClose}
                title="Cancel"
                width="100%"
                name="Cancel"
              />
              <SubmitButton
                title={"Schedule"}
                name={checker === "" ? "Schedule" : "Edit"}
                disabled={disable}
              />
            </Box>
          </Grid>
        </Grid>
      </form>
    </CustomModal>
  );
};
MatchEdit.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  matchId: PropTypes.number.isRequired,
  setGrounds: PropTypes.func.isRequired,
};
export default MatchEdit;
