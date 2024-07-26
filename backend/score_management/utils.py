from django.core.exceptions import ValidationError
from asgiref.sync import sync_to_async
from match_management.models import Matches
from .models import deliveries
from channels.db import database_sync_to_async
from rest_framework.response import Response
from score_management.models import deliveries
from tournament_management.models import Tournament
import json

async def send_previous_score(value):
    try:

        match_id = int(value)
        match = await sync_to_async(deliveries.objects.get)(id=match_id, status__gte =1)
        runs = match.runs
        return str(runs)

    
    except Matches.DoesNotExist:
        data = {
            "errorCode": "9132",
            "message": "Match not found",
        }
        raise ValidationError(data)
    except ValueError:
        data = {
            "errorCode": "9118",
            "message": "Invalid match Id",
        }
        raise ValidationError(data)
    except Exception as e:
        data = {
            "errorCode": "9112",
            "message": "An error occurred while processing the request",
        }
        print("Error:", e)
        raise ValidationError(data)
    
def active():
    return 1

def match_started():
    return 3

def match_ended():
    return 6

def calculate_eco(bowler_over, runs_conceded):
    if bowler_over == 0:
        return 0
    elif runs_conceded == 0:
        return 0
    else:
        eco = (runs_conceded / bowler_over) * 6
        return round(eco, 2)
def match_second_innings():
    return 4

def process_current_over(current_over_deliveries):
    current_over_stats = []
    for balls in current_over_deliveries:
        show_ball = ""
        if balls.type_of_extras == 1:
            show_ball = str(balls.runs) + "WD"
        elif balls.type_of_extras == 2:
            show_ball = str(balls.runs) + "NB"
        elif balls.type_of_extras == 3:
            show_ball = str(balls.runs) + "B"
        elif balls.type_of_extras == 4:
            show_ball = str(balls.runs) + "LB"
        elif balls.wicket == 1:
            show_ball = str(balls.runs) + "W"
        else:
            show_ball = str(balls.runs)
        current_over_stats.append(show_ball)
    return current_over_stats


def update_match_status(match_id,innings_no,tournament_id,over_no,team_one_id,team_two_id):
  
    try:
        match = Matches.objects.get(id = match_id)
        tournament= Tournament.objects.get(id = tournament_id)
      
        print("tournament", tournament)
        valid_balls_in_currentover = (
            deliveries.objects.filter(
                over_no=over_no,
                innings_no=innings_no,
                match_id=match_id,
                status = 1
            )
            .exclude(type_of_extras__in=[1, 2])
            .count()
        )
        number_of_wickets = deliveries.objects.filter(
                                    innings_no=innings_no,
                                    match_id=match_id,
                                    wicket=1,
                                    status = 1).count()

        if (match.number_of_overs == over_no and valid_balls_in_currentover >= 6 and innings_no == 1) or (number_of_wickets >=10):
            match.status = match_second_innings()
            match.save()
        
        elif(innings_no==2 ):
            second_batting_details = deliveries.objects.filter(match_id=match_id, status=1,innings_no = innings_no,batting_team=team_one_id)
            second_batting_score = sum(delivery.runs + 1 if delivery.type_of_extras in [1, 2] else delivery.runs for delivery in second_batting_details)
            first_batting_details = deliveries.objects.filter(match_id=match_id, status=1,innings_no = innings_no,batting_team=team_two_id)
            first_batting_score = sum(delivery.runs + 1 if delivery.type_of_extras in [1, 2] else delivery.runs for delivery in first_batting_details)
            if(second_batting_score>first_batting_score):
                match.status = match_second_innings()
                match.winner=team_one_id
                match.save()
                
            elif (match.number_of_overs == over_no and valid_balls_in_currentover >= 6 and innings_no == 2) or (number_of_wickets >=10) or (innings_no == 2  ):
                
                    match.status = match_ended()
                    match.winner=team_two_id
                    match.save()
                    
            
    except Exception :
        print("An exception in occuring in updating match status")
 