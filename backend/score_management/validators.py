from django.core.exceptions import ValidationError, ObjectDoesNotExist
from asgiref.sync import sync_to_async
from match_management.models import Matches, PlayingSquad
from .models import deliveries
from django.db.models import ObjectDoesNotExist
from .utils import active, match_started, match_ended


def exception_data(error_code, message):
    return {"errorCode": error_code, "message": message}


async def validate_match_id(value):
    try:
        match_id = int(value)
        
        await sync_to_async(Matches.objects.get)(id=match_id, status__gte=1)

    except Matches.DoesNotExist:
     
        data = {
            "errorCode": "9106",
            "message": "Match not found",
        }
        raise ValidationError(data)
    except ValueError:
    
        data = {
            "errorCode": "9118",
            "message": "Invalid match Id",
        }
        raise ValidationError(data)
    except Exception:

        data = {
            "errorCode": "9112",
            "message": "An error occurred while processing the request",
        }
      
        raise ValidationError(data)


def validate_not_null_or_empty(value, field_name, error_code):

    if value is None or value == "":

        data = {
            "errorCode": error_code,
            "message": f"{field_name} is required",
        }
      
        raise ValidationError(data)


def validate_overs(no_of_overs):
    validate_not_null_or_empty(no_of_overs, "overNo", "9180")
  
    if not isinstance(no_of_overs, int):
        data = {
            "errorCode": "9182",
            "message": "Invalid over number",
        }
        raise ValidationError(data)


def validate_allowed_values(field, value, allowed_values):
  
    if value not in allowed_values:
       
        data = {
            "errorCode": "9132",
            "message": f"{field} should be one of {allowed_values}",
        }
        raise ValidationError(data)


def validate_player(value, field):
    
    if field == "Striker":
        validate_not_null_or_empty(value, field, "9114")
    elif field == "Non striker":
        validate_not_null_or_empty(value, field, "9116")
    else:
        validate_not_null_or_empty(value, field, "9115")


def validate_bowler(value):
    validate_not_null_or_empty(value, "Bowler", "9115")


async def validate_players(self, player_id, match_id, player_type):
    player_type_messages = {0: "Striker", 1: "Non-Striker", 2: "Bowler", 3: "fielder"}
    player_error_code = {0: "9171", 1: "9172", 2: "9173", 3: "9174"}
    
   
    if player_id is None:
        return False

    error_message = f"{player_type_messages[player_type]} not found in the playing 11"
    error_code = player_error_code[player_type]
    try:
        await sync_to_async(PlayingSquad.objects.get)(
            player_id=player_id, status=1, match_id=match_id
        )

    except ObjectDoesNotExist:
        
        await self.send_error_message(error_code=error_code, message=error_message)
        return True  # Indicate validation failure
    except Exception:
       
        await self.send_error_message(
            error_code="9132", message="An error occurred while validating player"
        )
        return True  # Indicate validation failure

    return False  # Indicate validation success


async def validate_player_out(self, player_id, match_id, innings_no, field, error_code):
 
    try:
        if(await sync_to_async(deliveries.objects.get)(
            striker=player_id,
            match_id=match_id,
            type_of_dismissal__in=[1, 2, 3, 4, 5],
            innings_no=innings_no,
        )):
            
            await self.send_error_message(
            error_code=error_code, message=f"{field} has already been dismissed"
        )
            return True
    
        
    except Exception:
        print("inside exception......")

        
        return False


def validate_overs(no_of_overs):
    validate_not_null_or_empty(no_of_overs, "overNo", "9180")
 
    if not isinstance(no_of_overs, int):
        data = {
            "errorCode": "9181",
            "message": "Invalid overNo",
        }
        raise ValidationError(data)


def validate_team(batting_team, bowling_team):
   
    validate_not_null_or_empty(batting_team, "battingTeam", "9182")
    validate_not_null_or_empty(bowling_team, "bowlingTeam", "9183")
    match_teams = [{batting_team: "9184"}, {bowling_team: "9185"}]
    for team in match_teams:
        if not isinstance(team, int):
            data = {
                "errorCode": match_teams[team[1]],
                "message": f"Invalid {match_teams[team]}",
            }
            raise ValidationError(data)
    if batting_team == bowling_team:
        data = {
            "errorCode": "9123",
            "message": "Batting team and bowling team cannot be same",
        }
        raise ValidationError(data)



