
import { AppBar, Tab, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React,  { useEffect, useState } from 'react'
import Tabs from '@mui/material/Tabs';
import { Outlet,useParams, useNavigate, useLocation } from 'react-router-dom';
import MyBreadcrumbs from '../../components/Common/breadcrumbs/breadcrumbs';
import { TournamentErrorCode } from '../../utils/errorCode/ErrorCode';
import { ToastService } from '../../components/Common/toast/ToastService';
import { getTournamentData } from '../../Services/TournamentServices';

const TournamentDetails = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [tournamentData,setTournamentData]=useState()
  const { id } = useParams();
  const location = useLocation();
  console.log(location, "pathname");

  // Function declaration moved here
  const fetchTournamentData = async (id) => {
    try {
      const response = await getTournamentData(id);
      setTournamentData(response?.data);
      console.log(response?.data)
    } catch (error) {
      if (error.response && error?.response?.status === 403) {
        console.log("Missmatch");
      } else {
        ToastService(
          TournamentErrorCode(error?.response?.data?.errorCode),
          "error"
        );
      }
    } 
  }

  if (location.pathname === `/tournament/TournamentDetails/${id}`) {
    navigate(`team-list/${id}`);
    fetchTournamentData(id);
  }

  useEffect(() => {
    navigate(`team-list/${id}`);
    fetchTournamentData(id);
  }, []);

  const handleChange = (newValue) => (event) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate(`team-list/${id}`);
        break;
      case 1:
        navigate(`matches/${id}`);
        break;
      default:
        navigate(`team-list/${id}`);
        break;
    }
  };

  return (
    <Box sx={{width:'100%',mt:2}}>
      <MyBreadcrumbs/>
      <Box className='section-1' sx={{width:'100%',height:{xs:'45vh',md:'50vh'},backgroundColor:'rgb(173, 33, 18)',mt:2,display:'flex',flexDirection:{xs:'column',md:'row',}}}>
        <Box sx={{height:'100%',width:{xs:"100%",md:'50%'},display:'flex',flexDirection:{xs:'column',md:'row',justifyContent:'center',alignItems:'center',gap:3}} }>
          <Box sx={{color:'white',textAlign:'left'}}>
             <Typography sx={{fontSize:'50px'}} ><b>{tournamentData?.tournament_name}</b></Typography>
              <Typography sx={{fontSize:'18px'}} >{tournamentData?.start_date} to {tournamentData?.end_date}</Typography>
              <Typography sx={{fontSize:'18px'}}>{tournamentData?.venue}</Typography>
          </Box>
        </Box>
        <Box className='stats'sx={{height:'100%',width:{xs:"100%",md:'50%'},display:'flex',justifyContent:'center',alignItems:'center',gap:2} }>
          <Box sx={{height:120,width:150,backgroundColor:'rgba(0, 0, 0, 0.15)',color:'white',display:'flex',flexDirection:'column'}}>
            <Box sx={{height:'80%',display:'flex',justifyContent:'center'}}>
<Typography sx={{alignSelf:'center',fontSize:'50px'}}>   <b>{tournamentData?.matches}</b>
</Typography>
            </Box>
            <Box sx={{alignSelf:'center'}}>
              <b>Matches
</b>            </Box>
          </Box>
          <Box sx={{height:120,width:150,backgroundColor:'rgba(0, 0, 0, 0.15)',color:'white',display:'flex',flexDirection:'column'}}>
            <Box sx={{height:'80%',display:'flex',justifyContent:'center'}}>
<Typography sx={{alignSelf:'center',fontSize:'50px'}}>   <b>{tournamentData?.teams}</b>
</Typography>
            </Box>
            <Box sx={{alignSelf:'center'}}>
              <b>Teams
</b>            </Box>
          </Box>
        </Box>
      </Box>

      <Box className='section-2' sx={{mt:2,width:'100%',height:{xs:'55%',md:'55%'}}}>
        <Box sx={{ bgcolor: 'background.paper', width: 'auto' ,display:'flex',flexDirection:'column'}}>
          <AppBar position="static" sx={{backgroundColor:'rgb(173, 33, 18)',borderRadius:'10px 10px 2px 2px'}} >
            <Tabs
              value={value}
              indicatorColor="secondary" 
              textColor="inherit"
              variant="standard"
              aria-label="full width tabs example"
            >
              <Tab label="Teams"  data-testid='teamsz' onClick={handleChange(0)}/>
              <Tab label="Match"  data-testid='matchz' onClick={handleChange(1)} />
            </Tabs>
          </AppBar>
          <Box sx={{mt:4}}>
            <Outlet/>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default TournamentDetails;
