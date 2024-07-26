import React, { useState, useEffect } from "react";
import { Box, FormControl, Grid, MenuItem, Tooltip, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

import RenderLogo from "../../components/Common/renderLogo/RenderLogo";
import PropTypes from 'prop-types';

import MuiTextField from "../../components/Common/TextField/MuiTextFiled";
import SubmitButton from "../../components/Common/buttons/submitButton/SubmitButton";
import { matchToss } from "../../Services/MatchServices";
import { ToastService } from "../../components/Common/toast/ToastService";
import { CoinTossErrorCode } from "../../utils/errorCode/ErrorCode";
import CancelButton from "../../components/Common/buttons/cancelButton/CancelButton";
import { useNavigate } from "react-router-dom";


const CoinToss = ({ teamOne, teamTwo, matchId, onCloseModal,setRefresh,refresh,setTeams }) => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [start, setStart] = useState(true);
  const [end, setEnd] = useState(false);
  const [match, setMatchId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [CurrentNameIndex, setCurrentNameIndex] = useState(0)
 const navigate=useNavigate()
  const images = [teamOne.logo, teamTwo.logo];
  const names = [teamOne.team_name, teamTwo.team_name]

  const coinToss = () => {
    setTeams({team1:teamOne.id,team2:teamTwo.id})


    function secureRandom() {
      const randomBytes = new Uint32Array(1);
      crypto.getRandomValues(randomBytes);
      return randomBytes[0] / (0xFFFFFFFF + 1);
    }

    setStart(false);
    setLoading(true);
    setEnd(true);

    const randomValue = secureRandom();

    const resultIndex = randomValue < 0.5 ? 0 : 1;
    const result = [teamOne.team_name, teamTwo.team_name][resultIndex];
    setResult(result);

    console.log("result", result)

    setTimeout(() => {
      setLoading(false);
      setStart(true);
    }, 2000);
  };
  const {

    handleSubmit,
    control,

    formState: { errors },

  } = useForm();

  const onSubmit = async (tossData) => {
   
    setMatchId(matchId);
    console.log(match)
    setIsSubmitting(true)


    let winner;
    if (result === teamOne.team_name) {
      winner = teamOne.id;

    } else {
      winner = teamTwo.id;

    }
    onCloseModal(); 


    tossData["toss_winner"] = winner;
    tossData["match_id"] = matchId;
    try {

      const response = await matchToss(tossData, matchId);
      console.log("response", response)
      setRefresh(prevRefresh => !prevRefresh);
      ToastService("Toss successfully chosen.", "success");
      navigate('add-playing-eleven',{state:{"team1":teamOne,"team2":teamTwo,"matchId":matchId}})


    } catch (error) {
      ToastService(CoinTossErrorCode(error.response?.data?.errorCode), "error");

    }
    finally{
      setIsSubmitting(false)
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
      setCurrentNameIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
    }, 200);

    return () => clearInterval(intervalId);
  }, []);


  return (
    <Box className="App" sx={{ fontFamily: "sans-serif", height: "10%", textAlign: "center", marginTop: "1px" }}>
      {start && !end && <Grid>
        <Typography paddingTop={"45px"}>Toss the coin</Typography>

        <Typography padding={"45px"}> And choose the decision bat or bowl</Typography>

      </Grid>}

      {!start && (
        <Grid
 
          className={loading ? "flipAnimation" : result}
 
          style={{
            "--front-image": `url(${images[1]})`,
            "--back-image": `url(${images[0]})`,
          }}
        >
 

          <RenderLogo team={{ logo: images[currentImageIndex], team_name: names[CurrentNameIndex] }} />
        </Grid>
      )}



      {start && !end && (

        <Grid container spacing={1}>

          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <CancelButton
              onClick={() => {
                onCloseModal()
              }}
              title="Cancel"
              width="100%"
              name="Cancel"
              disabled={false}
            />

          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", justifyContent: "center" }}
          >

            <SubmitButton onClick={coinToss}

              disabled={isSubmitting}
              datatestid="coinToss"


              name={"Toss"}
            />

          </Grid>

        </Grid>


      )}
      {(result && start) && (
        <>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
          <Tooltip title={result}>

          <Typography marginBottom={5} variant="h6" >
    {!loading && end && result.length > 20
      ? `${result.substring(0, 20)}... won the toss`
      : !loading && end && `${result} won the toss`}
  </Typography>
          </Tooltip>
        <Grid sx={{  width:"max-content"}} >

          <form
            onSubmit={handleSubmit(onSubmit)}
            data-testid="toss-form"
          >

           

              <Grid  item xs={12} md={6} width={"100%"} sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Grid md={6} alignSelf={"center"}>

                  <RenderLogo team={{ logo: images[result === teamOne.team_name ? 0 : 1], team_name: names[result === teamOne.team_name ? 0 : 1] }} />
                </Grid>
                <Grid >

                <FormControl fullWidth>
                <Controller
                  control={control}
                  name="toss_decision"
                  rules={{ required: "Please select a decision" }}
                  render={({ field }) => (
                    <Grid xs={12} sx={{width:"100%"}}>

                      <MuiTextField
                       size="small"
             

                        inputProps={{ "data-testid": "tossDecision" }}
                        label="Toss decision"

                        select
                        error={!!errors.toss_decision}
                        helperText={errors.toss_decision?.message}
                        {...field}
                        required
                      >
                        <MenuItem data-testid="bat" value={1}>
                          Bat
                        </MenuItem>
                        <MenuItem value={2}>Bowl</MenuItem>

                      </MuiTextField>
                    </Grid>
                  )}
                />
            </FormControl>
              </Grid>
            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: "flex", justifyContent: "center", }}
              >
                <CancelButton
                  onClick={() => {
                    onCloseModal()
                  }}
                  variant="small"
                  title="Cancel"
                  width="100%"
                  name="Cancel"
                  disabled={false}
                />

              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: "flex", justifyContent: "center" }}
              >

                <SubmitButton
                  marginLeft="30px"
                  datatestid="submit"
                  type="submit"
                  width={"100%"}
                  variant="outlined"
                  color="primary"

                  name={"submit"}
                  disabled={isSubmitting}
                />
              </Grid>
            </Grid>
                </Grid>
          </form>
        </Grid>
        </div>
      </>
      )}

    </Box>
  );
};

export default CoinToss;
CoinToss.propTypes = {
  teamOne: PropTypes.shape({
    logo: PropTypes.string.isRequired,
    team_name: PropTypes.string.isRequired,id:PropTypes.number
  }).isRequired,
  teamTwo: PropTypes.shape({
    logo: PropTypes.string.isRequired,
    team_name: PropTypes.string.isRequired,id:PropTypes.number
  }).isRequired,
  matchId: PropTypes.string.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  setRefresh:PropTypes.func,
  refresh:PropTypes.func
};