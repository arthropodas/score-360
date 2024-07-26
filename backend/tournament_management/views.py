from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
from datetime import datetime
from match_management.models import Matches
from team_management.models import Team
from usermanagement.models import UserData
from .validators import validate_tournament_data,validate_is_tournament_exist
from .models import Tournament
from .serializers import TournamentSerializer
from django.urls import reverse
from rest_framework.permissions import IsAuthenticated
from .permissions import IsTournamentOwner
from datetime import date
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q


current_date = datetime.now().date()
unexpected_error = "An unexpected error occured"
tournament_not_found = {"errorCode":'4110',"message":'Tournament not found'}
forbidden_error =  {"message": "You do not have permission to perform this action"}

def orders(value):
    if value == 'all':
        return [1,2,3,4,5]
    elif value == 'ongoing':
        return [2,3,4]
    elif value=='upcoming':
        return [1]
    else:
        return [5]
def remove_square_brackets(json_string):
    updated_data = {key: value[0] for key, value in json_string.items()}
    return updated_data


class TournamentPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "pageSize"
    max_page_size = 100


class TournamentCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        dummy_date = date.min
        try:
            validate_tournament_data(
                data,
                edit_mode=False,
                stored_start_date=dummy_date,
                stored_end_date=dummy_date,
            )
            self.create_tournament(data)

            return Response(
                {"success": "Tournament created successfully."},
                status=status.HTTP_200_OK,
            )
        except ValidationError as e:
            error_dict = remove_square_brackets(e.message_dict)
            return Response(error_dict, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
            str(e),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create_tournament(self, data):
        UserData.objects.get(pk=data["user_id"])
        tournament = Tournament(
            tournament_name=data["tournament_name"],
            venue=data["venue"],
            ground=data["ground"],
            organizer_name=data["organizer_name"],
            organizer_contact=data["organizer_contact"],
            start_date=data["start_date"],
            end_date=data["end_date"],
            tournament_category=data["tournament_category"],
            ball_type=data["ball_type"],
            description=data.get("description", ""),
            user=UserData.objects.get(pk=data["user_id"]),
        )

        tournament.save()




class TournamentRetrieveView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, tournament_id):
        try:
            tournament_id = int(tournament_id)
            tournament = Tournament.objects.filter(id=tournament_id, status__gte=1).first()
            statuses=[1,2,3]

            # Check if the current user has permission to access the tournament
            if tournament.user_id != request.user.id:
                return Response(
                    forbidden_error,
                    status=status.HTTP_403_FORBIDDEN,
                )
            matches=Matches.objects.filter(tournament_id=tournament_id,status__in=statuses).count()
            teams=Team.objects.filter(tournament_id=tournament_id,status=1).count()
            serializer = TournamentSerializer(tournament)
            response_data=serializer.data
            response_data['matches']=matches
            response_data['teams']=teams
            return Response(response_data, status=status.HTTP_200_OK)

        except (ValueError, Tournament.DoesNotExist):
          
            return Response(
             tournament_not_found,
                status=status.HTTP_404_NOT_FOUND,
            )
class TournamentUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        data = request.data
        try:

            
            if not data.get("tournament_id"):
                raise ValidationError(
                    {"errorCode": "4018", "message": "Tournament ID is required."}
                )
            validate_is_tournament_exist(data.get("tournament_id"))
           
            tournament = Tournament.objects.get(pk=data["tournament_id"])
              
            if request.user.id !=  tournament.user_id:
                return Response(forbidden_error,status=status.HTTP_403_FORBIDDEN)
                

            tournament = Tournament.objects.get(id=data["tournament_id"])
            stored_start_date = tournament.start_date
            stored_end_date = tournament.end_date

            validate_tournament_data(
                data,
                edit_mode=True,
                stored_start_date=stored_start_date,
                stored_end_date=stored_end_date,
            )

            self.update_tournament(tournament, data)
            return Response(
                {"success": "Tournament updated successfully."},
                status=status.HTTP_200_OK,
            )
        except Tournament.DoesNotExist:
            return Response(
                tournament_not_found,
                status=status.HTTP_404_NOT_FOUND,
            )
        except ValidationError as e:
            error_dict = remove_square_brackets(e.message_dict)
            return Response(error_dict, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response(
                {"errorCode": unexpected_error},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update_tournament(self, tournament, data):

        tournament.tournament_name = data["tournament_name"]
        tournament.venue = data["venue"]
        tournament.ground = data["ground"]
        tournament.organizer_name = data["organizer_name"]
        tournament.organizer_contact = data["organizer_contact"]
        tournament.start_date = data["start_date"]
        tournament.end_date = data["end_date"]
        tournament.tournament_category = data["tournament_category"]
        tournament.ball_type = data["ball_type"]
        tournament.description = data.get("description", "")

        tournament.save()


class TournamentDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsTournamentOwner]

    def patch(self, request):

        data = request.data

        try:
            tournament_ids = data.get("tournament_ids", [])
            tournaments = Tournament.objects.filter(id__in=tournament_ids, status__gte=1)
            if len(tournaments) != len(tournament_ids):

                raise Tournament.DoesNotExist

            tournaments.update(status=0)
            return Response(
                {"success": "tournament deleted successfully"},
                status=status.HTTP_200_OK,
            )

        except (ValueError,Tournament.DoesNotExist):
           
            return Response(tournament_not_found, status=status.HTTP_404_NOT_FOUND)
        except Exception:

            return Response(
                {"errorCode": "500", "message": unexpected_error},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class TournamentListView(APIView):
   permission_classes = [IsAuthenticated]
   pagination_class = TournamentPagination
   def get(self, request):
       uid = request.query_params.get("id")
       tournaments = Tournament.objects.filter(status__gt=0, user_id=uid).order_by('-id')
       query_params = request.query_params
       orderby=request.query_params.get('sortTerm')
       search_query = query_params.get("search", None)
       category_filter = query_params.get("category", None)
       try:
            if orderby:
                tournaments=tournaments.filter(status__in=orders(orderby))
            if search_query:
                tournaments = tournaments.filter(
                    Q(tournament_name__icontains=search_query)
                    | Q(venue__icontains=search_query)
                 )
           
            if category_filter:
                tournaments = tournaments.filter(tournament_category=category_filter)
            paginator = self.pagination_class()
            paginator.page_size = request.query_params.get("pageSize", 10)
            result_page = paginator.paginate_queryset(tournaments, request)
            serializer = TournamentSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)
       except Exception as e:
                return Response(str(e),status=500)
            
