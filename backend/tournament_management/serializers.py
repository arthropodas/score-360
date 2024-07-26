from rest_framework import serializers
from django.core.exceptions import ValidationError
from datetime import datetime
from usermanagement.models import UserData
from tournament_management.models import Tournament
from datetime import datetime
class DateSerializer(serializers.Serializer):
   def to_representation(self, value):
       if isinstance(value, str):
           value = datetime.strptime(value, "%Y-%m-%d")
       return value.strftime("%Y-%m-%d") if value else None


class TournamentSerializer(serializers.ModelSerializer):
    start_date = DateSerializer()
    end_date = DateSerializer()
    class Meta:
        model = Tournament
        fields =  "__all__"
        

   