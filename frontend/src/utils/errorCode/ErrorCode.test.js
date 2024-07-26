import {ErrorCode,AddPlayerToTeamErrorMessage ,PlayerRegistrationErrorCode,matchErrorCode,MatchDeleteErrorCode,  
TournamentErrorCode, TournamentListErrorCode,CoinTossErrorCode, ValidateEmailErrorCode,teamUpdationErrorCode,getTeamErrorCode,TeamErrorCode,MatchScheduleUpdateErrorCode,
AddPlayerElevenErrorMessage, } from './ErrorCode';

describe('ErrorCode', () => {
  it('returns correct error message for error code 2031', () => {
    expect(ErrorCode('2031')).toBe('Current password is not correct');
  });

  it('returns correct error message for error code 1031', () => {
    expect(ErrorCode('1031')).toEqual('User not found');
  });

  it('returns correct error message for error code 2010', () => {
    expect(ErrorCode('2010')).toEqual('Confirm password not matching');
  });

  it('returns correct error message for error code 2002', () => {
    expect(ErrorCode('2002')).toEqual('Password is required field, Please enter valid Password');
  });

  it('returns correct error message for error code 2004', () => {
    expect(ErrorCode('2004')).toEqual('This pattern matches strings that are 8 to 32 characters long and contain only alphanumeric characters and the specified special characters');
  });

  it('returns correct error message for error code 2001', () => {
    expect(ErrorCode('2001')).toEqual('Email is required field, Please enter valid Email');
  });

  it('returns correct error message for error code 2003', () => {
    expect(ErrorCode('2003')).toEqual('Please enter valid Email');
  });

  it('returns correct error message for error code 2030', () => {
    expect(ErrorCode('2030')).toEqual('Enter all valid fields');
  });

  it('returns default error message for unknown error code', () => {
    expect(ErrorCode('unknown')).toEqual('Something went wrong');
  });

  it('returns correct error message for error code 2003', () => {
    expect(ErrorCode('2003')).toEqual('Please enter valid Email');
  });

  it('returns correct error message for error code 2030', () => {
    expect(ErrorCode('2030')).toEqual('Enter all valid fields');
  });
 
  it('returns correct error message for error code 1007', () => {
    expect(ErrorCode('1007')).toEqual('Your link expired');
  });

  it('returns correct error message for error code 2015', () => {
    expect(ErrorCode('2015')).toEqual('Your link used once, please send other reset link to your mail');
  });

  it('returns correct code',()=>{
    expect(ErrorCode('4700')).toEqual("The new password cannot be identical to the current password.")
  })
  it('returns correct code',()=>{
    expect(ErrorCode(4110,)).toEqual("Tournament matches already fixed, creating a new team is not possible.")
  })
 
  it('should return correct error message for error code 4001', () => {
    expect(TournamentErrorCode('4001')).toBe("Tournament name cannot be null or empty.");
  });

  it('should return correct error message for error code 4002', () => {
    expect(TournamentErrorCode('4002')).toBe("Venue cannot be null or empty.");
  });

  it('should return correct error message for error code 4003', () => {
    expect(TournamentErrorCode('4003')).toBe("Ground cannot be null or empty.");
  });

  it('should return correct error message for error code 4004', () => {
    expect(TournamentErrorCode('4004')).toBe("Start date cannot be null or empty.");
  });

  it('should return correct error message for error code 4005', () => {
    expect(TournamentErrorCode('4005')).toBe("End date cannot be null or empty.");
  });

  it('should return correct error message for error code 4006', () => {
    expect(TournamentErrorCode('4006')).toBe("Tournament Category cannot be null or empty.");
  });

  it('should return correct error message for error code 4007', () => {
    expect(TournamentErrorCode('4007')).toBe("Ball Type cannot be null or empty.");
  });

  it('should return correct error message for error code 4009', () => {
    expect(TournamentErrorCode('4009')).toBe("User ID cannot be null or empty.");
  });

  it('should return correct error message for error code 4010', () => {
    expect(TournamentErrorCode('4010')).toBe("No active user found.");
  });

  it('should return correct error message for error code 4011', () => {
    expect(TournamentErrorCode('4011')).toBe("Organizer name cannot be null or empty.");
  });

  it('should return correct error message for error code 4012', () => {
    expect(TournamentErrorCode('4012')).toBe("Organizer contact cannot be null or empty.");
  });

  it('should return correct error message for error code 4013', () => {
    expect(TournamentErrorCode('4013')).toBe("Tournament name must be between 2 and 100 characters.");
  });

  it('should return correct error message for error code 4014', () => {
    expect(TournamentErrorCode('4014')).toBe("Venue must be between 2 and 100 characters.");
  });

  it('should return correct error message for error code 4015', () => {
    expect(TournamentErrorCode('4015')).toBe("Ground must be between 2 and 100 characters.");
  });

  it('should return correct error message for error code 4016', () => {
    expect(TournamentErrorCode('4016')).toBe("Description must be between 0 and 255 characters.");
  });

  it('should return correct error message for error code 4017', () => {
    expect(TournamentErrorCode('4017')).toBe("Organizer name must be between 2 and 100 characters.");
  });

  it('should return correct error message for error code 4018', () => {
    expect(TournamentErrorCode('4018')).toBe("Tournament ID is required.");
  });

  it('should return correct error message for error code 4019', () => {
    expect(TournamentErrorCode('4019')).toBe("Invalid date format for Start date. Please provide the date in YYYY-MM-DD format.");
  });

  it('should return correct error message for error code 4020', () => {
    expect(TournamentErrorCode('4020')).toBe("Invalid date format for End date. Please provide the date in YYYY-MM-DD format.");
  });

  it('should return correct error message for error code 4021', () => {
    expect(TournamentErrorCode('4021')).toBe("Start date must not be in the past.");
  });

  it('should return correct error message for error code 4022', () => {
    expect(TournamentErrorCode('4022')).toBe("End date must not be in the past.");
  });

  it('should return correct error message for error code 4023', () => {
    expect(TournamentErrorCode('4023')).toBe("End date should be greater than start date.");
  });

  it('should return correct error message for error code 4024', () => {
    expect(TournamentErrorCode('4024')).toBe("Invalid tournament category.");
  });

  it('should return correct error message for error code 4025', () => {
    expect(TournamentErrorCode('4025')).toBe("Invalid ball type.");
  });

  it('should return correct error message for error code 4026', () => {
    expect(TournamentErrorCode('4026')).toBe("Invalid tournament name.");
  });

  it('should return correct error message for error code 4027', () => {
    expect(TournamentErrorCode('4027')).toBe("Invalid venue.");
  });

  it('should return correct error message for error code 4028', () => {
    expect(TournamentErrorCode('4028')).toBe("Invalid ground.");
  });

  it('should return correct error message for error code 4029', () => {
    expect(TournamentErrorCode('4029')).toBe("Invalid description.");
  });

  
  it('should return correct error message for known error codes', () => {
    expect(AddPlayerToTeamErrorMessage("4501")).toBe("This user is already a member of a team in this tournament.");
    expect(AddPlayerToTeamErrorMessage("4502")).toBe("Team size reached limit, cannot add more players.");
    expect(AddPlayerToTeamErrorMessage("4503")).toBe("Player not found.");
    expect(AddPlayerToTeamErrorMessage("4504")).toBe("Team not found.");
    expect(AddPlayerToTeamErrorMessage("1907")).toBe("Unknown error occurred.");
    expect(AddPlayerToTeamErrorMessage("3104")).toBe("Please enter a valid email.");
    expect(AddPlayerToTeamErrorMessage("3109")).toBe("The entered email already exists.");
    expect(AddPlayerToTeamErrorMessage("3114")).toBe("Please enter email.");
  });
  it('should return correct error message when the team does not exist', () => {
    expect(TeamErrorCode("5110")).toBe("Team does not exist");
  });
  it('should return correct error message when the tournament inactive', () => {
    expect(TeamErrorCode("4555")).toBe("Tournament not found or inactive");
  });
  it('should return correct error message when the match already started', () => {
    expect(TeamErrorCode("4556")).toBe("Tournament has already ended, not able to delete the team");
  });

  it('should return correct error message when the tournament eneded', () => {
    expect(TeamErrorCode("4557")).toBe("Tournament matches already fixed, unable to delete the team");
  });
  it('should return default error message for other error codes', () => {
    expect(TeamErrorCode("1234")).toBe("Oops! Something went wrong. Please try again later.");
    expect(TeamErrorCode("9999")).toBe("Oops! Something went wrong. Please try again later.");
  });
  it('should return default error message for unknown error codes', () => {
    expect(AddPlayerToTeamErrorMessage("9999")).toBe("An unexpected error occurred.");
  });
  it("it should return Sorry, you can't create more than 16 teams under a tournament",()=>{
expect(ErrorCode(5023)).toBe("Sorry, you can't create more than 16 teams under a tournament")
  });


 
  it('should return default error message for unknown error code', () => {
    expect(TournamentErrorCode('9999')).toBe("Oops! Something went wrong. Please try again later.");
  });
})
  test('returns correct error message for known error codes', () => {
    expect(PlayerRegistrationErrorCode("3101")).toBe("Please enter a valid first name");
    expect(PlayerRegistrationErrorCode("3102")).toBe("please enter a valid last name");
    expect(PlayerRegistrationErrorCode("3103")).toBe("please select a valid date of birth");
    expect(PlayerRegistrationErrorCode("3104")).toBe("please enter a valid email");
    expect(PlayerRegistrationErrorCode("3105")).toBe("please select a valid batting style");
    expect(PlayerRegistrationErrorCode("3106")).toBe("please select a valid balling style");
    expect(PlayerRegistrationErrorCode("3107")).toBe("please enter a valid password");
    expect(PlayerRegistrationErrorCode("3111")).toBe("please enter first name");
    expect(PlayerRegistrationErrorCode("3112")).toBe("please enter last name");
    expect(PlayerRegistrationErrorCode("3113")).toBe("please select date of birth");
    expect(PlayerRegistrationErrorCode("3114")).toBe("please enter email");
    expect(PlayerRegistrationErrorCode("3115")).toBe("please enter password");
    expect(PlayerRegistrationErrorCode("3116")).toBe("Invalid registration link...please try again");
    expect(PlayerRegistrationErrorCode("3117")).toBe("enter a valid phone number");
    expect(PlayerRegistrationErrorCode("3118")).toBe("please enter a phone number");
    expect(PlayerRegistrationErrorCode("3119")).toBe("please select gender");
    expect(PlayerRegistrationErrorCode("3033")).toBe("Page not found");
    expect(PlayerRegistrationErrorCode("3030")).toBe("Please use the email you registered with.")
    
  });
  
  test('returns "Unknown error code" for unknown error code', () => {
    expect(PlayerRegistrationErrorCode("9999")).toBe("Unknown error code");
  });   

  describe('getTeamErrorCode', () => {
    it('should return "The specified team does not exist" when errorCode is "4001"', () => {
      expect(getTeamErrorCode("4001")).toBe("The specified team does not exist");
    });
  
    it('should return "oops...an unexpected error occurred" for any other errorCode', () => {
      expect(getTeamErrorCode("1234")).toBe("oops...an unexpected error occurred");
      expect(getTeamErrorCode("5000")).toBe("oops...an unexpected error occurred");
    });
  });
  
  describe('teamUpdationErrorCode', () => {
    it('should return "please provide a team id" when errorCode is "4002"', () => {
      expect(teamUpdationErrorCode("4002")).toBe("please provide a team id");
    });
  
    it('should return "The specified team does not exist" when errorCode is "4003"', () => {
      expect(teamUpdationErrorCode("4003")).toBe("The specified team does not exist");
    });
  
    it('should return "An unexpected error occurred" for any other errorCode', () => {
      expect(teamUpdationErrorCode("1234")).toBe("An unexpected error occurred");
      expect(teamUpdationErrorCode("5000")).toBe("An unexpected error occurred");
    });
  });
  
  
  test('returns correct error message for known error codes', () => {
    expect(ValidateEmailErrorCode("3104")).toBe("Please enter a valid email");
    expect(ValidateEmailErrorCode("3109")).toBe("Email already exists");
    expect(ValidateEmailErrorCode("3114")).toBe("Please enter email");
  });
  
  test('returns "An unexpected error occoured" for unknown error code', () => {
    expect(ValidateEmailErrorCode("9999")).toBe("An unexpected error occurred");
  });
  
  test('returns correct error message for known error codes', () => {
    expect(TournamentListErrorCode("1906")).toBe("Current user doesn’t have permission to perform this action");
    expect(TournamentListErrorCode("3101")).toBe("Tournament does not exist");
  });
  
  test('returns "An unexpected error occoured" for unknown error code', () => {
    expect(TournamentListErrorCode("9999")).toBe("An unexpected error occoured");
  });
  
