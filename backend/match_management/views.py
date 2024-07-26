from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from tournament_management.models import Tournament
from team_management.models import Team
from .models import Matches, PointTable, Ground, PlayingSquad
from .serializers import MatchSerializer
import json
from datetime import datetime
import pytz
from team_management.models import Squad
from usermanagement.models import UserData
from django.core.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Matches, Team, PlayingSquad
from .validators import validate_params, is_valid_id
from usermanagement.serializers import UserDataSerializer
from score_management.models import deliveries


MATCH_NOT_FOUND = {"errorCode": "6010", "message": "No active match found"}
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from .util.enum import (
    
    match_is_active,
    match_started_status,
    tournament_active_status,
    team_status,
    round1,
    final,
    semi,
    active_match_status,
    match_status,
    is_tossed,

)
from .validators import (
    validate_tournament_id,
    validate_team_players_count,
    validate_match_status,
    validate_ground,
    validate_toss_decision,
    validate_toss_winner,
    validate_overs,
    validate_match_time,
    validate_city,
    validate_match_date,
    validate_tournament,
    validate_match_id,
    validate_params,
    is_valid_id,
    validate_player_duplication,

)

NO_WINNER_FOUND = {"errorCode": "6205", "message": "No winner teams found"}


class MatchPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "pageSize"
    max_page_size = 100


def remove_square_brackets(json_string):
    updated_data = {key: value[0] for key, value in json_string.items()}
    return updated_data


# function to generate match fixture using round robin
def generate_round_robin_fixture(teams):
    fixtures = []
    if len(teams) % 2:
        teams.append(None)
    n = len(teams)
    mid = n // 2
    for _ in range(n - 1):
        fixtures.append([(teams[i], teams[n - 1 - i]) for i in range(mid)])
        teams.insert(1, teams.pop())
    return fixtures




def knockout_fixture(team_ids, tournament):
    round2 = semi()
    insert_data(team_ids[0], team_ids[3], round2, tournament)
    insert_data(team_ids[1], team_ids[2], round2, tournament)


# function to insert data in to the match table
def insert_data(team1, team2, match_round, tournament):
    try:
        team1 = Team.objects.get(id=team1, status=1)
        team2 = Team.objects.get(id=team2, status=1)
        match_instance = Matches(
            round=match_round,
            opponent_one=team1,
            opponent_two=team2,
            tournament=tournament,
        )
        match_instance.save()
    except Team.DoesNotExist:
        raise ValidationError(
            {
                "errorCode": "6201",
                "message": "One or both teams do not exist or are not active ",
            }
        )


# Function to call insert data for each maches in the fixture
def create_matches(fixtures, match_round, tournament):
    for round_num, matches in enumerate(fixtures, start=1):
        print(f"Round {round_num} fixtures:")
        for match in matches:
            if match[0] is None or match[1] is None:
                continue
            print(f"{match[0]} vs {match[1]}")
            insert_data(match[0], match[1], match_round, tournament)


# function to fetch match data from match table
def match_fixture_data(tournament):
    match_statuses = active_match_status()
    matches = Matches.objects.filter(
        tournament_id=tournament, status__in=match_statuses
    )
    serializer = MatchSerializer(matches, many=True)
    return serializer


# function to fetch match data from match table by its round
def round_wise_fixture_data(tournament, match_round):
    matches = Matches.objects.filter(tournament_id=tournament, round=match_round)
    serializer = MatchSerializer(matches, many=True)
    return serializer


# final round match fixture
def final_round(teams, tournament):

    match_round = final()
    insert_data(teams[0], teams[1], match_round, tournament)


# funtion to change tournament status after each
def change_tournament_status(tournament, statuses):
    tournament = Tournament.objects.get(id=tournament)
    tournament.status = statuses
    tournament.save()


def validate_it_contain_team_id(final_teams):
    for team in final_teams:
        if not team:
            raise ValidationError(NO_WINNER_FOUND)


