
from django.core.exceptions import ValidationError
import os, re
from team_management.models import  Squad
from rest_framework import status

from .models import Matches,Ground,PlayingSquad
from .util.enum import match_status, active_match_status, toss_decision,minimum_over,over_limit,is_tossed,playing11_limit,is_playing11_added

from rest_framework.response import Response

def validate_tournament_id(tournament_id):

    if not tournament_id:
        raise ValidationError(
                {"errorCode": "6500", "message": "tournament id is required"}, 
        )
    
def validate_team_players_count(teams):
     for team in teams:
        # Retrieve a queryset of squads for the current team with status=1
        squads = Squad.objects.filter(team_id=team, status=1)
        # Get the count of players for the current team
        number_players = squads.count()
        if number_players<11:
            print(number_players,"number of players")
            data = {"errorCode": "6501", "message": "All teams must contain 11 members."}
            print(data)
            raise ValidationError(data)
def validate_match_status(matches):
    statuses=match_status()
    active_status=active_match_status()
    for match in matches:
        status = Matches.objects.get(id=match, status__in=active_status)
        if status.status!=statuses[6]:
            return 0
    return 1

def validate_not_null_or_empty(value,field,error_code):
    if value is None or value == "":
        raise ValidationError({"errorCode": error_code, "message": field + " is required"})

def validate_toss_decision(value):
    allowed_decisions = toss_decision()
    validate_not_null_or_empty(value,"Toss decision","6005")
    if value is None or value == "" or value not in allowed_decisions:
        raise ValidationError({"errorCode": "6002", "message": "Invalid toss decision"})
    


def validate_toss_winner(value, match):
    print("value",value)
    print("match",match)
    validate_not_null_or_empty(value,"Toss winner","6004")
    opponents= []
    opponents.append(match.opponent_one.id),
    opponents.append(match.opponent_two.id),
   
    
           
    if value not in opponents:
        raise ValidationError({"errorCode": "6001", "message": "Invalid toss winner"},)
def validate_match_id(match_id):
    if not match_id:
        raise ValidationError({"errorCode": "6600", "message": "Match ID is required"})
    try:
        int(match_id)
    except ValueError:
        raise ValidationError({"errorCode": "4000", "message": "Invalid match ID"},)
    
       

  
def validate_match_fixture_status(match_status):
   
    if match_status ==2:
        raise ValidationError({"errorCode": "6522", "message": "Match has already started, not able to delete the match"})
    elif  match_status ==6:
        raise ValidationError({"errorCode": "6603", "message": "Match has already ended"})
    elif match_status == 0:
        raise ValidationError({"errorCode": "6601", "message": "Match not exist or inactive"})
def validate_ground(ground):
    if  ground=="" or ground==None:
        raise ValidationError({"errCode":"7706 ","mnessage":"Ground is required."})
    elif len(ground) < 2 or len(ground) > 100:
        raise ValidationError({"errCode":"7710","message":"Invalid ground name."})
    if not re.match(r'^(?!.*\s{2})[^\s].*[^\s]$',ground):
        raise ValidationError({"errCode":"7710","message":"Invalid ground name."})
    if Ground.objects.filter(ground_name=ground).count()<1:
        new_ground=Ground(ground_name=ground)
        new_ground.save()

def validate_overs(overs):
    if  overs=="" or overs==None:
        raise ValidationError({"errCode":"7708","message":"Overs is required."})
    try:
        overs = int(overs)
        if overs < minimum_over()  or overs > over_limit():
            raise ValidationError({"errCode":"7709" ,"message":"Overs must be netween 0 and 50."})
    except ValueError as e:
        raise ValueError(e)
        
 

def validate_city(city):
    if city=="" or city==None:
        raise ValidationError({"errCode":"7711","message":"City is required."})
    if len(city)>100 or len(city)<2:
        raise ValidationError({"errCode":"7712","message":"city should have atleast 2 and atmost 100 characters."})
    if not re.match(r"^[a-zA-Z0-9.,\-]+(?: [a-zA-Z0-9.,\-]+)*$", city):
        raise ValidationError(
            {"errorCode": "7713", "message": "invalid City"}
        )
def validate_match_date(match_date,tournament_start_date,tournament_end_date):
    if  match_date=="" or match_date==None:
        raise ValidationError({"errCode":"7714","message":"Match date is required."})
    if not re.match(r"^\d{4}-\d{2}-\d{2}$",str(match_date)):
        raise ValidationError({"errCode":"7717","message":"Invalid match date"})
    if   match_date  < str(tournament_start_date) or  match_date > str(tournament_end_date)   :
        raise ValidationError({"errCode":"7715","message":" Match date should be between the tournament period"})
    

def validate_match_time(match_time):
    if  match_time=="" or match_time==None:
        raise ValidationError({"errCode":"7716","message":"Match time is required."})
    if not re.match(r'^([01]?[\d]|2[0-3]):([0-5][\d])$',match_time):
        raise ValidationError({"errCode":"7718","message":"invalid time format"})
def validate_tournament(value):
    if value=="" or value==None:
        raise ValidationError({"errCode":"4600","message":"Tournament id is required"})  
    if  value.isdigit() ==False :
        raise ValidationError({"errCode":"4601","message":"invalid tournament id"})

def validate_tossed(match):
    if match.status < is_tossed:
        raise ValidationError({"errCode":"4512","message":"Toss not yet done"})

def validate_params(value,field, error_code):
    if value is None or value == "":

        print("inside the validate params")
        data = {
            "errorCode": error_code,
            "message": f"{field} is required",
        }
        

        raise ValidationError(data)
def is_valid_id(value,field, error_code):
    try:
        int(value)
    except Exception:
        data = {
            "errorCode": error_code,
            "message": f"Invalid {field}.",
        }
        raise ValidationError(data)
def validate_playing_squad_limit(team_id):
    if(PlayingSquad.objects.filter(team_id=team_id, status=1).count()>= playing11_limit()):
        return False
        
def validate_status_toss_squad(status):
    print("tupe pof status", type(status))
    print("status ", status)
    if status == 1:
                return ValidationError(
                    {"errorCode": "4515", "message": "Toss not yet done"}, 
                )
            
    if status == 3:
                print(status)
                raise ValidationError(
                    {"errorCode": "4516", "message": "Playing squad already added."}
                )


def validate_player_duplication(players_list):
    if players_list is None:
        raise ValidationError({"errorCode": "1907", "message": "Player list is None"})
    
    has_duplicates = len(players_list) != len(set(players_list))
    if has_duplicates:
        raise ValidationError({"errorCode": "4502", "message": "Players repeating in the playing 11"}, status=400)

def validate_match_players(team_list_one,team_list_two):
     match_player_list = team_list_one.extend(team_list_one)
     has_duplicates = len(team_list_one.extend(match_player_list)) != len(set(team_list_two))
     if has_duplicates:
        raise ValidationError({"errorCode": "4503", "message": "Players repeating in the match"}, status=400)

def validate_add_playing_eleven(match,user_id):
    if match.status < is_tossed():
        return Response({"errorCode":"4550","message":"Players can be added only after tossing"},status=400)
    elif user_id != match.tournament.user.id:
                return Response(
                    {"errorCode": "4507", "message": "You do not have access to perform this operation"},status=400
                )
    elif match.status == is_playing11_added():
        return Response({"errorCode":"4551","message":"Playing 11 already added"},status=400)
