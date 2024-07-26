from rest_framework import permissions
from .models import Tournament
from rest_framework.response import Response

class IsTournamentOwner(permissions.BasePermission):
    def has_permission(self, request,view):
     
        current_user = request.user.id

        tournament_ids = request.data.get("tournament_ids", [])
        if not isinstance(tournament_ids, list):
            tournament_ids = [tournament_ids]

      
        for tournament_id in tournament_ids:
            try:
                tournament_id = int(tournament_id)
                tournament = Tournament.objects.get(pk=tournament_id)
                if tournament.user_id != current_user:
                    return False
            
            except (ValueError,Tournament.DoesNotExist):

                return True
        
        return True 