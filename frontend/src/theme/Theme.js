import { createTheme } from '@mui/material/styles';
import { green} from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: green[700],
    },
    secondary: {
      main: green[400],
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif', // Set the font family here
  },
  components: {
    MuiPickersDay: {
      daySelected: {
        backgroundColor: green[500], // Change the background color to green
        "&:hover": {
          backgroundColor: green[700], // Change the background color on hover
        },
      },
    },
  },
});

export default theme;
