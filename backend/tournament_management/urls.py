
from django.urls import path
from .views import (
    TournamentCreateView,
    TournamentRetrieveView,
    TournamentUpdateView,
    TournamentDeleteView,
    TournamentListView,
)

urlpatterns = [
    path("create/", TournamentCreateView.as_view(), name="create-tournament"),
    path(
        "get/<str:tournament_id>/",
        TournamentRetrieveView.as_view(),
        name="tournament-retrieve",
    ),
    path("edit/", TournamentUpdateView.as_view(), name="edit-tournament"),
    path("delete/", TournamentDeleteView.as_view(), name="delete-tournament"),
    path("tournaments/", TournamentListView.as_view(), name="tournament-list"),
]