from django.db import models
from tournament_management.models import Tournament
from usermanagement.models import UserData
class Team(models.Model):

    team_name= models.CharField(max_length =100 )
    city = models.CharField(max_length=100)
    logo = models.ImageField(upload_to= 'logos/',blank=True, default='Images/None/Noimg.jpg')
    status = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tournament = models.ForeignKey(Tournament,on_delete=models.CASCADE) 
     

    def __str__(self):
        return self.team_name
    
    class Meta:
        db_table = 'team'
    
    def upload_to(self,filename):
        return 'images/{filename}'.format(filename=filename)
    
class Squad(models.Model):
    team_id = models.ForeignKey(Team,on_delete= models.CASCADE)
    player_id = models.CharField(max_length=50)
    status = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'squad'
    