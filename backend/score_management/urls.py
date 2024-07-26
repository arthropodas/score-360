from django.urls import path
from .views import GetCurrentScore

urlpatterns = [
    path('match_score_data', GetCurrentScore.as_view(), name='match_score_data'),
 
]


