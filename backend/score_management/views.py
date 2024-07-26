from django.shortcuts import render
from rest_framework.views import APIView
from team_management.models import Team
from .models import deliveries
from usermanagement.models import UserData
from match_management.models import Matches
from rest_framework.response import Response
from .util.enum import active_match_status
from django.db.models import Max, Sum

def calculate_match_stat(match_deliveries,match_id):

                last_delivery = match_deliveries.order_by('-id').first()
                batsman_one_id=UserData.objects.get(id=last_delivery.striker.id)
              
                batsman_two_id=UserData.objects.get(id=last_delivery.non_striker.id)
                
                bowler_id=UserData.objects.get(id=last_delivery.bowler.id)
                batting_team_id=last_delivery.batting_team
                bowling_team_id=last_delivery.bowling_team

                team_total = sum(delivery.runs + 1 if delivery.type_of_extras in [1, 2] else delivery.runs for delivery in match_deliveries)

                team_wickets = match_deliveries.filter(wicket=1).count()
            
                balls_bowled = len(match_deliveries.exclude(type_of_extras__in=[1, 2]))
                

                # Calculate runs conceded
                runs_conceded = team_total
                team_overs = balls_bowled // 6 + (balls_bowled % 6) / 10
                crr = (runs_conceded / balls_bowled) * 6 if balls_bowled > 0 else 0

                batter_one_name= batsman_one_id.first_name +" "+ batsman_one_id.last_name
                batter_two_name= batsman_two_id.first_name +" "+ batsman_two_id.last_name
                bowler_name= bowler_id.first_name + " " + bowler_id.last_name
                batter_one = match_deliveries.filter(striker=batsman_one_id)
                batter_one_ballfaced = batter_one.filter().exclude(type_of_extras__in=[1, 2]).exclude(extras=2).count()
                batter_one_runs = sum(delivery.runs for delivery in batter_one.exclude(type_of_extras__in=[3, 4]))
                batter_one_fours = batter_one.filter(runs=4).count()
                batter_one_sixes = batter_one.filter(runs=6).count()
                batter_one_sr = (batter_one_runs / batter_one_ballfaced) * 100 if batter_one_ballfaced > 0 else 0

                batter_two_stats = match_deliveries.filter(striker=batsman_two_id)
                batter_two_ballfaced = batter_two_stats.filter().exclude(type_of_extras__in=[1, 2]).exclude(extras=2).count()
                batter_two_runs = sum(delivery.runs for delivery in batter_two_stats.exclude(type_of_extras__in=[3, 4]))      
                batter_two_fours = batter_two_stats.filter(runs=4).count()
                batter_two_sixes = batter_two_stats.filter(runs=6).count()
                batter_two_sr = (batter_two_runs / batter_two_ballfaced) * 100 if batter_two_ballfaced > 0 else 0

                batter_stats1 = {
                    'runs': batter_one_runs,
                    'fours': batter_one_fours,
                    'sixes': batter_one_sixes,
                    'ballsFaced': batter_one_ballfaced,
                    'strikeRate': round(batter_one_sr,2), 
                    'name': batter_one_name,
                }

                batter_stats2 = {
                    'runs': batter_two_runs,
                    'fours': batter_two_fours,
                    'sixes': batter_two_sixes,
                    'ballsFaced': batter_two_ballfaced,
                    'strikeRate':round(batter_two_sr,2),
                    'name': batter_two_name
                }

                last_delivery = match_deliveries.last()

                current_over_deliveries = deliveries.objects.filter(
                match_id=match_id,
                status=1,
                over_no=last_delivery.over_no,
                innings_no=last_delivery.innings_no
                )
                current_over_stats = []
                for balls in current_over_deliveries:
                    if balls.type_of_extras == 1:
                        show_ball = str(balls.runs) + "WD"
                    elif balls.type_of_extras == 2:
                            show_ball = str(balls.runs) + "NB"
                    elif balls.type_of_extras == 3:
                            show_ball = str(balls.runs) + "B"
                    elif balls.type_of_extras == 4:
                            show_ball = str(balls.runs) + "LB"
                    elif balls.wicket== 1:
                        show_ball = str(balls.runs) + "W"
                    else:
                        show_ball = str(balls.runs)
                    current_over_stats.append(show_ball)
              

                print(batter_stats2,batter_stats2)
              

                bowler_stats = match_deliveries.filter(bowler=bowler_id)
                bowler_wickets = len(bowler_stats.filter(wicket=1))  
                runs_conceded = sum(delivery.runs for delivery in bowler_stats)
                bowler_over = len(bowler_stats.exclude(extras=1,type_of_extras__in=[1, 2]))

                if bowler_over > 0:
                    eco = (runs_conceded / bowler_over) * 6
                elif runs_conceded == 0:
                    eco = 0
                else:
                    eco = None

                bowler_statss = {
                    'balls': bowler_over // 6 + (bowler_over % 6) / 10,
                    'runs': runs_conceded,
                    'wkts': bowler_wickets,
                    'name':bowler_name,
                   "eco": round(eco,2),

                } 
                
                match_stats = {
                    'battingTeamId': batting_team_id.id,
                    'bowlingTeamId': bowling_team_id.id,
                    'teamTotal': team_total,
                    'teamWickets': team_wickets,
                    'teamOvers': team_overs,
                    'crr':  round(crr,2),
                    'batterOneStats': batter_stats1,
                    'batterTwoStats': batter_stats2,
                    'currentOverStats': current_over_stats,
                    'bowlerStats': bowler_statss,
                }

                print (match_stats) 
                return match_stats
class GetCurrentScore(APIView):

   


    def get(self,request):
        try:
            match_id=int(request.query_params['matchId'])
            match_deliveries = deliveries.objects.filter(match_id=match_id, status = 1)
            if not match_deliveries:
                return Response(0)
            print(match_deliveries,"innings data")
            last_innings_number = match_deliveries.aggregate(last_innings=Max('innings_no'))['last_innings']
            print("last innings number: ",last_innings_number)
            print("deliveries",match_deliveries)
            if last_innings_number==1:

                match_stat=calculate_match_stat(match_deliveries,match_id)

                match_stat['teamBowlingTotal']=0
                match_stat['teamBowlingOvers']=0
                match_stat['teamBowlingwickets']=0

                 
                return Response(match_stat,status=200)

            else:
                match_deliveries = deliveries.objects.filter(match_id=match_id, status = 1,innings_no=2 )

                match_stat=calculate_match_stat(match_deliveries,match_id)

                match_deliveries2 = deliveries.objects.filter(match_id=match_id, status = 1,innings_no=1 )
                team_total = sum(delivery.runs for delivery in match_deliveries2)
                team_wickets = match_deliveries2.filter(wicket=1).count()
                print("balls bowled",len(match_deliveries2))
            
                balls_bowled = len(match_deliveries2.exclude(extras=1).exclude(type_of_extras__in=[1, 2]))
                print("BALLS BOWLERD",balls_bowled)

                # Calculate runs conceded
                runs_conceded = team_total
                team_overs = balls_bowled // 6 + (balls_bowled % 6) / 10
               
                match_stat['teamBowlingTotal']=runs_conceded
                match_stat['teamBowlingOvers']=team_overs
                match_stat['teamBowlingwickets']=team_wickets
                
                return Response(match_stat,status=200)


        except Exception as e:
            print(e)
            return Response(str(e))