async def validate_ball_count(self, match_id, over_no, innings_no, match_over):

    try:
      
        count= deliveries.objects.filter(status=1, innings_no=innings_no,match_id=match_id).count()
        if count ==0 and over_no!=1: 
            
                await self.send_error_message(
                    error_code="9200",
                    message="First overNo must be 1",
                )
                return True
        latest_delivery=None
        if count >0:   

            latest_delivery = deliveries.objects.filter(status=1, match_id=match_id).order_by('-id').first()

        else:
            return
       
        balls_in_currentover = (
             deliveries.objects.filter(
                over_no=over_no,
                innings_no=innings_no,
                match_id=match_id,
            )
            .exclude(type_of_extras__in=[1, 2])
            .count()
        )

        ball_in_previous_over = (
            deliveries.objects.filter(
                over_no=latest_delivery.over_no,
                innings_no=innings_no,
                match_id=match_id,
            )
            .exclude(type_of_extras__in=[1, 2])
            .count()
        )

        
   
        if balls_in_currentover and balls_in_currentover >= 6 :
          
            await self.send_error_message(
                error_code="9140", message="Valid ball count exceed the limit (6)"
            )
            return True
        if match_over < over_no:
           
            await self.send_error_message(
                error_code="9156",
                message="over number exceeds the limit of match overs",
            )
            return True
      
        if latest_delivery.over_no != over_no and ball_in_previous_over<6:
          
            await self.send_error_message(
                error_code="9201",
                message="Current over not ended, cannot change the overNo",
            )
            return True
        elif ((latest_delivery.over_no+1) != over_no and ball_in_previous_over>=6):
            await self.send_error_message(
                error_code="9202",
                message="Invalid overNo, keep order of overNo",
            )
            return True

        

    except ValidationError as e:
        print("this is the error", e)
       

async def validate_innings_started(self, innings_no, match_id):

    match = await sync_to_async(Matches.objects.get)(id=match_id, status__gte=active())
   
    if match.status == 3 and innings_no == 2:
        await self.send_error_message(
            error_code="9096", message="This is first innings, inningsNo 2 is not valid"
        )
        return True
    if match.status == 4 and innings_no == 1:

        await self.send_error_message(
            error_code="9095",
            message="This is second innings, inningsNo 1 is not valid",
        )
        return True



def validate_innings_no(innings_no):
    validate_not_null_or_empty(innings_no, "inningsNo", "9111")
   
    if innings_no not in [1, 2]:
        raise ValidationError(
            exception_data(error_code="9110", message="Invalid inningsNo")
        )


def validate_striker(striker):
    validate_not_null_or_empty(striker, "striker", "9114")
    if not isinstance(striker, int):
        raise ValidationError(
            exception_data(error_code="9109", message="Invalid striker")
        )


def validate_bowler(bowler):

    validate_not_null_or_empty(bowler, "bowlerId", "9115")
    if not isinstance(bowler, int):
        raise ValidationError(
            exception_data(error_code="9129", message="Invalid bowlerId")
        )


def validate_non_striker(striker):

    validate_not_null_or_empty(striker, "striker", "9116")
    if not isinstance(striker, int):
        raise ValidationError(
            exception_data(error_code="9128", message="Invalid nonStriker")
        )


def validate_runs(runs):
    validate_not_null_or_empty(runs, "runs", 9117)
    if runs not in [0, 1, 2, 3, 4, 5, 6]:
        raise ValidationError(exception_data(error_code="9007", message="Invalid runs"))


def validate_match_started_ended(match_id):
  
    try:
        match = Matches.objects.get(id=match_id)
      
        if match.status < match_started():

            raise ValidationError(
                exception_data(error_code="9121", message="Match not started")
            )
        elif match.status >= match_ended():
            raise ValidationError(
                exception_data(error_code="9122", message="Match has ended")
            )
    except Exception as e:
        print("error", e)

    return 0


def validate_batting_bowling(batting_team_id, bowling_team_id):
    validate_not_null_or_empty(batting_team_id, "battingTeam", "9182")
    validate_not_null_or_empty(bowling_team_id, "bowlingTeam", "9183")

    if not isinstance(batting_team_id, int):
        raise ValidationError(
            exception_data(error_code="9105", message="Invalid battingTeam")
        )
    if not isinstance(bowling_team_id, int):
        raise ValidationError(
            exception_data(error_code="9104", message="Invalid bowlingTeam")
        )
    if batting_team_id == bowling_team_id:
        raise ValidationError(
            exception_data(
                error_code="9123", message="battingTeam and bowlingTeam should not be same "
            )
        )