def process_tournament_fixtures(
    tournament, statuses, tournament_status, team_count, match_completed
):

    if match_completed == 0:
        raise ValidationError(
            {
                "errorCode": "6207",
                "message": "Matches in the existing round are not completed",
            }
        )

    elif team_count > 4 and tournament_status == statuses[1]:
        match_round = semi()
        team_ids = (
            PointTable.objects.filter(tournament=tournament)
            .order_by("-points", "-run_rate")
            .values_list("team_id", flat=True)[:4]
        )
        if not team_ids:
            raise ValidationError(NO_WINNER_FOUND)
        knockout_fixture(team_ids, tournament)
        fixture = round_wise_fixture_data(tournament, match_round)
        change_tournament_status(tournament.id, statuses[2])
        return fixture.data

    elif team_count <= 4 and tournament_status != statuses[3]:
        match_round = final()
        team_ids = (
            PointTable.objects.filter(tournament=tournament)
            .order_by("-points", "-run_rate")
            .values_list("team_id", flat=True)[:2]
        )
        if not team_ids:
            raise ValidationError(NO_WINNER_FOUND)
        final_round(team_ids, tournament)
        match_fixtures = round_wise_fixture_data(tournament, match_round)
        change_tournament_status(tournament.id, statuses[3])
        return match_fixtures.data

    elif tournament_status == statuses[2]:
        round2 = semi()
        match_round = final()
        final_teams = Matches.objects.filter(
            tournament=tournament, round=round2
        ).values_list("winner", flat=True)
        validate_it_contain_team_id(final_teams)

        final_round(final_teams, tournament)
        match_fixtures = round_wise_fixture_data(tournament, match_round)
        change_tournament_status(tournament.id, statuses[3])
        return match_fixtures.data