describe('matchErrorCode function', () => {
  it('should return the correct error message for known error codes', () => {
    expect(matchErrorCode(6502)).toEqual("Tournament must contain atleast 2 teams");
    expect(matchErrorCode(6500)).toEqual("Tournament id is required");
    expect(matchErrorCode(6501)).toEqual("All teams must contain 11 members.");
    expect(matchErrorCode(4603)).toEqual("This user cannot access this team details");
    expect(matchErrorCode(6504)).toEqual("Tournament with this id does not exist or is already inactive.");
    expect(matchErrorCode(6201)).toEqual("One or both teams do not exist or are not active");
    expect(matchErrorCode(6207)).toEqual("Matches in existing round not completed");
    expect(matchErrorCode(6200)).toEqual("Tournament fixture completed");
    expect(matchErrorCode(6205)).toEqual("No winner teams found");
  });

  it('should return the default error message for unknown error codes', () => {
    expect(matchErrorCode(9999)).toEqual("An unexpected error occurred.");
  });

  it('should return the default error message if no error code is provided', () => {
    expect(matchErrorCode()).toEqual("An unexpected error occurred.");
  });
});


describe('MatchDeleteErrorCode', () => {
  it('should return correct error messages for known error codes', () => {
    expect(MatchDeleteErrorCode(9201)).toBe("Matches in the tournament have already started, unable to delete the fixtures");
    expect(MatchDeleteErrorCode(9203)).toBe("There are no match fixtures generated to delete.");
    expect(MatchDeleteErrorCode(9202)).toBe("Tournament has ended, unable to delete the fixtures");
    expect(MatchDeleteErrorCode(6601)).toBe("Tournament does not exist or is inactive");
    expect(MatchDeleteErrorCode(4603)).toBe("This user is not permitted to do this action");
  });


  it('should return default error message for unknown error code', () => {
    expect(MatchDeleteErrorCode(1234)).toBe("Oops! Something went wrong. Please try again later .");
  });

  it('should return default error message if no error code is provided', () => {
    expect(MatchDeleteErrorCode()).toBe("Oops! Something went wrong. Please try again later .");
  });
});
  

