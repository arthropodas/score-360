from django.db import models
from tournament_management.models import Tournament
from team_management.models import Team


class Ground(models.Model):
    ground_name=  models.CharField(max_length=105, blank=True)
    status = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.ground_name
    
    class Meta:
        db_table = 'ground'

class Matches(models.Model):

    opponent_one=models.ForeignKey(Team,on_delete=models.CASCADE,  related_name='matches_as_opponent_one') 
    opponent_two = models.ForeignKey(Team,on_delete=models.CASCADE, related_name='matches_as_opponent_two') 
    city = models.CharField(max_length=105,blank=True)
    ground = models.ForeignKey(Ground,on_delete=models.CASCADE, null=True, blank=True) 
    match_date=  models.DateField(null=True, blank=True)
    match_time=models.TimeField(null=True, blank= True)
    result = models.CharField(max_length=30,blank=True)
    winner = models.ForeignKey(Team,on_delete=models.CASCADE,null=True, blank=True, related_name='matches_as_winner') 
    toss_winner =  models.IntegerField(null=True,blank=True)
    toss_decision =  models.IntegerField(null=True, blank=True)
    status = models.IntegerField(default=1)
    round =models.IntegerField(default=1)
    number_of_overs= models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tournament = models.ForeignKey(Tournament,on_delete=models.CASCADE) 
    remarks = models.CharField(max_length=150, blank=True)

    def __str__(self):
        return f"Match {self.id}"

    class Meta:
        db_table = 'match_fixtures'

class PointTable(models.Model):
    points=models.IntegerField(null=True,blank=True)
    team_id = models.ForeignKey(Team,on_delete=models.CASCADE,null=True)
    tournament = models.ForeignKey(Tournament,on_delete=models.CASCADE) 
    number_of_matches = models.IntegerField(null=True, blank=True)
    number_of_win= models.IntegerField(null=True, blank=True)
    number_of_losses =models.IntegerField(null=True, blank=True)
    number_of_draws = models.IntegerField(null=True, blank=True)
    run_rate =models.FloatField(null=True,blank=True)
    status = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.id}"
    class Meta:
        db_table = 'point_table'



    
class PlayingSquad(models.Model):
    team= models.ForeignKey(Team,on_delete= models.CASCADE)
    match = models.ForeignKey(Matches,on_delete=models.CASCADE)
    player_id = models.CharField(max_length=50)
    status = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'playing_squad'