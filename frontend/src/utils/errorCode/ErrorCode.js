export function ErrorCode(errorCode) {
  switch (errorCode) {
    case "2031":
      return "Current password is not correct";
    case "1031":
      return "User not found";
    case "2010":
      return "Confirm password not matching";
    case "2002":
      return "Password is required field, Please enter valid Password";
    case "2004":
      return "This pattern matches strings that are 8 to 32 characters long and contain only alphanumeric characters and the specified special characters";
    case "2001":
      return "Email is required field, Please enter valid Email";
    case "2003":
      return "Please enter valid Email";
    case "2030":
      return "Enter all valid fields";
    case "1007":
      return "Your link expired";
    case "2015":
      return "Your link used once, please send other reset link to your mail";
    case "4700":
      return "The new password cannot be identical to the current password.";
    case "5007":
      return "Invalid logo format";
    case 4110:
      return "Tournament matches already fixed, creating a new team is not possible.";
      case 5023:  
      return "Sorry, you can't create more than 16 teams under a tournament"; 
    default:
      return "Something went wrong";
  }
}

export function PlayerListErrorCode(errorCode) {
  const errorMessages = {
    4601: "Team does not exist",
    4602: "Something went wrong",
    default: "Oops! Something went wrong. Please try again later .",
  };
  return errorMessages[errorCode] || errorMessages["default"];
}

export function MatchDeleteErrorCode(errorCode) {
  const errorMessages = {
    4603: "This user is not permitted to do this action",
    9201: "Matches in the tournament have already started, unable to delete the fixtures",
    9203:"There are no match fixtures generated to delete.",
    9202:"Tournament has ended, unable to delete the fixtures",
    6601:"Tournament does not exist or is inactive",
    default: "Oops! Something went wrong. Please try again later .",
  };
  return errorMessages[errorCode] || errorMessages["default"];
}
export function TournamentErrorCode(errorCode) {
  const errorMessages = {
    4001: "Tournament name cannot be null or empty.", 
    4002: "Venue cannot be null or empty.", 
    4003: "Ground cannot be null or empty.",
    4004: "Start date cannot be null or empty.",  
    4005: "End date cannot be null or empty.", 
    4006: "Tournament Category cannot be null or empty.", 
    4007: "Ball Type cannot be null or empty.", 
    4009: "User ID cannot be null or empty.",  
    4010: "No active user found.", 
    4011: "Organizer name cannot be null or empty.", 
    4012: "Organizer contact cannot be null or empty.",  
    4013: "Tournament name must be between 2 and 100 characters.",   
    4014: "Venue must be between 2 and 100 characters.", 
    4015: "Ground must be between 2 and 100 characters.", 
    4016: "Description must be between 0 and 255 characters.",  
    4017: "Organizer name must be between 2 and 100 characters.",  
    4018: "Tournament ID is required.", 
    4019: "Invalid date format for Start date. Please provide the date in YYYY-MM-DD format.", 
    4020: "Invalid date format for End date. Please provide the date in YYYY-MM-DD format.", 
    4021: "Start date must not be in the past.", 
    4022: "End date must not be in the past.", 
    4023: "End date should be greater than start date.",  
    4024: "Invalid tournament category.", 
    4025: "Invalid ball type.", 
    4026: "Invalid tournament name.", 
    4027: "Invalid venue.", 
    4028: "Invalid ground.", 
    4029: "Invalid description.", 
    4030: "Start date cannot be changed after the tournament start.", 
    4110: "Sorry no tournament found", 
    default: "Oops! Something went wrong. Please try again later.", 
  };

  return errorMessages[errorCode] || errorMessages["default"]; 
}

export function PlayerRegistrationErrorCode(errorCode) {
  const errorMessages = {
    3101: "Please enter a valid first name", 
    3102: "please enter a valid last name", 
    3103: "please select a valid date of birth",  
    3104: "please enter a valid email",  
    3105: "please select a valid batting style",  
    3106: "please select a valid balling style",  
    3107: "please enter a valid password",  
    3111: "please enter first name",  
    3112: "please enter last name",
    3113: "please select date of birth", 
    3114: "please enter email", 
    3115: "please enter password", 
    3116: "Invalid registration link...please try again", 
    3117: "enter a valid phone number", 
    3118: "please enter a phone number",  
    3119: "please select gender", 
    3030: "Please use the email you registered with.",
    3033: "Page not found",  
    3035: "Player with the email already exists",  
    default: "Unknown error code", 
  };

  return errorMessages[errorCode] || errorMessages["default"];
}