describe("CoinTossErrorCode", () => {
  it("should return the correct error message for a valid error code", () => {
    expect(CoinTossErrorCode(6001)).toBe("Invalid toss winner");
    expect(CoinTossErrorCode(6002)).toBe("Invalid toss decision");
    expect(CoinTossErrorCode(6003)).toBe("Can't toss after the match has started");
    expect(CoinTossErrorCode(6004)).toBe("Toss winner is required");
    expect(CoinTossErrorCode(6005)).toBe("Toss decision is required");
    expect(CoinTossErrorCode(6600)).toBe("Match id is required");
    expect(CoinTossErrorCode(4000)).toBe("Invalid Match Id");
    expect(CoinTossErrorCode(6010)).toBe("Match not found");
    expect(CoinTossErrorCode(4603)).toBe("This user cannot access to perform this action");
    expect(CoinTossErrorCode(6011)).toBe("Match details must be entered.");
    expect(CoinTossErrorCode(6012)).toBe("Can't toss before the scheduled time and date.");
  });

  it("should return the default error message for an unknown error code", () => {
    expect(CoinTossErrorCode(9999)).toBe("Unknown error");
  });

  it("should return the default error message if no error code is provided", () => {
    expect(CoinTossErrorCode()).toBe("Unknown error");
  })
})
describe('MatchScheduleUpdateErrorCode', () => {
  it('should return the correct error message for error code 7700', () => {
    expect(MatchScheduleUpdateErrorCode(7700)).toBe('Invalid match id');
  });

  it('should return the correct error message for error code 7701', () => {
    expect(MatchScheduleUpdateErrorCode(7701)).toBe('User does not have permission to perform this action');
  });

  it('should return the correct error message for error code 7702', () => {
    expect(MatchScheduleUpdateErrorCode(7702)).toBe('Match has begun or ended');
  });

  it('should return the correct error message for error code 7703', () => {
    expect(MatchScheduleUpdateErrorCode(7703)).toBe('Ground not found');
  });

  it('should return the correct error message for error code 7704', () => {
    expect(MatchScheduleUpdateErrorCode(7704)).toBe('Overs must be a valid integer');
  });

  it('should return the correct error message for error code 7705', () => {
    expect(MatchScheduleUpdateErrorCode(7705)).toBe('Oops! Something went wrong. Please try again later.');
  });

  it('should return the correct error message for error code 7706', () => {
    expect(MatchScheduleUpdateErrorCode(7706)).toBe('Ground is required');
  });

  it('should return the correct error message for error code 7707', () => {
    expect(MatchScheduleUpdateErrorCode(7707)).toBe('Invalid Ground');
  });

  it('should return the correct error message for error code 7708', () => {
    expect(MatchScheduleUpdateErrorCode(7708)).toBe('Overs is required');
  });

  it('should return the correct error message for error code 7709', () => {
    expect(MatchScheduleUpdateErrorCode(7709)).toBe('Overs must be between 0 and 50.');
  });

  it('should return the correct error message for error code 7710', () => {
    expect(MatchScheduleUpdateErrorCode(7710)).toBe('Overs must be a valid integer');
  });

  it('should return the correct error message for error code 7711', () => {
    expect(MatchScheduleUpdateErrorCode(7711)).toBe('City is required');
  });

  it('should return the correct error message for error code 7712', () => {
    expect(MatchScheduleUpdateErrorCode(7712)).toBe('City should have at least 2 and at most 100 characters');
  });

  it('should return the correct error message for error code 7713', () => {
    expect(MatchScheduleUpdateErrorCode(7713)).toBe('Invalid City');
  });

  it('should return the correct error message for error code 7714', () => {
    expect(MatchScheduleUpdateErrorCode(7714)).toBe('Match date is required');
  });

  it('should return the correct error message for error code 7715', () => {
    expect(MatchScheduleUpdateErrorCode(7715)).toBe('Match date should be between the tournament period');
  });

  it('should return the correct error message for error code 7716', () => {
    expect(MatchScheduleUpdateErrorCode(7716)).toBe('Match time is required');
  });

  it('should return correct error message for valid error codes', () => {
    // Arrange
    const errorCode1 = 4511;
    const errorCode2 = 5113;
    const errorCode3 = 4503;

    // Act
    const errorMessage1 = AddPlayerElevenErrorMessage(errorCode1);
    const errorMessage2 = AddPlayerElevenErrorMessage(errorCode2);
    const errorMessage3 = AddPlayerElevenErrorMessage(errorCode3);

    // Assert
    expect(errorMessage1).toBe('Team ID is required.');
    expect(errorMessage2).toBe('Invalid match ID.');
    expect(errorMessage3).toBe('Player ID not found.');
  });

  it('should return default error message for unknown error codes', () => {
    // Arrange
    const unknownErrorCode = 999;

    // Act
    const errorMessage = AddPlayerElevenErrorMessage(unknownErrorCode);

    // Assert
    expect(errorMessage).toBe('An unexpected error occurred.');
  });
});
