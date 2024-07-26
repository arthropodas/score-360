

from django.urls import re_path

from score_management.consumers import AddScoreConsumer


websocket_urlpatterns = [

re_path(r'score/update_score/$', AddScoreConsumer.as_asgi()),

]