export function ValidateEmailErrorCode(errorCode) {
  const errorMessages = {
    3104: "Please enter a valid email", 
    3109: "Email already exists", 
    3114: "Please enter email", 
    3035: "Player with this email already exists", 
    default: "An unexpected error occurred", 
  };

  return errorMessages[errorCode] || errorMessages["default"];
}
export function getTeamErrorCode(errorCode) {
  if (errorCode === "4001") {
    return "The specified team does not exist";  
  } else {
    return "oops...an unexpected error occurred";  
  }
}
export function teamUpdationErrorCode(errorCode) {
  if (errorCode === "4002") {
    return "please provide a team id"; 
  } else if (errorCode === "4003") { 
    return "The specified team does not exist"; 
  } else {
    return "An unexpected error occurred"; 
  }
}

export function TournamentListErrorCode(errorCode) {
  switch (errorCode) {
    case "1906": 
      return "Current user doesn’t have permission to perform this action";  
    case "3101":  
      return "Tournament does not exist";  
    default:
      return "An unexpected error occoured"; 
  }
}
export function TeamErrorCode(errorCode) {
  switch (errorCode) {
    case "5110": 
      return "Team does not exist";  
    case "4555":  
      return "Tournament not found or inactive"; 
    case "4556":  
      return "Tournament has already ended, not able to delete the team";  
    case "4557":  
      return "Tournament matches already fixed, unable to delete the team";  
   
    default:
      return "Oops! Something went wrong. Please try again later."
  }
}
export function AddPlayerToTeamErrorMessage(errorCode) {
  const errorMessages = {
    4501: "This user is already a member of a team in this tournament.", 
    4502: "Team size reached limit, cannot add more players.", 
    4503: "Player not found.",
    4507:"Team size has exceeded ,please review selection" ,
    4504: "Team not found.", 
    1907: "Unknown error occurred.", 
    3104: "Please enter a valid email.", 
    3109: "The entered email already exists.", 
    3114: "Please enter email.", 
    default: "An unexpected error occurred.", 
  };

  return errorMessages[errorCode] || errorMessages["default"];
}
export function AddPlayerElevenErrorMessage(errorCode) {
  const errorMessages = {

    4511: "Team ID is required.",
    4512: "Match ID is required.",
    5113: "Invalid match ID.",
    5114: "Invalid team ID.",
    4507: "You do not have permission to perform this operation.",
    4503: "Player ID not found.",
    6728:"Each team must contain excatly 11 players.",
    default: "An unexpected error occurred.", 
  };

  return errorMessages[errorCode] || errorMessages.default;
}

export function matchErrorCode(errorCode) {
  const errorMessages = {
    6502: "Tournament must contain atleast 2 teams",  
    6500: "Tournament id is required",
    6501: "All teams must contain 11 members.",  
    4603: "This user cannot access this team details",  
    6504: "Tournament with this id does not exist or is already inactive.",  

    6201: "One or both teams do not exist or are not active",  
    6207: "Matches in existing round not completed",   
    6200: "Tournament fixture completed", 
    6205: "No winner teams found",
   
    default: "An unexpected error occurred.", 
  };
  return errorMessages[errorCode] || errorMessages["default"];
}

export function CoinTossErrorCode(errorCode) {
  const errorMessages = {
    6001: "Invalid toss winner",
    6002: "Invalid toss decision",
    6003: "Can't toss after the match has started",
    6004: "Toss winner is required",
    6005: "Toss decision is required",
    6600: "Match id is required",
    4000: "Invalid Match Id",
    6010:"Match not found",
    4603: "This user cannot access to perform this action",
    6011:"Match details must be entered.",
    6012:"Can't toss before the scheduled time and date.",
    default: "Unknown error",
  };

  return errorMessages[errorCode] || errorMessages["default"];
}

export function MatchScheduleUpdateErrorCode(errorCode) {
  const errorMessages = {
    7700: "Invalid match id",
    7701: "User does not have permission to perform this action",
    7702: "Match has begun or ended",
    7703: "Ground not found",
    7704: "Overs must be a valid integer",
    7705: "Oops! Something went wrong. Please try again later.",
    7706: "Ground is required",
    7707: "Invalid Ground",
    7708: "Overs is required",
    7709: "Overs must be between 0 and 50.",
    7710: "Overs must be a valid integer",
    7711: "City is required",
    7712: "City should have at least 2 and at most 100 characters",
    7713: "Invalid City",
    7714: "Match date is required",
    7715: "Match date should be between the tournament period",
    7716: "Match time is required",
  
  };
  return errorMessages[errorCode] || "Oops! Something went wrong. Please try again later.";
}
