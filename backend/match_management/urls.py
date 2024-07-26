from django.urls import path
from .views import MatchFixtureView, MatchListView,GetMatch,MatchScheduleUpdateView, CoinToss,MatchFixtureDeleteView
from .views import  AddPlayingSquadView,GetSquadPlayers,GetMatchViewScore,GetEleven

urlpatterns = [
    path('match_fixture', MatchFixtureView.as_view(), name='match_fixture'),
    path('match_fixture_list', MatchListView.as_view(), name='match_fixture_list'),
    path('toss', CoinToss.as_view() , name='coin_toss'),
    path('add_playing11/',AddPlayingSquadView.as_view(), name = 'add-playing-squad'),
    path('get_match',GetMatch.as_view(),name='get-match'),
    path('update_match_schedule',MatchScheduleUpdateView.as_view(),name='match-update'),
    path('delete_match_fixture',MatchFixtureDeleteView.as_view(),name='match-delete-fixture'),
    path('get_match_score',GetMatchViewScore.as_view(),name='get-match-score'),
    path('get_squad',GetSquadPlayers.as_view(),name='get-squad'),
    path('getPlaying11',GetEleven.as_view(),name='getPlaying11')
    
    
]


