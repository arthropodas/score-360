from rest_framework import serializers
from .models import Team, Squad
class TeamSerializer(serializers.ModelSerializer):

    class Meta:
        model = Team
        fields = "__all__"

class SquadSerializer(serializers.ModelSerializer):

    class Meta:
        model = Squad
        fields ="__all__"
