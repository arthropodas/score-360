from django.db import models
from usermanagement.models import UserData
from match_management.models import Matches
from team_management.models import Team



# Create your models here.

class deliveries(models.Model):
    innings_no = models.IntegerField()  # Innings number one or two  # Ball number in the over
    match = models.ForeignKey(Matches, on_delete=models.CASCADE, related_name='deliveries_as_striker')  # Match id
    striker = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='deliveries_as_striker')
    non_striker = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='deliveries_as_non_striker')
    bowler = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='deliveries_as_bowler')
    runs = models.IntegerField()  # Runs taken in the delivery
    extras = models.IntegerField(blank=True,default=0) 
    type_of_extras = models.IntegerField(blank=True, default=0,null=True)
    status = models.IntegerField(default=1) 
     # Extra run in the delivery
    wicket = models.IntegerField()  # Is it a wicket delivery
    type_of_dismissal = models.IntegerField(null=True,blank=True)
    dismissed_by_fielder =  models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='wicket_got_fielder',blank=True,null=True)
    batting_team = models.ForeignKey(Team,  on_delete=models.CASCADE, related_name='team_batting')
    bowling_team = models.ForeignKey(Team,  on_delete=models.CASCADE, related_name='team_bowling')
    over_no = models.IntegerField()
    
    class Meta:
        db_table = 'deliveries'

