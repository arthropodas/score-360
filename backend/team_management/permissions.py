from rest_framework import permissions
from .models import Team
from rest_framework import status
from tournament_management.models import Tournament
from rest_framework.response import Response

tournament_not_found = {"errorCode":4110,"message":'Tournament not found'}  
team_not_found = {"errorCode":"5110","message":'Team not found'}  

from rest_framework import permissions
from .models import Tournament

class IsTournamentCreator(permissions.BasePermission):
    def has_permission(self, request, view):
        current_user_id = request.user.id
       
        tournament_id = request.query_params.get("tournamentId") or request.data.get("tournamentId")
  
    
        
        if tournament_id is None:
            return False

        try:
            tournament_id = int(tournament_id)
            tournament = Tournament.objects.get(pk=tournament_id)
          
            return tournament.user_id ==current_user_id
        except (ValueError, Tournament.DoesNotExist):
            
            return Response(
             team_not_found,
                status=status.HTTP_404_NOT_FOUND,
            )