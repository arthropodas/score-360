from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
import os
from team_management.util.enum import squad_size,empty_check,tournament_active_status,player_list_count_check
from usermanagement.serializers import UserDataSerializer
from .validators import validate_team_data,validate_city,validate_team_name,validate_logo,validate_tournament
from .models import Team, Squad
from rest_framework.parsers import MultiPartParser, FormParser
from usermanagement.models import UserData
from tournament_management.models import Tournament
from datetime import datetime
from team_management.serializers import TeamSerializer, SquadSerializer
from rest_framework.pagination import PageNumberPagination
from .serializers import TeamSerializer
from django.db.models import Q
from .serializers import SquadSerializer
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from .permissions import IsTournamentCreator
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Team
from .serializers import TeamSerializer
from .permissions import IsTournamentCreator
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Team
from .serializers import TeamSerializer
from .permissions import IsTournamentCreator
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Team
from .serializers import TeamSerializer
from decouple import config
import base64
from .permissions import IsTournamentCreator
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Team
from .serializers import TeamSerializer
from django.db.models import Q
import binascii
from usermanagement.utils import send_email
import threading
from concurrent.futures import ThreadPoolExecutor


forbidden_error =  {"message": "You do not have permission to perform this action"}


TEAM_PLAYERLIST_EMPTY= {"errorCode": "4657", "message": "Team is empty"}
team_not_found = {"errorCode":"5110", "message":"Team not found"}
unexpected_error = "an unexpected error found"
tournament_not_found = {"errorCode":4110,"message":'Tournament not found or Tournament started'}  

def remove_square_brackets(json_string):
    updated_data = {key: value[0] for key, value in json_string.items()}
    return updated_data


class TeamCreationAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated,IsTournamentCreator]
   
    def post(self, request):
        try:
            team_name = request.POST.get("teamName")
            city = request.POST.get("city")
            tournament_id = request.POST.get("tournamentId")
            logo = request.FILES.get("logo")

            data = {
                "teamName": team_name,
                "city": city,
                "tournamentId": tournament_id,
                "logo": logo,
            }
     

            validate_team_data(data)

            if logo:
                ext = os.path.splitext(logo.name)[-1]
                timestamp = datetime.now().strftime("%Y%m%d%H%M%S%f")
                new_logo_name = f"{team_name}_{timestamp}{ext}"
                logo.name = new_logo_name
            
            tournament = Tournament.objects.get(pk=tournament_id, status=tournament_active_status())
            active_teams_count = Team.objects.filter(tournament=tournament, status=1).count()
        

            if active_teams_count >= 16:
                return Response({"errorCode": 5023,"message":'Maximum limit of 16 teams reached'}, status=status.HTTP_400_BAD_REQUEST)
            

            self.create_team(data,tournament)
            return Response(
                {"success": "Team created successfully"}, status=status.HTTP_200_OK
            )
            

        except ValidationError as e:
            error_dict = remove_square_brackets(e.message_dict)
            return Response(error_dict, status=status.HTTP_400_BAD_REQUEST)

        except (ValueError, Tournament.DoesNotExist):
          
            return Response(
                tournament_not_found,
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            return Response(
                
                {"errorCode": "1907", "errorMessage": unexpected_error},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

  
    def create_team(self, data, tournament):
        team = Team(
            team_name=data["teamName"],
            city=data["city"],
            tournament=tournament,
            logo=data["logo"],
        )
        team.save()




class GetPlayersView(APIView):
   def get(self, request):
    try:
       
       search_term = None
       if request.query_params.get("searchTerm") != None and base64.b64decode(request.query_params.get("searchTerm")) :
            decoded_bytes = base64.b64decode(request.query_params.get("searchTerm"))
            search_term = decoded_bytes.decode('utf-8')
       team_id=request.query_params.get('teamId')
       if team_id is None or not team_id.isdigit():
            return Response({"errorCode": "4501", "message": "invalid teamId"}, status=400)
       team=Team.objects.get(id=team_id)
       tournament_id=team.tournament.id
       team_list=Team.objects.filter(tournament=tournament_id).values_list('id',flat=True)
       squad_players=Squad.objects.filter(team_id__in=team_list, status=1).values_list('player_id',flat=True)
       players = UserData.objects.exclude(player_id__in=squad_players)
       if players.count()< empty_check():
            return Response({"errorCode":"4500","message":"player not found"},status=400)
       if search_term and search_term.strip() != "":
               players = players.filter(Q(player_id__icontains=search_term.strip()) | Q(first_name__icontains=search_term),status=1)
               serializer = UserDataSerializer(players, many=True)
               print(serializer.data)
               return Response(serializer.data,status=200)
       else:
           serializer=UserDataSerializer(players,many=True)
           
           return Response(serializer.data,status=200)
    except binascii.Error:
            return Response({"errorCode": "4503", "message": "Invalid searchTerm"} ,status=400) 
    except Exception as e   :
           return Response(str(e),status=400)





class AddPlayerView(APIView):
   permission_classes=[IsAuthenticated]
   def post(self, request):
       try:
           team_id=request.query_params.get("teamId")
           team=Team.objects.get(id=team_id,status=1)
           organizer_id=team.tournament.user_id
           if request.user.id !=organizer_id:
               return Response({"errorCode":"4506","message": "You do not have access to perform this operation"})
           team_list=Team.objects.filter(tournament=team.tournament).values_list("id", flat=True)
           email = request.data.get('email')
           if email==None or len(email)<1:
               return Response({"errorCode":"4505","message": "Please select a valid player"} ,status=400)
           if len(email) + Squad.objects.filter(team_id=team_id,status=1).count()> squad_size():
               return Response({"errorCode":"4507","message":"Team size has exceeded ,please review selection"},status=400)
           for mail in email:
                player = UserData.objects.get(email=mail,status=1)
                player_id = player.player_id
                if Squad.objects.filter(player_id=player_id,team_id__in=team_list, status=1):
                    return Response({"errorCode":"4501","message": "This user is already a member of a team in this tournament."},status=400)
                elif Squad.objects.filter(team_id=team_id,status=1).count()> squad_size():
                    return Response({"errorCode":"4502","message":"tean size reached limit, cannot add more players"},status=400)
                else:
                    serializer = SquadSerializer(
                    data={"team_id": team.id, "player_id": player_id,"status":1}
                    )
                if serializer.is_valid():
                   serializer.save()
                   template='playerNotification.html'
           url='/login'
           executor = ThreadPoolExecutor(max_workers=16)
           for mail in email:
               player = UserData.objects.get(email=mail,status=1)
               data={'name':player.first_name,'team':team.team_name,'tournament':team.tournament.tournament_name}
               executor.submit(send_email,mail,"Score360 notification",template,url,data)
           return Response({"message":"player successfully added"}, status=200)
       except UserData.DoesNotExist:
           return Response({"errorCode":"4503","message":"player not found"}, status=status.HTTP_404_NOT_FOUND)
       except Team.DoesNotExist:
           return Response({"errorCode":"4504","message":"team not found"}, status=status.HTTP_404_NOT_FOUND)
       except Exception  as e:
           return Response({"errorCode":"1907","message":str(e)}, status=500)



class TeamPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "pageSize"
    max_page_size = 100

class TeamListView(APIView):
    permission_classes = [IsAuthenticated,IsTournamentCreator]
    pagination_class = TeamPagination

    def get(self, request):
        tournament_id = request.query_params.get('tournamentId')

        if tournament_id is None:
            return Response(
                {"errorCode":"5111","message": "Tournament ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            tournament_id = int(tournament_id)
        except (ValueError, Tournament.DoesNotExist):
            return Response(
                team_not_found,
                status=status.HTTP_404_NOT_FOUND
            )

        try:

            teams = Team.objects.filter(status=1, tournament_id=tournament_id).order_by('-id')
            query_params = request.query_params
            search_query = query_params.get("search", None)
            ordering = query_params.get("order", None)

            if search_query:
                teams = teams.filter(team_name__icontains=search_query)

            if ordering == "ascending":
                teams = teams.order_by("team_name")
            if ordering == "descending":
                teams = teams.order_by("-team_name")

            paginator = self.pagination_class()
            paginator.page_size = request.query_params.get("pageSize", 10)
            result_page = paginator.paginate_queryset(teams, request)
            serialized_data = []

            for team in result_page:
                player_count = Squad.objects.filter(status=1, team_id=team.id).count()
                serialized_team = TeamSerializer(team).data
                serialized_team['player_count'] = player_count
                serialized_data.append(serialized_team)

            return paginator.get_paginated_response(serialized_data)

        except Exception :
            return Response(
                {"message": "An error occurred while fetching teams"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TeamDeleteView(APIView):
    permission_classes = [IsAuthenticated, ]

    def patch(self, request):
        data = request.data
        try:
            team_id = int(data.get("teamId"))
        except (TypeError, ValueError):
            return Response(
               team_not_found,
                status=status.HTTP_404_NOT_FOUND,
            )

        try:

            team = Team.objects.get(pk=team_id, status=1)

            tournament = team.tournament
            validate_tournament(tournament)

            if team.tournament.user_id != request.user.id:
                return Response(
                    forbidden_error,
                    status=status.HTTP_403_FORBIDDEN,
                )
            team.status = 0
            team.save()

            return Response({"message": "Team deleted successfully"}, status=status.HTTP_200_OK)
            
        except Team.DoesNotExist:
            return Response(
                {"errorCode": "5110", "message": "Team not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except ValidationError as e:
            return Response(remove_square_brackets(e.message_dict),status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(str(e))
            return Response(
                {"errorCode": "1907", "message": unexpected_error},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
class GetTeamView(APIView):
    permission_classes =[IsAuthenticated,]
    def get(self, request):
        try:
            team = Team.objects.get(id=request.query_params.get('teamId'),status=1)
            if team.tournament.user_id != request.user.id:
                return Response(
                    {"message": "You do not have permission to perform this action"},
                    status=status.HTTP_403_FORBIDDEN,
                )           
            serializer = TeamSerializer(team)

            return Response(serializer.data,status=200)
        except Team.DoesNotExist:
            return Response({"errorCode":"4001","message": "The specified team does not exist."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response(
                {"errorCode": "1907", "errorMessage": unexpected_error +str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
class UpdateTeamView(APIView):
    def patch(self, request):
        try:
            team_name = request.data.get('teamName')
            city = request.data.get('city')
            logo = request.FILES.get("logo")
            team_id = request.query_params.get('teamId')
            

            if not team_id:
                return Response({"errorCode":"4002","message": "Please provide a team ID."}, status=status.HTTP_400_BAD_REQUEST)
            try:
                team = Team.objects.get(id=team_id, status=1)
            except Team.DoesNotExist:
                return Response({"errorCode":"4003","message": "The specified team does not exist."},status=status.HTTP_400_BAD_REQUEST)
            validate_team_name(team_name)
            validate_city(city)
            validate_logo(logo)
            if team_name:
                team.team_name = team_name
            if city:
                team.city = city
            if logo:
                team.logo = logo
            team.save()

            return Response({"message": "Team information updated successfully."}, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response(remove_square_brackets(e.message_dict),status=400)
        except Exception as e :
            return Response( {"errorCode": "1907", "errorMessage": unexpected_error + str(e)} , 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
     
class SquadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request,format=None):
        try:
            team_id = request.query_params.get('teamId')

            if not team_id:
                return Response(
                    {"errorCode": "4000", "message": "teamId is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if the authenticated user has access to the team details
            team = Team.objects.get(id=team_id,status=tournament_active_status())
            user = team.tournament.user
            if user.id != request.user.id:
                return Response(
                    {"errorCode": "4603", "message": "This user cannot access this team details"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Retrieve team player list
            team_player_list = Squad.objects.filter(team_id=team_id, status=1)
            total_player_number = team_player_list.count()
            if total_player_number == player_list_count_check():
                return Response(
                TEAM_PLAYERLIST_EMPTY, 
                status=status.HTTP_400_BAD_REQUEST
            )
            serializer = SquadSerializer(team_player_list, many=True)
            players_data = []

            for player in serializer.data:
                player_id = player['player_id']
                player_obj = UserData.objects.get(player_id=player_id, status=1)
                player_data = {
                    "first_name": player_obj.first_name,
                    "last_name": player_obj.last_name,
                    "phone_number": player_obj.phone_number,
                    "player_id": player_obj.player_id,
                    "id": player['id']     
                }
                players_data.append(player_data)

            return Response(players_data, status=status.HTTP_200_OK)
        
        except Team.DoesNotExist:
            return Response(
                {"errorCode": "4601", "message": "Team does not exist"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        except Exception:
            return Response(
                {"errorCode": "4602", "message": "Something went wrong"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
              

class DeletePlayerView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            team_list_id = request.data.get('playerListId')
            team_list_object = Squad.objects.get(id=team_list_id, status=1)
            user = team_list_object.team_id.tournament.user
           
            if user.id != request.user.id:
                return Response(
                    {"errorCode": "4113", "message": "This user is not permitted to do this action"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
         
            team_list_object.status = 0
            team_list_object.save()
            
            return Response(
                {"success": "Player deleted successfully"}, 
                status=status.HTTP_200_OK,
            )

        except Squad.DoesNotExist:
            error_message = "Squad with this id does not exist or is already inactive."
            error = {"errorCode": "4110", "message": error_message}
            return Response(error, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response (e)
