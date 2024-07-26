from django.db import models
from usermanagement.models import UserData

class Tournament(models.Model):
    tournament_name = models.CharField(max_length=128)
    start_date = models.DateField()
    end_date = models.DateField()
    venue = models.CharField(max_length=128)
    ground = models.CharField(max_length=128)  
    organizer_name = models.CharField(max_length=128)
    organizer_contact = models.CharField(max_length=15) 
    tournament_category = models.CharField(max_length=50)
    ball_type = models.CharField(max_length=50,)
    description = models.CharField(max_length=256, blank=True)
    user = models.ForeignKey(UserData,on_delete=models.CASCADE)  
    status = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.tournament_name
    
    class Meta:
        db_table = 'tournament' 
    
        