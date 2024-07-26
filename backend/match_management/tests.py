from unittest.mock import MagicMock
from django.forms import ValidationError
from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from usermanagement.serializers import UserDataSerializer
from usermanagement.models import UserData
from tournament_management.models import Tournament
from team_management.models import Team,Squad
from .models import Ground, Matches, PointTable
from datetime import datetime, timedelta
from rest_framework.test import APIClient
from rest_framework import status
from .models import Matches, Team, PlayingSquad

from .validators import (  
    validate_overs,
    validate_city,
    validate_match_date,
    validate_match_time,
    validate_tournament,
    validate_not_null_or_empty,validate_toss_decision,validate_toss_winner,validate_match_id
)
from .util.enum import playing11_limit
current_date = datetime.now().date()
email_test='test1@example.com'
error_code= {"errorCode": "Error Code", "message": "Field is required"}
error_code_dup="Error Code"
class MatchFixtureViewTestCase(APITestCase):
    def setUp(self):
        self.user = UserData.objects.create_user(
            email="test@example.com",
            password="testpassword",
            dob="2000-01-01"
        )
        self.user2 = UserData.objects.create_user(
            email="test2@example.com",
            password="aruntestcase",
            dob="2000-01-01"
        )
        self.client.force_authenticate(user=self.user)

        self.tournament = Tournament.objects.create(
            tournament_name="Test Tournament",
            venue="Test Venue",
            ground="Test Ground",
            organizer_name="Organizer",
            organizer_contact="1234567890",
            start_date=current_date + timedelta(days=1),
            end_date=current_date + timedelta(days=7),
            tournament_category="open",
            ball_type="tennis",
            description="TestDescription",
            user=self.user
        )
        self.tournament2 = Tournament.objects.create(
            tournament_name="Test2 Tournament",
            venue="Test2 Venue",
            ground="Test2 Ground",
            organizer_name="user2",
            organizer_contact="1234567856",
            start_date=current_date + timedelta(days=1),
            end_date=current_date + timedelta(days=7),
            tournament_category="open",
            ball_type="tenniss",
            description="Test Description1",
            user=self.user2
        )
        self.PPL1 = Tournament.objects.create(
            tournament_name="PPL1",
            venue="Ernamkulam",
            ground="Kaloor",
            organizer_name="Arun",
            organizer_contact="1234567660",
            start_date=current_date + timedelta(days=1),
            end_date=current_date + timedelta(days=7),
            tournament_category="open",
            ball_type="tenniss",
            description="Nothingg",
            user=self.user
        )
        self.RRR = Tournament.objects.create(
            tournament_name="RRR",
            venue="Ernamkulam",
            ground="Kaloor",
            organizer_name="Arun",
            organizer_contact="1234567660",
            start_date=current_date + timedelta(days=1),
            end_date=current_date + timedelta(days=7),
            tournament_category="open",
            ball_type="tennis",
            description="Nothing",
            user=self.user
        )
        self.RLL = Tournament.objects.create(
            tournament_name="RLL",
            venue="Kochi",
            ground="Kaloor",
            organizer_name="Arun",
            organizer_contact="1234567660",
            start_date=current_date + timedelta(days=1),
            end_date=current_date + timedelta(days=7),
            tournament_category="open",
            ball_type="tennis",
            description="Nothing to",
            user=self.user
        )


        self.team1 = Team.objects.create(team_name="Team a", tournament=self.tournament)
        self.team2 = Team.objects.create(team_name="Team b", tournament=self.tournament)
        self.team3 = Team.objects.create(team_name="Team c", tournament=self.PPL1)
        self.team4 = Team.objects.create(team_name="Team d", tournament=self.PPL1)
        self.team5 = Team.objects.create(team_name="Team 3", tournament=self.PPL1)
        self.team6 = Team.objects.create(team_name="Team f", tournament=self.PPL1)
        self.team7 = Team.objects.create(team_name="Team g", tournament=self.PPL1)
        self.team8 = Team.objects.create(team_name="Team 8", tournament=self.PPL1)
        self.team9 = Team.objects.create(team_name="Team 9", tournament=self.RRR)
        self.team10 = Team.objects.create(team_name="Team 10", tournament=self.RRR)
        self.team11 = Team.objects.create(team_name="Team 11", tournament=self.RRR)
        self.team12 = Team.objects.create(team_name="Team 12", tournament=self.RLL)

     # Create Squad objects using a loop
        team_player_ranges = [
            (self.team1, range(101, 116)),
            (self.team2, range(201, 216)),
            (self.team3, range(301, 316)),
            (self.team4, range(401, 416)),
            (self.team5, range(501, 516)),
             (self.team6, range(601,616)),
            (self.team7, range(701, 716)),
            (self.team8, range(801, 816)),
            (self.team9, range(901, 916)),
            (self.team10, range(1001, 1016)),
            (self.team11, range(1101, 1116)),
            (self.team12, range(1201, 1216)),
        ]
        
        # Create squads for each team and player ID range
        for team, player_range in team_player_ranges:
            for player_id in player_range:
                Squad.objects.create(
                    team_id=team,
                    player_id=str(player_id),
                    status=1
                )
        
        self.valid_payload = {"tournamentId": self.tournament.id}
        self.valid_payload2 = {"tournamentId": self.PPL1.id}
        self.valid_payload1 = {"tournamentId": self.PPL1.id}
        self.valid_payload3 = {"tournamentId": self.RRR.id}
        self.valid_payload4 = {"tournamentId": self.RLL.id}
        self.invalid_payload = {"tournamentId": 999999}  # Non-existent tournament ID
        self.empty={"tournamentId":""}
        self.another_user={"tournamentId": self.tournament2.id}

        PointTable.objects.create(
            points=10,
            team_id=self.team3,
            tournament=self.PPL1,
            number_of_matches=5,
            number_of_win=3,
            number_of_losses=1,
            number_of_draws=1,
            run_rate=1.5,
            status=1,
        )
        PointTable.objects.create(
            points=20,
            team_id=self.team4,
            tournament=self.PPL1,
            number_of_matches=5,
            number_of_win=3,
            number_of_losses=1,
            number_of_draws=1,
            run_rate=1.6,
            status=1,
        )
        PointTable.objects.create(
            points=2,
            team_id=self.team5,
            tournament=self.PPL1,
            number_of_matches=5,
            number_of_win=3,
            number_of_losses=1,
            number_of_draws=1,
            run_rate=1.6,
            status=1,
        )
        PointTable.objects.create(
            points=12,
            team_id=self.team6,
            tournament=self.PPL1,
            number_of_matches=5,
            number_of_win=3,
            number_of_losses=1,
            number_of_draws=1,
            run_rate=1.6,
            status=1,
        )
        PointTable.objects.create(
            points=11,
            team_id=self.team7,
            tournament=self.PPL1,
            number_of_matches=5,
            number_of_win=3,
            number_of_losses=1,
            number_of_draws=1,
            run_rate=1.6,
            status=1,
        )
        PointTable.objects.create(
            points=18,
            team_id=self.team9,
            tournament=self.RRR,
            number_of_matches=5,
            number_of_win=3,
            number_of_losses=0,
            number_of_draws=1,
            run_rate=2.6,
            status=1,
        )
        PointTable.objects.create(
            points=19,
            team_id=self.team10,
            tournament=self.RRR,
            number_of_matches=5,
            number_of_win=3,
            number_of_losses=0,
            number_of_draws=1,
            run_rate=2.5,
            status=1,
        )


    def test_valid_match_fixture_creation(self):
        url = reverse("match_fixture")
        response = self.client.post(url, data=self.valid_payload, format="json")
        self.assertEqual(response.status_code, 200)
        
    def test_valid_match_fixture_creation_with_one_team(self):
        url = reverse("match_fixture")
        response = self.client.post(url, data=self.valid_payload4, format="json")
        self.assertEqual(response.status_code, 400)
    def test_valid_match_fixture_creation_with_morethan_4_players(self):
        url = reverse("match_fixture")
        response = self.client.post(url, data=self.valid_payload2, format="json")
        self.assertEqual(response.status_code,200)
        response = self.client.post(url, data=self.valid_payload2, format="json")

        self.assertEqual(response.status_code, 400)
    def test_valid_match_fixture_creation_with_morethan_4_players_secondtime(self):
        url = reverse("match_fixture")
        
        self.client.post(url, data=self.valid_payload2, format="json")
        match_instances = Matches.objects.filter(tournament=self.PPL1)
        # Update status for each match instance
        for match_instance in match_instances:
            match_instance.status = 6
            match_instance.save()

        updated_match_instances = Matches.objects.filter(status=6)
        self.assertEqual(updated_match_instances.count(), match_instances.count())
        self.client.post(url, data=self.valid_payload2, format="json")
        match_instances = Matches.objects.filter(tournament=self.PPL1)
                # Update status for each match instance
        for match_instance in match_instances:
                    match_instance.status = 6
                    match_instance.save()
        response = self.client.post(url, data=self.valid_payload2, format="json")
        self.assertEqual(response.status_code, 400)


    def test_valid_match_fixture_creation_with_morethan_4_players_finalround(self):
        url = reverse("match_fixture")
        self.client.post(url, data=self.valid_payload2, format="json") 
        match_instances = Matches.objects.filter(tournament=self.PPL1)
        # Update status for each match instance
        for match_instance in match_instances:
            match_instance.status = 6
            match_instance.save()

        updated_match_instances = Matches.objects.filter(status=6)
        self.assertEqual(updated_match_instances.count(), match_instances.count())
        self.client.post(url, data=self.valid_payload2, format="json")
        flag=0
        match_instance_final = Matches.objects.filter(tournament=self.PPL1,round=2)
        for match_instance in match_instance_final:
            
            if flag==0 : 
                flag=flag+1 # You might have some condition here to determine the winner
                match_instance.winner = self.team4  # Assign the winner as per your condition
            else:
                match_instance.winner = self.team7  # Assign another winner if 
            match_instance.status = 6
            match_instance.save()
        self.client.post(url, data=self.valid_payload2, format="json")
        response = self.client.post(url, data=self.valid_payload2, format="json")
        self.assertEqual(response.status_code,400)

    def test_valid_match_fixture_creation_with_3_players_secondtime(self):
        url = reverse("match_fixture")
        
        self.client.post(url, data=self.valid_payload3, format="json")
        match_instances = Matches.objects.filter(tournament=self.RRR)
        # Update status for each match instance
        for match_instance in match_instances:
            match_instance.status = 6
            match_instance.save()

        updated_match_instances = Matches.objects.filter(status=6)
        self.assertEqual(updated_match_instances.count(), match_instances.count())
        response = self.client.post(url, data=self.valid_payload3, format="json")
        self.assertEqual(response.status_code, 200)

    def test_invalid_tournament_id(self):
        url = reverse("match_fixture")
        response = self.client.post(url, data=self.invalid_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_empty_tournament_id(self):
        url = reverse("match_fixture")
        response = self.client.post(url, data=self.empty, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    def test_access_tournament_created_by_another_user(self):
        url = reverse("match_fixture")
        response = self.client.post(url, data=self.another_user, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Add more test cases to cover other scenarios such as unauthorized access, edge cases, etc.

class MatchListViewTestCase(APITestCase):
    def setUp(self):
        self.user = UserData.objects.create_user(
            email=email_test,
            password="Tester@1234",
            dob="2000-01-01"
        )
        self.client.force_authenticate(user=self.user)

        self.ABC = Tournament.objects.create(
            tournament_name="ABC",
            venue="Kochi",
            ground="Ground",
            organizer_name="Amal",
            organizer_contact="1234111890",
            start_date=current_date + timedelta(days=1),
            end_date=current_date + timedelta(days=7),
            tournament_category="open",
            ball_type="tennis",
            description="Test Description",
            user=self.user
        )
      

        self.team1 = Team.objects.create(team_name="Team aa", tournament=self.ABC)
        self.team2 = Team.objects.create(team_name="Team bb", tournament=self.ABC)
        self.team3 = Team.objects.create(team_name="Team cc", tournament=self.ABC)
        self.team4 = Team.objects.create(team_name="Team dd", tournament=self.ABC)
        self.team5 = Team.objects.create(team_name="Team ee", tournament=self.ABC)
        self.team6 = Team.objects.create(team_name="Team ff", tournament=self.ABC)
        self.team7 = Team.objects.create(team_name="Team 7", tournament=self.ABC)
        self.team8 = Team.objects.create(team_name="Team 8", tournament=self.ABC)

        self.valid_payload = {"tournamentId": self.ABC.id}
  
        self.invalid_payload = {"tournamentId": 999999}  # Non-existent tournament ID
        self.empty={"tournamentId":""}


    def test_valid_match_fixture_list_success(self):
        url = reverse("match_fixture_list")
        response = self.client.get(url, data=self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_invalid_tournament_id_fail(self):
        url = reverse("match_fixture_list")
        response = self.client.get(url, data=self.invalid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    

    def test_empty_tournament_id_fail(self):
        url = reverse("match_fixture_list")
        response = self.client.get(url, data=self.empty, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)



class CoinTossTestCase(APITestCase):

    def setUp(self):
        self.user = UserData.objects.create_user(
            email=email_test,
            password="Tester@1234",
            dob="2000-01-01"
        )
        self.XYZ = Tournament.objects.create(
            tournament_name="ABCC",
            venue="Kochi",
            ground="Ground",
            organizer_name="Amal",
            organizer_contact="1234111890",
            start_date=current_date + timedelta(days=1),
            end_date=current_date + timedelta(days=7),
            tournament_category="open",
            ball_type="tennis",
            description="Test Description",
            user=self.user
        )
       
        self.team111 = Team.objects.create(team_name="Team 1z",tournament=self.XYZ)
        self.team211= Team.objects.create(team_name="Team 2z",tournament=self.XYZ)
        self.match1 = Matches.objects.create(
            opponent_one=self.team111,
            opponent_two=self.team211,
            city='Sample Cityd',
            result='',
            status=1,
            tournament=self.XYZ
        )
        self.match66 = Matches.objects.create(
            opponent_one=self.team111,
            opponent_two=self.team211,
            city='SamplehhihCity',
            result='',
            status=1,
            tournament=self.XYZ
        )
        
      
       
       
        self.match = Matches.objects.create(status=1, opponent_one=self.team111, opponent_two=self.team211, tournament=self.XYZ)  # Assuming status 1 indicates an active match
        self.match_id = self.match66.id

    def test_valid_toss(self):
        # Send a PATCH request with valid data
        data = {
            "match_id": self.match_id,
            "toss_decision": 1,  # Assuming 'bat' is a valid toss decision
            "toss_winner": self.team111,  # Assuming 'TeamA' is a valid toss winner
            "opponent_one_id": self.team211,
            "opponent_two_id": self.team111,
            "tournament_id":self.XYZ
        }
        response = self.client.patch('/toss/', data=data)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        
        updated_match = Matches.objects.get(id=self.match_id)
        self.assertEqual(updated_match.status, 1)

    def test_invalid_match_id(self):
        # Send a PATCH request with an invalid match ID
        data = {
            "matchId": 9999,  # Assuming match ID 9999 does not exist
            "toss_decision": "bat",
            "toss_winner": self.team111,
            "opponent_one_id": self.team111,
            "opponent_two_id":self.team211,
            "tournament_id":self.XYZ
        }
        response = self.client.patch('/toss/', data=data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)




class GetMatchAPITestCase(APITestCase):
    def setUp(self):
        self.user = UserData.objects.create_user(
            email="Adarsh@example.com",
            password="adarsh@123",
            dob="2000-01-19"
      
        )
        self.client.force_authenticate(user=self.user)

        self.tournament = Tournament.objects.create(
            tournament_name="MNOP",
            venue="Chenniai",
            ground="Chennaiiy",
            organizer_name="adarsh",
            organizer_contact="1234567810",
            start_date=current_date + timedelta(days=1),
            end_date=current_date + timedelta(days=7),
            tournament_category="open",
            ball_type="tenies",
            description="TestDescriptionszz",
            user=self.user
        )
       
        self.myteam1 = Team.objects.create(team_name="myteam 4", tournament=self.tournament)
        self.myteam2 = Team.objects.create(team_name="myteam 5", tournament=self.tournament)
        self.myteam3 = Team.objects.create(team_name="myteam 6", tournament=self.tournament)
        

        self.match1 = Matches.objects.create(
            opponent_one=self.myteam1,
            opponent_two=self.myteam2,
            city='Sample Citdsy',
            result='',
            status=1,
            tournament=self.tournament
        )
   

    def test_get_match_success(self):
        url = reverse('get-match')  
        response = self.client.get(url, {'matchId': self.match1.id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)

   

    def test_get_match_invalid_match_id(self):
        self.client.force_authenticate(user=self.user)

        url = reverse('get-match')  
        response = self.client.get(url, {'matchId': 'invalid-id'})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)



    def test_get_match_not_found(self):
        self.client.force_authenticate(user=self.user)

        url = reverse('get-match') 
        response = self.client.get(url, {'matchId': 9999}) 

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class MatchScheduleUpdateViewTestCase(APITestCase):
    def setUp(self):
        self.user = UserData.objects.create_user(
            email="akhil@example.com",
            password="akhil@123",
            dob="2000-01-20"
        )
       
        self.client.force_authenticate(user=self.user)

        self.tournament = Tournament.objects.create(
            tournament_name="MNOQ",
            venue="Chenyi",
            ground="Chennassii",
            organizer_name="akhil",
            organizer_contact="1234565811",
            start_date=current_date + timedelta(days=1),
            end_date=current_date + timedelta(days=7),
            tournament_category="oppenn",
            ball_type="teniszs",
            description="TestDeszzcriptions",
            user=self.user
        )
        
       
        self.myteam1 = Team.objects.create(team_name="myteam 7", tournament=self.tournament)
        self.myteam2 = Team.objects.create(team_name="myteam 8", tournament=self.tournament)
        self.myteam3 = Team.objects.create(team_name="myteam 9", tournament=self.tournament)
     

        self.match1 = Matches.objects.create(
            id=277,
            opponent_one=self.myteam1,
            opponent_two=self.myteam2,
            city='Samplde Ccity',
            result='',
            status=1,
            tournament=self.tournament
        )
      
        Ground.objects.create(id=1,ground_name='TestGround')

    def test_update_match_success(self):
        data = {
            'matchId': 277,
            'ground': 'TestGround',
            'overs': 10,
            'city': 'Test City',
            'matchDate': str(current_date + timedelta(days=2)), 
            'matchTime': '14:00', 
        }


        url = reverse('match-update')  
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class MatchFixtureDeleteTestCase(APITestCase):
    def setUp(self):
        self.user = UserData.objects.create_user(
            email="Asif@example.com",
            password="Asifmnnnn0",
            dob="2000-01-18"
        )
        self.user2 = UserData.objects.create_user(
            email="Asif2@example.com",
            password="Asif@mnnnn9",
            dob="2000-01-09"
        )
        self.client.force_authenticate(user=self.user)

        self.tournament = Tournament.objects.create(
            tournament_name="MNO",
            venue="Chenni",
            ground="Chennaii",
            organizer_name="Asif",
            organizer_contact="1234567811",
            start_date=current_date + timedelta(days=1),
            end_date=current_date + timedelta(days=7),
            tournament_category="openn",
            ball_type="tenis",
            description="TestDescriptions",
            user=self.user,
            status=2
        )
        self.tournament2 = Tournament.objects.create(
            tournament_name="HGF",
            venue="BBB",
            ground="RSL",
            organizer_name="Assifnp",
            organizer_contact="1234507856",
            start_date=current_date + timedelta(days=1),
            end_date=current_date + timedelta(days=7),
            tournament_category="school",
            ball_type="leather",
            description="Test Description2",
            user=self.user2,
            status=1
        )
       
        self.myteam1 = Team.objects.create(team_name="myteam 11", tournament=self.tournament)
        self.myteam2 = Team.objects.create(team_name="myteam 22", tournament=self.tournament)
        self.myteam3 = Team.objects.create(team_name="myteam 33", tournament=self.tournament)
        self.myteam4 = Team.objects.create(team_name="myteam 44", tournament=self.tournament2)
        self.myteam5 = Team.objects.create(team_name="myteam 55", tournament=self.tournament2)

        self.match1 = Matches.objects.create(
            opponent_one=self.myteam1,
            opponent_two=self.myteam2,
            city='Sample Citxsy',
            result='',
            status=1,
            tournament=self.tournament
        )
        self.match2 = Matches.objects.create(
            opponent_one=self.myteam4,
            opponent_two=self.myteam5,
            city='Sample City2',
            result='',
            status=1,
            tournament=self.tournament2
        )

        self.valid_payload = {"tournamentId": self.tournament.id}
        self.valid_payload2 = {"tournamentId": 55}
        self.valid_payload3 = {"tournamentId":self.match2.id}
        self.valid_payload4 = {"tournamentId":100}
        self.valid_payload5 = {"tournamentId":self.tournament2.id}
        self.valid_payload6 = {"tournamentId":""}

    def test_valid_delete_success(self):
        url = reverse("match-delete-fixture")
        response = self.client.patch(url, data=self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    def test_valid_delete_fails_tournament_not_exist(self):
        url = reverse("match-delete-fixture")
        response = self.client.patch(url, data=self.valid_payload4, format="json")
        self.assertEqual(response.status_code, 400)
    def test_valid_delete_fails_invalid_user(self):
        url = reverse("match-delete-fixture")
        response = self.client.patch(url, data=self.valid_payload5, format="json")
        self.assertEqual(response.status_code, 400)
    def test_match_already_started(self):
        url = reverse("match-delete-fixture")
        self.match1.status=2
        self.tournament.status=2
        response = self.client.patch(url, data=self.valid_payload6, format="json")
        self.assertEqual(response.status_code, 400)
 





class AddPlayingSquadViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
     
        self.user = UserData.objects.create_user(
            email="Asif@example.com",
            password="Asifmnnnn0hhh",
            dob="2000-01-18",
            player_id='pl009'
        )
        self.user11 = UserData.objects.create_user(
            email=email_test,
            password="Asifmnnnn0gbn",
            dob="2000-01-18",
                        player_id='pl0010'

            
        )
        self.user12 = UserData.objects.create_user(
            email='test2@example.com',
            password="Asifmnnnn0fghn",
            dob="2000-01-18",
                        player_id='pl019'

        )
        self.user13 = UserData.objects.create_user(
            email='test3@example.com',
            password="Asifmnnnn0fgnb",
            dob="2000-01-18"
            ,            player_id='pl0090'

        )
        self.user14 = UserData.objects.create_user(
            email='test4@example.com',
            password="Asifmnnnn0fwef",
            dob="2000-01-18",
                        player_id='pl0819'

        )
      
        
        current_date = datetime.now().date()
        self.tournamentjjj = Tournament.objects.create(
            tournament_name="RLL",
            venue="Kochi",
            ground="Kaloor",
            organizer_name="Arun",
            organizer_contact="1234567660",
            start_date=current_date + timedelta(days=1),
            end_date=current_date + timedelta(days=7),
            tournament_category="open",
            ball_type="tennis",
            description="Nothing to",
            user=self.user
        )
        self.myteamjjj = Team.objects.create(team_name="myteamjjj", city="cityjjj", tournament=self.tournamentjjj)
        self.myteamjjj2 = Team.objects.create(team_name="myteamjjj2", city="cityjjj2", tournament=self.tournamentjjj)
        Squad.objects.create(player_id=self.user11.player_id,team_id=self.myteamjjj)
        Squad.objects.create(player_id=self.user12.player_id,team_id=self.myteamjjj)
        Squad.objects.create(player_id=self.user13.player_id,team_id=self.myteamjjj2)
        Squad.objects.create(player_id=self.user14.player_id,team_id=self.myteamjjj2)



        self.matchjjj = Matches.objects.create(
            opponent_one=self.myteamjjj,
            opponent_two=self.myteamjjj2,
            city='Sample City',
            result='',
            status=1,
            toss_winner=2,
            toss_decision=1,
            tournament=self.tournamentjjj
        )
        self.client.force_authenticate(user=self.user)
  

    def test_add_playing_squad_success(self):
        url = reverse('add-playing-squad')
        data = {'teamOneId': self.myteamjjj.id, 'teamTwoId':self.myteamjjj2.id,'matchId': self.matchjjj.id, 'teamOnePlayers': [email_test, 'test2@example.com'],'teamTwoPlayers': ['test3@example.com', 'test4@example.com']}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code,400)
        
        

    def test_add_playing_squad_duplicate_players(self):
        url = reverse('add-playing-squad')
        data = {'teamId': self.myteamjjj.id, 'matchId': self.matchjjj.id, 'email': [email_test, 'testz1@example.com']}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)




class GetMatchViewScoreTestCase(APITestCase):
    def setUp(self):
        self.user = UserData.objects.create_user(
            email="Amal@example.com",
            password="Amal@123",
            dob="2000-11-10"
      
        )

        self.tournamentt = Tournament.objects.create(
            tournament_name="MNOP",
            venue="Chenniais",
            ground="Chennaiis",
            organizer_name="Amal",
            organizer_contact="1235567810",
            start_date=current_date + timedelta(days=1),
            end_date=current_date + timedelta(days=7),
            tournament_category="opeen",
            ball_type="teniies",
            description="TestDescriptionszzy",
            user=self.user
        )
       
        self.myteam22 = Team.objects.create(team_name="myteam 22", tournament=self.tournamentt)
        self.myteam33 = Team.objects.create(team_name="myteam 33", tournament=self.tournamentt)
        self.myteam44 = Team.objects.create(team_name="myteam 44", tournament=self.tournamentt)
        

        self.match1 = Matches.objects.create(
            opponent_one=self.myteam22,
            opponent_two=self.myteam33,
            city='Sample Citdsy',
            result='',
            status=4,
            tournament=self.tournamentt
        )
   

    def test_get_match_successs(self):
        url = reverse('get-match-score')  
        response = self.client.get(url, {'matchId': self.match1.id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)

   
class GetSquadPlayersTestCase(APITestCase):
    def setUp(self):
        # Create a user
        self.user = UserData.objects.create_user(  email='test30@example.com',
            password="Asifumnnnn0fgnb",
            dob="2000-01-18")

        # Create a team
        self.tournament = Tournament.objects.create(
            tournament_name="sdRLL",
            venue="Koffchi",
            ground="Kaloorasdf",
            organizer_name="Aasdfrun",
            organizer_contact="12d4567660",
            start_date=current_date + timedelta(days=1),
            end_date=current_date + timedelta(days=7),
            tournament_category="open",
            ball_type="tennis",
            description="Nothisdfsdfng to",
            user=self.user
        )
        self.team = Team.objects.create(team_name='Test Team', tournament_id=self.tournament.id)

        # Create some players and squads
        self.player1 = UserData.objects.create(email='test31@example.com',
            password="Asifumnnnn0fgnb1",
            dob="2001-01-18",player_id='PL002')
        self.player2 = UserData.objects.create(email='test32@example.com',
            password="Asifumnnnn0fgnb2",
            dob="2000-01-19",player_id='Pl0303')
        Squad.objects.create(player_id=self.player1.player_id,team_id=self.team)
        Squad.objects.create(player_id=self.player2.player_id,team_id=self.team)

    def test_get_squad_players(self):
        self.client.force_login(self.user)

        url = reverse('get-squad')
        response = self.client.get(url, {'teamId': self.team.id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_get_squad_players_missing_team_id(self):
        self.client.force_login(self.user)

        url = reverse('get-squad')
        response = self.client.get(url,{'teamId':''})
        self.assertEqual(response.status_code,400)


    def test_get_squad_players_invalid_team_id(self):
        self.client.force_login(self.user)

        url = reverse('get-squad')
        response = self.client.get(url, {'teamId': 999})  # Assuming team with ID 999 does not exist

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
class TestValidationFunctions(TestCase):
    def test_validate_not_null_or_empty(self):
        with self.assertRaises(ValidationError) as context:
            validate_not_null_or_empty(None, "Field", error_code_dup)
        self.assertEqual(context.exception.args[0], error_code)

        with self.assertRaises(ValidationError) as context:
            validate_not_null_or_empty("", "Field", error_code_dup)
        self.assertEqual(context.exception.args[0],error_code)

        self.assertIsNone(validate_not_null_or_empty("Value", "Field",error_code_dup))
    def test_value_is_none(self):
        with self.assertRaises(ValidationError) as context:
            validate_toss_decision(None)
        self.assertEqual(context.exception.args[0], {"errorCode": "6005", "message": "Toss decision is required"})

    def test_value_is_empty_string(self):
        with self.assertRaises(ValidationError) as context:
            validate_toss_decision("")
        self.assertEqual(context.exception.args[0], {"errorCode": "6005", "message": "Toss decision is required"})

    def test_value_not_in_allowed_decisions(self):
        with self.assertRaises(ValidationError) as context:
            validate_toss_decision("random_decision")
        self.assertEqual(context.exception.args[0], {"errorCode": "6002", "message": "Invalid toss decision"})

    
    def test_value_is_none(self):
        match = MagicMock()
        with self.assertRaises(ValidationError) as context:
            validate_toss_winner(None, match)
        self.assertEqual(context.exception.args[0], {"errorCode": "6004", "message": "Toss winner is required"})

    def test_value_is_empty_string(self):
        match = MagicMock()
        with self.assertRaises(ValidationError) as context:
            validate_toss_winner("", match)
        self.assertEqual(context.exception.args[0], {"errorCode": "6004", "message": "Toss winner is required"})

    def test_value_not_in_opponents(self):
        match = MagicMock()
        match.opponent_one.id = 1
        match.opponent_two.id = 2
        with self.assertRaises(ValidationError) as context:
            validate_toss_winner(3, match)
        self.assertEqual(context.exception.args[0], {"errorCode": "6001", "message": "Invalid toss winner"})

    def test_value_in_opponents(self):
        match = MagicMock()
        match.opponent_one.id = 1
        match.opponent_two.id = 2
        try:
            validate_toss_winner(1, match)
        except ValidationError:
            self.fail("validate_toss_winner() raised ValidationError unexpectedly!")
    def test_match_id_is_none(self):
        with self.assertRaises(ValidationError) as context:
            validate_match_id(None)
        self.assertEqual(context.exception.args[0], {"errorCode": "6600", "message": "Match ID is required"})

    def test_match_id_is_empty_string(self):
        with self.assertRaises(ValidationError) as context:
            validate_match_id("")
        self.assertEqual(context.exception.args[0], {"errorCode": "6600", "message": "Match ID is required"})

    def test_match_id_is_not_integer(self):
        with self.assertRaises(ValidationError) as context:
            validate_match_id("abc")
        self.assertEqual(context.exception.args[0], {"errorCode": "4000", "message": "Invalid match ID"})

    def test_match_id_is_valid_integer(self):
        try:
            validate_match_id("123")  # Change to a valid match ID
        except ValidationError:
            self.fail("validate_match_id() raised ValidationError unexpectedly!")
    def test_validate_overs(self):
        overs = "10"
        self.assertIsNone(validate_overs(overs))
        
    def test_validate_city(self):
        city = "Some City"
        self.assertIsNone(validate_city(city))
        
    def test_validate_match_date(self):
        self.assertIsNone(validate_match_date(str(current_date + timedelta(days=3)),str(current_date + timedelta(days=1)),str(current_date + timedelta(days=7))))

    def test_validate_match_time(self):
        match_time = "10:00"
        self.assertIsNone(validate_match_time(match_time))
        
    def test_validate_tournament(self):
        tournament_id = "1"
        self.assertIsNone(validate_tournament(tournament_id))
