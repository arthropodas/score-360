from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
from usermanagement.serializers import UserDataSerializer
from .models import Team
from tournament_management.models import Tournament
from rest_framework import status
from team_management.models import Team, Squad 
from .models import Team
from usermanagement.models import UserData
from django.core.files.uploadedfile import SimpleUploadedFile
from datetime import datetime, timedelta
from tournament_management.models import Tournament
from rest_framework.test import APIClient
from datetime import datetime, timedelta
from .models import Team, Squad
from unittest.mock import patch

current_date = datetime.now().date()

USER_EMAIL="emails@gmail.in"
MAIL="email@gmail.com"
DESCRIPTION="Test Description"
class TeamCreationAPITestCase(APITestCase):
    def setUp(self):

        self.user = UserData.objects.create_user(
            email=USER_EMAIL, password="testpassword", dob="2000-01-01"
        )
        self.maxDiff = None
        self.client.login(email=USER_EMAIL, password="testpassword")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.tournament = Tournament.objects.create(
            tournament_name="TestTournaments",
            venue="TestVenue",
            ground="TestGround",
            organizer_name="Organizer",
            organizer_contact="1234567890",
            start_date=datetime.now().date() + timedelta(days=1),
            end_date=datetime.now().date() + timedelta(days=7),
            tournament_category="open",
            ball_type="tennis",
            description="Test Descriptionss",
            user_id=str(self.user.id),
        )

        self.valid_payload = {
            "teamName": "TestTeam",
            "city": "TestCity",
            "tournamentId": str(self.tournament.id),
           
        }
        self.invalid_payload = {
            "teamName": "T",
            "city": "T",
            "tournamentId": 999999,
            "logo": SimpleUploadedFile(
                "test_image.txt", b"file_content", content_type="text/plain"
            ),
        }

    def test_valid_payload(self):
        url = reverse("team-register")
        response = self.client.post(url, data=self.valid_payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_payload(self):
        url = reverse("team-register")
        response = self.client.post(url, data=self.invalid_payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TeamListViewTestCase(APITestCase):
    def setUp(self):

        self.user = UserData.objects.create_user(
            email="emai@gmail.com", password="testpassword", dob="2000-01-01"
        )
        self.maxDiff = None
        self.client.login(email="email@rrr.in", password="testpassword")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.tournament = Tournament.objects.create(
            tournament_name="TesttTournament",
            venue="TestVenue",
            ground="TestGround",
            organizer_name="Organizer",
            organizer_contact="1234567890",
            start_date=datetime.now().date() + timedelta(days=1),
            end_date=datetime.now().date() + timedelta(days=7),
            tournament_category="open",
            ball_type="tennis",
            description="Test Descriptionss",
            user_id=str(self.user.id),
        )

        self.tournament = Tournament.objects.create(
            tournament_name="TestvTournament",
            venue="TestVenue",
            ground="TestGround",
            organizer_name="Organizer",
            organizer_contact="1234567890",
            start_date=datetime.now().date() + timedelta(days=1),
            end_date=datetime.now().date() + timedelta(days=7),
            tournament_category="open",
            ball_type="tennis",
            description="Test Description3",
            user_id=str(self.user.id),
        )

        self.team = Team.objects.create(
            team_name="TestTeam", city="TestCity", tournament=self.tournament
        )

    def test_team_list_view(self):
        url = reverse("team-list")
        response = self.client.get(url, {"tournamentId": self.tournament.id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["team_name"], "TestTeam")


class TeamDeleteTestCase(APITestCase):
    def setUp(self):

        self.user = UserData.objects.create_user(
            email="user@gmail.com", password="testpassword", dob="2000-01-01"
        )
        self.maxDiff = None
        self.client.login(email="user@gmail.com", password="testpassword")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.tournament = Tournament.objects.create(
            tournament_name="TestgTournament",
            venue="TestVenue",
            ground="TestGround",
            organizer_name="Organizer",
            organizer_contact="1234567890",
            start_date=datetime.now().date() + timedelta(days=1),
            end_date=datetime.now().date() + timedelta(days=7),
            tournament_category="open",
            ball_type="tennis",
            description="Test Description4",
            user_id=str(self.user.id),
        )

        self.team = Team.objects.create(
            team_name="teamName",
            city="delhi",
            tournament=self.tournament,
        )

    def test_valid_payload(self):

        url = reverse("team-delete")
        data = {"teamId": self.team.id}

        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_payload(self):
        data = {"teamId": 9999999999}
        url = reverse("team-delete")
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class GetTeamDataAPITestcase(TestCase):
    def setUp(self):
        self.email="user1@gmail.com"
        self.password="testPassword@1"
        self.url = reverse("get-team")
        self.client = APIClient()
        self.user = UserData.objects.create_user(
            email=self.email, password=self.password, dob="2000-01-01"
        )
        self.maxDiff = None
        self.client.login(email=self.email, password=self.password)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.tournament = Tournament.objects.create(
            tournament_name="TestjTournament",
            venue="TestVenue",
            ground="TestGround",
            organizer_name="Organizer",
            organizer_contact="1234567890",
            start_date=datetime.now().date() + timedelta(days=1),
            end_date=datetime.now().date() + timedelta(days=7),
            tournament_category="open",
            ball_type="tennis",
            description=DESCRIPTION,
            user_id=str(self.user.id),
        )
        self.team1 = Team.objects.create(
            team_name="team1", city="kkrs", tournament_id=self.tournament.id
        )

    def test_get_data_successful(self):
        response = self.client.get(self.url, {"teamId": self.team1.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_data_fails(self):
        response = self.client.get(self.url, {"teamId": 0})
        self.assertEqual(response.status_code, 404)


class UpdateTeamDataTestcase(TestCase):
    def setUp(self):
        self.url = reverse("update-team")
        self.client = APIClient()
        self.password="testpassword"
        self.user = UserData.objects.create_user(
            email=MAIL, password=self.password, dob="2000-01-05"
        )
        self.maxDiff = None
        self.client.login(email=MAIL, password=self.password)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.tournament = Tournament.objects.create(
            tournament_name="TestiTournament",
            venue="TesttVenue",
            ground="TesttGround",
            organizer_name="Organizer",
            organizer_contact="1234567890",
            start_date=datetime.now().date() + timedelta(days=1),
            end_date=datetime.now().date() + timedelta(days=7),
            tournament_category="opens",
            ball_type="tenniss",
            description=DESCRIPTION,
            user_id=str(self.user.id),
        )
        self.team1 = Team.objects.create(
            team_name="team1", city="kkrs", tournament_id=self.tournament.id
        )

    def test_update_team_with_valid_data(self):
        valid_data = {
            "teamName": "TestTeamss",
            "city": "TestCityz",
            "tournamentId": str(self.tournament.id),
        }
        
        response = self.client.patch(
            self.url + f"?teamId={self.team1.id}", valid_data
        )
        
      
        self.assertEqual(response.status_code, 200)


class SquadViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserData.objects.create_user(
            player_id='102',
            first_name='Johnsk',
            last_name='Doee',
            email=MAIL,
            phone_number='9934567800',
            status=1,
            dob="2000-01-03"
        )
        self.user3 = UserData.objects.create_user(
            player_id='104',
            first_name='Amal',
            last_name='Doe',
            email="user3email@gmail.com",
            phone_number='1234567220',
            status=1,
            dob="2000-01-08"
        )
       
        
        self.client.login(email=MAIL, password="testpassword")
        self.client.force_authenticate(user=self.user)

        
        self.tournament = Tournament.objects.create(
            tournament_name="TesotTournament",
            venue="TestVenue",
            ground="TestGround",
            organizer_name="Organizer",
            organizer_contact="1234567890",
            start_date=datetime.now().date() + timedelta(days=1),
            end_date=datetime.now().date() + timedelta(days=7),
            tournament_category="open",
            ball_type="tennis",
            description=DESCRIPTION,
            user_id=self.user.id,
        )
        self.tournament2 = Tournament.objects.create(
            tournament_name="TestlTournament2",
            venue="TestVenue2",
            ground="TestGround2",
            organizer_name="Organizer2",
            organizer_contact="1234567811",
            start_date=datetime.now().date() + timedelta(days=1),
            end_date=datetime.now().date() + timedelta(days=7),
            tournament_category="open",
            ball_type="tenns",
            user_id=self.user3.id,
        )
        self.team = Team.objects.create(
          
            tournament_id=self.tournament.id
        )
        self.team2 = Team.objects.create(
          
            tournament_id=self.tournament.id
        )

       
        self.team1 = Team.objects.create(
          
            tournament_id=self.tournament2.id
        )

        self.user_data = UserData.objects.create(
            player_id='101',
            first_name='Johen',
            last_name='Doe',
            email="johnemail@gmail.com",
            phone_number='1234567890',
            status=1,
            dob="2000-09-01"
        )

       
        self.team_player = Squad.objects.create(
            team_id=self.team,
            player_id='101',
            status=1
        )

    def test_get_team_players_list(self):
        url = reverse('team_players_list') 
       
        response = self.client.get(url, {'teamId': self.team.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_get_team_players_list_empty(self):
        url = reverse('team_players_list') 
       
        response = self.client.get(url, {'teamId': self.team2.id})
        self.assertEqual(response.status_code, 400)

    def test_get_team_players_list_without_team_id(self):
        url = reverse('team_players_list') 
        team_id = ''
        response = self.client.get(url, {'teamId': team_id})
       
        self.assertEqual(response.status_code,400)

        self.assertEqual(response.data["errorCode"], "4000")  

    
    def test_get_team_players_list_by_invalid_team(self):
        url = reverse('team_players_list') 
        response = self.client.get(url, {'teamId': 6})
        
        self.assertEqual(response.status_code,400)

        self.assertEqual(response.data["errorCode"], "4601")  

    def test_get_team_players_list_by_invalid_user(self):
        url = reverse('team_players_list') 

        response = self.client.get(url, {'teamId': self.team1.id})
        
        self.assertEqual(response.status_code,400)

        self.assertEqual(response.data["errorCode"], "4603")  

class DeletePlayerViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('remove_player')
        self.user = UserData.objects.create_user(
            player_id='104',
            first_name='Akshay',
            last_name='Raj',
            email="user4email@gmail.com",
            phone_number='9048506122',
            status=1,
            dob="2000-01-09",
            password="user4password"
        )
        self.user5 = UserData.objects.create_user(
            player_id='104',
            first_name='Akshaya',
            last_name='Raja',
            email="user5email@gmail.com",
            phone_number='9048566122',
            status=1,
            dob="2000-01-09",
            password="user4Password"
        )
        self.client.login(email="user4email@gmail.com", password="user4password")
        self.client.force_authenticate(user=self.user)

        self.tournament = Tournament.objects.create(
            tournament_name="TestToyurnament",
            venue="TestVnenue",
            ground="TestGrround",
            organizer_name="Organizers",
            organizer_contact="1234567890",
            start_date=datetime.now().date() + timedelta(days=1),
            end_date=datetime.now().date() + timedelta(days=7),
            tournament_category="open",
            ball_type="tennis",
            user_id=self.user.id,
        )
        self.team = Team.objects.create(
            tournament_id=self.tournament.id
        )

        self.squad = Squad.objects.create(
            team_id=self.team,
            player_id='108',
            status=1
        )

        self.tournament5 = Tournament.objects.create(
            tournament_name="TestTournamenqt5",
            venue="TestVenue5",
            ground="TestGround5",
            organizer_name="Organizer5",
            organizer_contact="1234567800",
            start_date=datetime.now().date() + timedelta(days=1),
            end_date=datetime.now().date() + timedelta(days=7),
            tournament_category="open",
            ball_type="tennis",
            user_id=self.user5.id,
        )
        self.team5 = Team.objects.create(
            tournament_id=self.tournament5.id
        )

        self.squad5 = Squad.objects.create(
            team_id=self.team5,
            player_id='108',
            status=1
        )

    @patch('team_management.views.Squad.objects.get')
    def test_delete_player_success(self, mock_get):
        mock_get.return_value = self.squad
        
        response = self.client.patch(self.url, {'playerListId': self.squad.id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"success": "Player deleted successfully"})

    @patch('team_management.views.Squad.objects.get')
    def test_delete_player_by_invalid_user(self, mock_get):
       
        response = self.client.patch(self.url, {'playerListId': self.squad5.id})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data,
            {"errorCode": "4113", "message": "This user is not permitted to do this action"}
        )

    @patch('team_management.views.Squad.objects.get')
    def test_delete_player_not_found(self, mock_get):
        mock_get.side_effect = Squad.DoesNotExist
        
        response = self.client.patch(self.url, {'playerListId': self.squad.id})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data,
            {"errorCode": "4110", "message": "Squad with this id does not exist or is already inactive."}
        )

class GetPlayersViewTest(TestCase):
    def setUp(self):
       self.client = APIClient()
       self.user = UserData.objects.create_user(
           player_id='1002',
           first_name='John',
           last_name='Doei',
           email=MAIL,
           phone_number='1234567800',
           status=1,
           dob="2000-02-01"
       )
       self.user3 = UserData.objects.create_user(
           player_id='104',
           first_name='Amal',
           last_name='Doeu',
           email="user3email@gmail.com",
           phone_number='1234567220',
           status=1,
           dob="2000-07-01"
       )
     
      
       self.client.login(email=MAIL, password="testpassword")
       self.client.force_authenticate(user=self.user)


      
       self.tournament = Tournament.objects.create(
           tournament_name="TestbTournament",
           venue="TestVenue",
           ground="TestGround",
           organizer_name="Organizer",
           organizer_contact="1234567890",
           start_date=datetime.now().date() + timedelta(days=1),
           end_date=datetime.now().date() + timedelta(days=7),
           tournament_category="open",
           ball_type="tennis",
           description=DESCRIPTION,
           user_id=self.user.id,
       )
       self.tournament2 = Tournament.objects.create(
           tournament_name="TestbTournament2",
           venue="TestVenue2",
           ground="TestGround2",
           organizer_name="Organizer2",
           organizer_contact="1234567811",
           start_date=datetime.now().date() + timedelta(days=1),
           end_date=datetime.now().date() + timedelta(days=7),
           tournament_category="opene",
           ball_type="tenns",
           user_id=self.user3.id,
       )
       self.team = Team.objects.create(
        
           tournament_id=self.tournament.id
       )


     
       self.team1 = Team.objects.create(
        
           tournament_id=self.tournament2.id
       )


       self.user_data = UserData.objects.create(
           player_id='1001',
           first_name='Johny',
           last_name='Doei',
           email="johnemail@gmail.com",
           phone_number='1234567890',
           status=1,
           dob="2001-01-01"
       )


     
       self.team_player = Squad.objects.create(
           team_id=self.team,
           player_id='101',
           status=1
       )
    def test_get_players(self):
        client = APIClient()
        url = reverse('get-players') + f'?teamId={self.team1.id}&searchTerm=MTA0'  
        response = client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
   



class AddPlayerViewTest(APITestCase):
   def setUp(self):
       self.url = reverse("add-player")
       self.client = APIClient()
       self.user = UserData.objects.create_user(
           email="Cricketer@gmail.com", password="testpasswords", dob="2000-11-01",player_id="PL1001"
       )
   
       self.client.login(email="emails@gmail.com", password="testnetpassword")
       self.client = APIClient()
       self.client.force_authenticate(user=self.user)


       self.tournament = Tournament.objects.create(
           tournament_name="TestnetTournament",
           venue="TestnetVenue",
           ground="TestnetGround",
           organizer_name="Organizersz",
           organizer_contact="1234562340",
           start_date=datetime.now().date() + timedelta(days=1),
           end_date=datetime.now().date() + timedelta(days=7),
           tournament_category="openo",
           ball_type="tenneis",
           description=DESCRIPTION,
           user_id=str(self.user.id),
       )
       self.teamx = Team.objects.create(
           team_name="team1", city="kkrs", tournament_id=self.tournament.id
       )


   def test_add_player_to_nonexistent_team(self):
       url = reverse("add-player")+'?'+"teamId=999"


       data = {"email": "john@example.com", "teamId": 9999}
       response = self.client.post(url, data)
       self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
       self.assertEqual(response.data["errorCode"], "4504")
       self.assertEqual(response.data["message"], "team not found")


   def test_add_nonexistent_player(self):
       url = reverse("add-player")+'?'+f"teamId={self.teamx.id}"


       data = {"email": "nonexistent@example.com"}


       response = self.client.post(url, data)
       self.assertEqual(response.status_code, 400)
       self.assertEqual(response.data["errorCode"], "4507")


   def test_unexpected_error_handling(self):
       url = reverse("add-player")+"?teamId="
       data = {"invalid_key": "invalid_value"} 


       response = self.client.post(url, data)
       self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
       self.assertEqual(response.data["errorCode"], "1907")
       self.assertIn("message", response.data)


   def test_add_player_successfully(self):
       url = reverse('add-player')
       data = {"email": self.user.email} 
       self.client.post(url, data, format='json', **{'QUERY_STRING': 'teamId=' + str(self.teamx.id)})
       
     
