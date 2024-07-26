from django.urls import path
from .views import TeamCreationAPIView, TeamListView, TeamDeleteView, SquadView, DeletePlayerView,GetPlayersView,AddPlayerView,GetTeamView,UpdateTeamView
from django.conf import  settings
from django.conf.urls.static import static

urlpatterns = [
    path('create/', TeamCreationAPIView.as_view(), name='team-register'),
    path("list/", TeamListView.as_view(), name="team-list"),
    path("delete/", TeamDeleteView.as_view(), name="team-delete"),
    path('get_players/',GetPlayersView.as_view() ,name="get-players"),
    path('add_player/',AddPlayerView.as_view(),name='add-player'),
    path('get_team/',GetTeamView.as_view(),name="get-team"),
    path('update_team/',UpdateTeamView.as_view(),name="update-team"),
    path("team_players_list", SquadView.as_view(), name="team_players_list"),
    path("remove_player", DeletePlayerView.as_view(), name="remove_player"),
]