class MatchFixtureView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        try:
            statuses = tournament_active_status()
            tournament_id = request.data.get("tournamentId")
            validate_tournament_id(tournament_id)

            tournament = Tournament.objects.get(id=tournament_id, status__in=statuses)

            user = tournament.user
            if user.id != request.user.id:
                return Response(
                    {
                        "errorCode": "4603",
                        "message": "This user cannot access this details",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            teams_under_tournament = Team.objects.filter(
                tournament=tournament, status=team_status()
            )
            teams = list(teams_under_tournament.values_list("id", flat=True))
            print(teams)

            # validate the count of players in each team
            validate_team_players_count(teams)

            tournament_status = tournament.status
            team_count = len(teams_under_tournament)
            match_statuses = active_match_status()
           

            if tournament_status == statuses[0]:

                if team_count >= 3:

                    fixtures = generate_round_robin_fixture(teams)

                    match_round = round1()
                    create_matches(fixtures, match_round, tournament)

                    match_fixtures = match_fixture_data(tournament)

                    change_tournament_status(tournament.id, statuses[1])
                    return Response(match_fixtures.data)

                elif team_count == 2:
                    final_round(teams, tournament)
                    match_fixtures = match_fixture_data(tournament)

                    change_tournament_status(tournament.id, statuses[3])
                    return Response(match_fixtures.data)

                else:
                    return Response(
                        {
                            "errorCode": "6502",
                            "message": "Tournament must contain atleast 2 teams",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            elif tournament_status == statuses[1] or tournament_status == statuses[2]:
                match_ids = Matches.objects.filter(
                    tournament=tournament, status__in=match_statuses
                ).values_list("id", flat=True)
                match_completed = validate_match_status(match_ids)
                fixture = process_tournament_fixtures(
                    tournament, statuses, tournament_status, team_count, match_completed
                )
                return Response(fixture)
            else:
                raise ValidationError(
                    {"errorCode": "6200", "message": "Tournament fixture completed"}
                )

        except Tournament.DoesNotExist:
            error_message = (
                "Tournament with this id does not exist or is already inactive."
            )
            error = {"errorCode": "6504", "message": error_message}
            return Response(error, status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            error_dict = remove_square_brackets(e.message_dict)
            return Response(error_dict, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {
                    "errorCode": "4602",
                    "message": f"Something went wrong {str(e)}",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


class MatchListView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = MatchPagination

    def get(self, request):
        try:
            statuses = tournament_active_status()
            match_status = [1,2,3,4,5,6]
            tournament_id = request.query_params.get("tournamentId")
            validate_tournament(tournament_id)

            sort = request.query_params.get("sort")
            search = request.query_params.get("search")

            validate_tournament_id(tournament_id)
            tournament = Tournament.objects.get(id=tournament_id, status__in=statuses)
            print(tournament.id)
            user = tournament.user_id
            if user != request.user.id:
                return Response(
                    {
                        "errorCode": "4603",
                        "message": "This user cannot access this team details",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            match_fixtures = Matches.objects.filter(
                tournament=tournament, status__in=match_status
            ).order_by("-match_date", "-round")
            if search:
                team = Team.objects.filter(team_name__icontains=search).values_list(
                    "id"
                )
                match_fixtures = match_fixtures.filter(
                    Q(city__icontains=search)
                    | Q(opponent_one__in=team)
                    | Q(opponent_two__in=team)
                ).order_by("-match_date", "-round")
            if sort:
                if int(sort) < 10:
                    match_fixtures = match_fixtures.filter(round=sort)
                else:
                    match_fixtures.all()

            paginator = self.pagination_class()
            paginator.page_size = request.query_params.get("pageSize", 12)
            result_page = paginator.paginate_queryset(match_fixtures, request)
            serializer = MatchSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)
        except ValidationError as e:
            error_dict = remove_square_brackets(e.message_dict)
            return Response(error_dict, status=status.HTTP_400_BAD_REQUEST)
        except Tournament.DoesNotExist:
            error_message = (
                "Tournament with this id does not exist or is already inactive."
            )
            error = {"errorCode": "6504", "message": error_message}
            return Response(error, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=400)


class CoinToss(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            data = json.loads(request.body.decode("utf-8"))

            match_id = data.get("match_id")
            validate_match_id(match_id)
            toss_decision = data.get("toss_decision")
            toss_winner = data.get("toss_winner")

            validate_toss_decision(toss_decision)
            match = Matches.objects.get(
                pk=match_id, status__in=[match_status()[1], match_status()[2]]
            )

            if match.tournament.user != request.user:
                return Response(
                    {
                        "errorCode": "4603",
                        "message": "This user cannot access to perform this action",
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            validate_toss_winner(toss_winner, match)

            if match.status == match_status()[2]:
                return Response(
                    {
                        "errorCode": "6003",
                        "message": "Can't toss after the match has started",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            
            if not match.match_date or match.match_time is None:
                return Response(
                    {"errorCode": "6011", "message": "Match details must be entered."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            current_date = datetime.now().date()
            indian_timezone = pytz.timezone("Asia/Kolkata")
            current_time = datetime.now(indian_timezone).time()
           
          
          
            
            if (match.match_date >current_date) or (match.match_date == current_date and match.match_time > current_time):
                print("inise the match date")
                return Response(
                    {
                        "errorCode": "6012",
                        "message": "Can't toss before the scheduled time and date.",
                    },status= status.HTTP_400_BAD_REQUEST
                )

            match.status = 2
            match.toss_decision = toss_decision
            match.toss_winner = toss_winner
            match.save()

            return Response(
                {"message": "Toss successfully chosen."}, status=status.HTTP_200_OK
            )
       
        except json.JSONDecodeError:
            error_message = "Please provide valid JSON data."
            return Response(
                {"error": error_message, "errorCode": "7705"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except ValueError:
            return Response(
                {"errorCode": "4000", "message": "Invalid matchId provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except ValidationError as e:
            error_dict = remove_square_brackets(e.message_dict)
            return Response(error_dict, status=status.HTTP_400_BAD_REQUEST)
        except Matches.DoesNotExist:
            return Response(
                {"errorCode": "6010", "message": "Match not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception:
            return Response(
                {"message": "An unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class MatchFixtureDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, format=None):
        try:
            statuses = tournament_active_status()
            match_statuses = match_started_status()
            tournament_id = request.data.get("tournamentId")
            validate_tournament_id(tournament_id)
            tournament = Tournament.objects.get(id=tournament_id, status__in=statuses)
            user = tournament.user
            if user.id != request.user.id:
                return Response(
                    {
                        "errorCode": "4603",
                        "message": "This user is not permitted to do this action",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if tournament.status in statuses[1:4]:
                match_count = Matches.objects.filter(
                    tournament=tournament, status__in=match_statuses
                ).count()
                if match_count > 0:
                    return Response(
                        {
                            "errorCode": "9201",
                            "message": "Matches in the tournament have already started; unable to delete the fixtures",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                matches_to_update = Matches.objects.filter(
                    tournament=tournament, status=1
                )
                if matches_to_update.exists():
                    matches_to_update.update(status=0)
                    tournament.status = 1
                    tournament.save()
                    return Response({"message": "Match fixtures deleted successfully"})
                else:
                    return Response(
                        {
                            "errorCode": "9203",
                            "message": "There are no match fixtures generated to delete.",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            elif tournament.status == statuses[4]:
                return Response(
                    {
                        "errorCode": "9202",
                        "message": "Tournament has ended; unable to delete the fixtures",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:
                return Response(
                    {
                        "errorCode": "9203",
                        "message": "There are no match fixtures generated to delete.",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except ValidationError as e:
            error_dict = remove_square_brackets(e.message_dict)
            return Response(error_dict, status=status.HTTP_400_BAD_REQUEST)
        except Tournament.DoesNotExist:
            error = {
                "errorCode": "6601",
                "message": "Tournament does not exist or is inactive",
            }
            return Response(error, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(str(e))
            return Response(str(e))


class GetMatch(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            match_id = int(request.query_params["matchId"])
            if match_id == "" or match_id == None:
                return Response({"errCode": "8804", "message": " matchId not given"})
            active_status = active_match_status()
            matches = Matches.objects.get(id=match_id, status__in=active_status)
            if request.user.id != matches.tournament.user_id:
                return Response(
                    {
                        "errorCode": "8800",
                        "message": "user does not have permission to perform this action",
                    },
                    status=400,
                )
            match_id = request.query_params["matchId"]
            grounds_list = Ground.objects.all().values_list("ground_name", flat=True)

            serializer = MatchSerializer(matches)
            match_details = serializer.data
            match_details["grounds"] = grounds_list
            match_details["tournament_start"] = matches.tournament.start_date
            match_details["tournament_end"] = matches.tournament.end_date
            return Response(match_details, status=200)
        except KeyError:
            return Response({"errorCode": "8801", "message": "Invalid match id"})
        except Matches.DoesNotExist:
            return Response(
                {"errorCode": "8802", "message": "Match does not exist"}, status=400
            )
        except ValueError:
            return Response(
                {"errorCode": "8803", "message": "Invalid matchId "}, status=400
            )
        except Exception as e:
            return Response(str(e), status=400)


class MatchScheduleUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        try:
            match_id = request.data.get("matchId")
            if match_id == "" or match_id == None:
                return Response(
                    {"errCode": "7700", "message": "invalid match id"}, status=400
                )
            match = Matches.objects.get(id=match_id, status=match_is_active())
            tournament_start_date = match.tournament.start_date
            tournament_end_date = match.tournament.end_date
            if request.user.id != match.tournament.user_id:
                return Response(
                    {
                        "errorCode": "7701",
                        "message": "user does not have permission to perform this action",
                    },
                    status=400,
                )
            ground = request.data.get("ground")
            overs = request.data.get("overs")
            city = request.data.get("city")
            match_date = request.data.get("matchDate")
            match_time = request.data.get("matchTime")
            validate_ground(ground)
            validate_match_date(match_date, tournament_start_date, tournament_end_date)
            validate_city(city)
            validate_overs(overs)
            validate_match_time(match_time)
            match.ground = Ground.objects.get(ground_name=ground)
            match.number_of_overs = overs
            match.city = city
            match.match_date = match_date
            match.match_time = match_time
            match.save()

            return Response({"message": "updated successfully"}, status=200)
        except Matches.DoesNotExist:
            return Response(
                {"errCode": "7702", "message": "Match not active / has begun"},
                status=400,
            )
        except Ground.DoesNotExist:
            return Response({"errCode": "7703", "message": "Ground not found"})
        except ValidationError as e:
            return Response(remove_square_brackets(e.message_dict), status=400)
        except ValueError as e:
            if "invalid literal for int() with base 10" in str(e):
                return Response(
                    {"errCode": "7704", "message": "Overs must be a valid integer."}
                )
            return Response(
                {"errCode": "7700", "message": "invalid match id"}, status=400
            )
        except Exception as e:
            return Response(
                {
                    "errCode": "7722",
                    "message": f"please provide valid data for updation{str(e)}",
                },
                status=400,
            )

def add_players(players_mail_list,team_id,match_id):
    for mail in players_mail_list:
                player = UserData.objects.get(email=mail, status=1)
                player_id = player.id
                playing_squad_instance = PlayingSquad(
                team_id=team_id,
                match_id=match_id,
                player_id=player_id,
                status=1
                )
                playing_squad_instance.save()
def validate_players(players_list):
     for mail in players_list:

                player = UserData.objects.get(email=mail, status=1)
                player_id = player.player_id
                if Squad.objects.filter(player_id=player_id, status=1).count() == 0:
                    return Response(
                        {
                            "errorCode": "4503",
                            "message": "This player is not found in the team squad",
                        },
                        status=400,
                    )

class AddPlayingSquadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            print(1)
            team_one_id = request.data.get("teamOneId")
            team_two_id = request.data.get("teamTwoId")
            match_id = request.data.get("matchId")
            print(2)
            validate_params(team_one_id, "team One Id", "4511")
            validate_params(team_two_id, "team Two Id", "4511")
            validate_params(match_id, "matchId", "4512")
            is_valid_id(match_id, "matchId", "5113")
            is_valid_id(team_one_id, "teamId", "5114")
            
            team_one_players=request.data.get('teamOnePlayers')
            team_two_players=request.data.get('teamTwoPlayers')
            err_data={"errorCode":"6728","message":"Each team must contain excatly 11 players"}
            print(len(team_one_players),"........>")
            if team_one_players ==[] or len(team_one_players) !=11 :
            
                return Response(err_data,status=400)
            if team_two_players ==[] or len(team_two_players) !=11:
                return Response(err_data,status=400)

            match = Matches.objects.get(id=match_id, status__gte=1)
            
            
            validate_player_duplication(team_one_players)
            validate_player_duplication(team_two_players)
            validate_players(team_one_players)
            validate_players(team_two_players)
            add_players(team_two_players,team_two_id,match_id)
            add_players(team_one_players,team_one_id,match_id)     
        
            match.status = 3
            match.save()

            return Response({"message": "Players successfully added"}, status=200)
        
        except Matches.DoesNotExist:
            return Response({"errorCode": "4504", "message": "Match not found"}, status=status.HTTP_404_NOT_FOUND)
        except UserData.DoesNotExist:
            return Response({"errorCode": "4506", "message": "Player not found"}, status=status.HTTP_404_NOT_FOUND)
        except Team.DoesNotExist:
            return Response({"errorCode": "4505", "message": "Team not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except ValidationError as e:
            return Response(remove_square_brackets(e.message_dict), status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"errorCode": "1907", "message": str(e)}, status=500)


class GetSquadPlayers(APIView):
    def get(self, request):
        try:
            team_id = request.query_params.get('teamId')
            if not team_id:
                return Response({"errCode": "400", "message": "teamId parameter is missing"}, status=400)
            try:
                team = Team.objects.get(id=team_id)
                organizer_id=team.tournament.user_id
                if request.user.id !=organizer_id:
                    return Response({"errorCode":"4506","message": "You do not have access to perform this operation"})
            except Team.DoesNotExist:
                return Response({"errCode": "404", "message": "Team not found"}, status=404)

            players_list = Squad.objects.filter(team_id=team.id, status=1).values_list('player_id')
            players_set = UserData.objects.filter(player_id__in=players_list)
            serializer = UserDataSerializer(players_set, many=True)
            return Response(serializer.data, status=200)

        except Exception as e:
            return Response({"errCode": "500", "message": f"Internal server error{str(e)}"}, status=500)



class GetMatchViewScore(APIView):
  
    def get(self,request):
        try:
            match_id=int(request.query_params['matchId'])
            if match_id=="" or match_id==None:
                return Response({"errCode":"8804","message":" matchId not given"})
            active_status=[3,4,5,6]
            matches = Matches.objects.get(id=match_id,status__in=active_status)
           
            match_id=request.query_params['matchId']
            grounds_list=Ground.objects.all().values_list("ground_name",flat=True)

            serializer=MatchSerializer(matches)
            match_details=serializer.data
            
            tournament=matches.tournament
            tournament_name = tournament.tournament_name
          
            opponent_one_id=match_details["opponent_one"]
            opponent_one_team=Team.objects.get(id=opponent_one_id)
         
            opponent_two_id=match_details["opponent_two"]
            opponent_two_team=Team.objects.get(id=opponent_two_id)
            
            

            match_details["tournamet_name"]=tournament_name
            match_details["grounds"]=grounds_list
            match_details["tournament_start"]=matches.tournament.start_date
            match_details["tournament_end"]=matches.tournament.end_date
            match_details["team_one_name"]=opponent_one_team.team_name 
            match_details["team_two_name"]=opponent_two_team.team_name
            match_details["status"]=matches.status
          
            return Response(match_details,status=200)
        except KeyError:
            return Response({"errorCode":"8801","message":"Invalid match id"})
        except Matches.DoesNotExist:
            return Response({"errCode":"7777","message":"Match not active"},status=400)
        except ValueError:
            return  Response({"errorCode":"8803","message":"Invalid matchId "},status=400)
        
        
        
class GetEleven(APIView):
   def get(self, request):
       team_one_id=request.query_params.get('team1id')
       team_two_id=request.query_params.get('team2id')
       match_id=request.query_params.get('id')
       print("match_id",match_id)
       try:
          
           team_one_players_list=PlayingSquad.objects.filter(team_id=team_one_id,match_id=match_id).values_list('player_id')
           team_two_players_list=PlayingSquad.objects.filter(team_id=team_two_id,match_id=match_id).values_list('player_id')
           match = Matches.objects.get(id=match_id)
           toss_winner=match.toss_winner
           queryset1=UserData.objects.filter(id__in=team_one_players_list)
           queryset2=UserData.objects.filter(id__in=team_two_players_list)
          


           serializer1=UserDataSerializer(queryset1,many=True)
           serializer2=UserDataSerializer(queryset2,many=True)
           res_data={"teamOnePlayers":serializer1.data,"teamTwoPlayers":serializer2.data,"toss_winner":toss_winner,"toss_decision":match.toss_decision,"number_of_overs":match.number_of_overs,"match_status":match.status}
           return Response(res_data,status=200)
       except Exception as e:
           return Response({"errCode": "500", "message": f"Internal server error{str(e)}"}, status=500)