def validate_striker_non_striker_bowler_fielder(striker, non_striker, bowler, fielder):
    if striker == non_striker:
        raise ValidationError(
            exception_data(
                error_code="9125", message="striker and nonStriker should not be same"
            )
        )
    elif striker == bowler:
        raise ValidationError(
            exception_data(
                error_code="9127", message="striker and bowler should not be same"
            )
        )
    if bowler == non_striker:
        raise ValidationError(
            exception_data(
                error_code="9126", message="bowler and nonStriker should not be same"
            )
        )

    if fielder is not None or fielder == "":
        if fielder == bowler:
            raise ValidationError(
                exception_data(
                    error_code="9099",
                    message="dismissedByFielder and bowler should not be same",
                )
            )
        if fielder == striker:
            raise ValidationError(
                exception_data(
                    error_code="9098",
                    message="dismissedByFielder and striker should not be same",
                )
            )
        if fielder == non_striker:
            raise ValidationError(
                exception_data(
                    error_code="9097",
                    message="dismissedByFielder and nonStriker should not be same",
                )
            )


def validate_extras(extras, type_of_extras):
    validate_not_null_or_empty(extras, "extras", "9135")
    if extras not in [0, 1]:
        raise ValidationError(
            exception_data(error_code="9133", message="Invalid extras")
        )
    if extras == 1 and (type_of_extras is None or type_of_extras == ""):
        print("type of extras", type_of_extras)
        raise ValidationError(
            {
                "errorCode": "9130",
                "message": "Both typeOfExtras and extras is need to mark extras",
            }
        )

    if extras == 0 and type_of_extras is not None:
        raise ValidationError(
            exception_data(
                error_code="9103",
                message="extras is not provided so no need to mention typeOfExtras",
            )
        )
  
    if type_of_extras and type_of_extras not in [1, 2, 3, 4, 5]:
        raise ValidationError(
            exception_data(
                error_code="9134", message="typeOfExtras should be one of [1,2,3,4,5]"
            )
        )



def validate_wicket(wicket, type, fielder,runs):
    validate_not_null_or_empty(wicket, "wicket", "9136")
    
    validate_wicket_with_runs(wicket=wicket,type=type,runs=runs)
    if wicket not in [1, 0]:
        raise ValidationError(
            exception_data(error_code="9138", message="Invalid wicket")
        )

    if wicket == 1 and (type is None or type == ""):
        raise ValidationError(
            exception_data(
                error_code="9139",
                message="Both typeOfDismissal and wicket is need to mark wicket",
            )
        )
    

    
    if wicket == 0 and (type is not None or fielder is not None):
        raise ValidationError(
            exception_data(
                error_code="9101",
                message="wicket is not provided so no need to mention typeOfDismissal and dismissedByFielder",
            )
        )

    if type is not None and type not in [1, 2, 3, 4, 5]:
        raise ValidationError(
            exception_data(
                error_code="9137",
                message="typeOfDismissal should be one of [1,2,3,4,5]",
            )
        )
    if type in [2, 4, 5] and (fielder is None or type == ""):
        raise ValidationError(
            exception_data(
                error_code="9158",
                message="dismissedByFielder is required for catch, run out and stumping",
            )
        )
    if type in [1, 3] and (fielder is not None):
        raise ValidationError(
            exception_data(
                error_code="9102",
                message="dismissedByFielder is not required for bowled and hit wicket",
            )
        )

def validate_wicket_with_runs(wicket,type,runs):
   
    if wicket ==1 and type!=4 and runs !=0:
        
         raise ValidationError(
            exception_data(
                error_code="9092",
                message="typeOfDismissal is not run out so can’t provided run other than 0",
            )
        )


async def validate_players_ids(self, match_id, innings_no, players):
  
    try:
       
        if await validate_player_out(
            self,
            match_id=match_id,
            player_id=players[0],
            innings_no=innings_no,
            field="striker",
            error_code=9159,
        ) or await validate_player_out(
            self,
            match_id=match_id,
            player_id=players[1],
            innings_no=innings_no,
            field="non striker",
            error_code=9160,
        ):
            
            return True

        for player_type, player_id in enumerate(players):

            if await validate_players(self, player_id, match_id, player_type):
                return
    except Exception:
   
        await self.send_error_message(error_code="9132", message="Invalid Player")
        return True


async def validate_team_in_match(self, batting_team, bowling_team, match_id):
    match = Matches.objects.get(id=match_id)

    if batting_team != match.opponent_one.id and batting_team != match.opponent_two.id:
        await self.send_error_message(
            error_code="9094", message="battingTeam not found in match"
        )
        return True

    if bowling_team != match.opponent_one.id and bowling_team != match.opponent_two.id:
        await self.send_error_message(
            error_code="9093", message="bowlingTeam not found in match"
        )
        return True
