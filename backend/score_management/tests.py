from django.test import TransactionTestCase
from django.urls import reverse
from channels.testing import WebsocketCommunicator

from match_management.models import Matches, PlayingSquad
from team_management.models import Team
from tournament_management.models import Tournament



# Create your tests here.
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import deliveries
from usermanagement.models import UserData
from match_management.models import Matches
from tournament_management.models import Tournament
from datetime import datetime, timedelta



from channels.testing import WebsocketCommunicator
from django.test import TransactionTestCase

from score360.asgi import application
from django.db import transaction
import jwt
import pytest
from match_management.models import Matches, Ground, PlayingSquad
from team_management.models import Team
from tournament_management.models import Tournament
from datetime import datetime, timedelta
from usermanagement.models import UserData

from score360 import settings
from .models import deliveries



current_date = datetime.now().date()


class GetCurrentScoreTestCase(TransactionTestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = UserData.objects.create(
            first_name="John",
            email="te34t@example.com",
            last_name="Doee",
            dob="2000-11-18",
        )
        self.user2 = UserData.objects.create(
            first_name="Jane",
            email="tes3577@example.com",
            last_name="Doe",
            dob="2000-09-18",
        )
        self.user3 = UserData.objects.create(
            first_name="Bowler",
            email="testooo4@example.com",
            last_name="Player",
            dob="2001-01-18",
        )

        self.tournaments = Tournament.objects.create(
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
            user=self.user1,
        )

        self.team1 = Team.objects.create(
            team_name="Team A", tournament=self.tournaments
        )
        self.team2 = Team.objects.create(
            team_name="Team B", tournament=self.tournaments
        )

        self.match = Matches.objects.create(
            opponent_one=self.team1,
            opponent_two=self.team2,
            city="Sample Citxsy",
            result="",
            status=1,
            tournament=self.tournaments,
        )

        # Create sample deliveries
        self.delivery1 = deliveries.objects.create(
            innings_no=1,
            match=self.match,
            striker=self.user1,
            non_striker=self.user2,
            bowler=self.user3,
            runs=4,
            extras=1,
            type_of_extras=1,
            status=1,
            wicket=0,
            type_of_dismissal=0,
            batting_team=self.team1,
            bowling_team=self.team2,
            over_no=2,
        )

    def test_get_current_score(self):

        match_id = self.match.id  # Set your match_id here

        url = reverse(
            "match_score_data"
        )  # Assuming your URL name is 'get_current_score'
        response = self.client.get(url, {"matchId": match_id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Add more assertions as needed

    def test_get_current_score_delivery2(self):

        self.delivery2 = deliveries.objects.create(
            innings_no=2,
            match=self.match,
            striker=self.user1,
            non_striker=self.user2,
            bowler=self.user3,
            runs=1,
            extras=0,
            type_of_extras=1,
            status=1,
            wicket=0,
            type_of_dismissal=0,
            batting_team=self.team1,
            bowling_team=self.team2,
            over_no=3,
        )

        match_id = self.match.id

        url = reverse(
            "match_score_data"
        )  # Assuming your URL name is 'get_current_score'
        response = self.client.get(url, {"matchId": match_id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)



@pytest.mark.django_db(transaction=True)
def generate_valid_token(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(hours=1),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


@pytest.mark.django_db(transaction=True)  # Maintain transaction for test case
class ConnectScoreConsumerTestCase(TransactionTestCase):
    def setUp(self):
        super().setUp()

        self.user = UserData.objects.create_user(
            email="akhil@example.com", password="akhil@123", dob="2000-01-20"
        )
        self.user_id = self.user.id

        self.user1 = UserData.objects.create(
            first_name="John",
            email="twe34t@example.com",
            last_name="Doe",
            dob="2000-11-18",
        )
        self.user2 = UserData.objects.create(
            first_name="Jane",
            email="tes3577@example.com",
            last_name="Dpoe",
            dob="2000-09-18",
        )
        self.user3 = UserData.objects.create(
            first_name="Bowler",
            email="testooo4@example.com",
            last_name="Player",
            dob="2001-01-18",
        )
        self.user4 = UserData.objects.create(
            first_name="Jolllhn",
            email="tertd34t@example.com",
            last_name="Domke",
            dob="2000-11-17",
        )
        self.user5 = UserData.objects.create(
            first_name="Jolllhnjj",
            email="tertd34t@exampleee.com",
            last_name="Dooomke",
            dob="2000-01-17",
        )

        self.tournament = Tournament.objects.create(
            tournament_name="MNOQ",
            venue="Chenyi",
            ground="Chennassii",
            organizer_name="akhil",
            organizer_contact="1234565811",
            start_date=datetime.now().date() + timedelta(days=1),
            end_date=datetime.now().date() + timedelta(days=7),
            tournament_category="open",
            ball_type="tennis",
            description="TestDescriptions",
            user=self.user,
        )
        self.myteam1 = Team.objects.create(
            team_name="myteam 7", tournament=self.tournament
        )
        self.myteam2 = Team.objects.create(
            team_name="myteam 8", tournament=self.tournament
        )
        self.myteam3 = Team.objects.create(
            team_name="myteam 3", tournament=self.tournament
        )
        self.myteam4 = Team.objects.create(
            team_name="myteam 4", tournament=self.tournament
        )

        self.ground = Ground.objects.create(ground_name="TestGround")

        self.match = Matches.objects.create(
            opponent_one=self.myteam1,
            opponent_two=self.myteam2,
            city="Sample City",
            result="",
            status=3,
            tournament=self.tournament,
            number_of_overs=10,
            ground=self.ground,
        )
        self.match2 = Matches.objects.create(
            opponent_one=self.myteam1,
            opponent_two=self.myteam2,
            city="Sample City1",
            result="",
            status=3,
            tournament=self.tournament,
            number_of_overs=10,
            ground=self.ground,
        )

        self.player1 = PlayingSquad.objects.create(
            player_id=self.user1.id, match=self.match, team=self.myteam1
        )
        self.player2 = PlayingSquad.objects.create(
            player_id=self.user2.id, match=self.match, team=self.myteam1
        )
        self.player3 = PlayingSquad.objects.create(
            player_id=self.user3.id, match=self.match, team=self.myteam2
        )
        self.player4 = PlayingSquad.objects.create(
            player_id=self.user4.id, match=self.match, team=self.myteam2
        )
        self.player_not_playing_squad = PlayingSquad.objects.create(
            player_id=self.user4.id, match=self.match2, team=self.myteam2
        )

        self.delivery1 = deliveries.objects.create(
            innings_no=1,
            match=self.match,
            striker=self.user1,
            non_striker=self.user2,
            bowler=self.user3,
            runs=0,
            extras=1,
            type_of_extras=1,
            status=1,
            wicket=0,
            type_of_dismissal=0,
            batting_team=self.myteam1,
            bowling_team=self.myteam2,
            over_no=2,
        )

        print(
            "PlayingSquad objects for team 1:",
            PlayingSquad.objects.filter(team=self.myteam1),
        )
        print(
            "PlayingSquad objects for team 2:",
            PlayingSquad.objects.filter(team=self.myteam2),
        )

    @pytest.mark.asyncio
    async def test_valid_response(self):
        access_token = generate_valid_token(self.user_id)
        communicator = WebsocketCommunicator(
            application,
            f"/score/update_score/?match_id={self.match.id}&token={access_token}",
        )
        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        # Get playing squad objects for the teams within the same transaction context
        with transaction.atomic():
            striker = self.player1
            non_striker = self.player2
            bowler = self.player3
            dismissed_by_fielder = self.player4

        self.assertIsNotNone(striker, "Striker should not be None")
        self.assertIsNotNone(non_striker, "Non-Striker should not be None")
        self.assertIsNotNone(bowler, "Bowler should not be None")
        self.assertIsNotNone(
            dismissed_by_fielder, "Dismissed by Fielder should not be None"
        )

        # Send data with invalid player IDs
        data = {
            "data": {
                "inningsNo": 1,
                "runs": 6,
                "extras": 0,
                "striker": striker.player_id,
                "nonStriker": non_striker.player_id,
                "bowlerId": bowler.player_id,
                "bowlingTeam": self.myteam2.id,
                "battingTeam": self.myteam1.id,
                "wicket": 0,
                "overNo": 2,
            },
            "type": "add_score",
        }

        await communicator.send_json_to(data)

        response = await communicator.receive_json_from()

        self.assertIn("currentOverStats", response)

        await communicator.disconnect()

    @pytest.mark.asyncio
    async def test_match_not_exist(self):

        communicator = WebsocketCommunicator(
            application,
            "/score/update_score/?match_id=200",
        )
        connected, _ = await communicator.connect()
        self.assertTrue(connected)
        self.assertIn(str("Match not found"), "Match not found")
        await communicator.disconnect()

    async def test_invalid_token(self):

        communicator = WebsocketCommunicator(
            application,
            "/score/update_score/?match_id=1&token=invalid_token",
        )
        connected, _ = await communicator.connect()
        self.assertTrue(connected)
        self.assertIn(str("Invalid token"), "Invalid token")
        await communicator.disconnect()

    async def batting_Team_id_and_bowling_teamId_not_same(self):
        access_token = generate_valid_token(self.user_id)
        communicator = WebsocketCommunicator(
            application,
            f"/score/update_score/?match_id={self.match.id}&token={access_token}",
        )
        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        # Get playing squad objects for the teams within the same transaction context
        with transaction.atomic():
            striker = self.player1
            non_striker = self.player1
            bowler = self.player3

        # Send data with invalid player IDs
        data = {
            "data": {
                "inningsNo": 1,
                "runs": 0,
                "extras": 0,
                "striker": striker.player_id,
                "nonStriker": non_striker.player_id,
                "bowlerId": bowler.player_id,
                "bowlingTeam": self.myteam1.id,
                "battingTeam": self.myteam1.id,
                "wicket": 0,
                "overNo": 2,
            },
            "type": "add_score",
        }

        await communicator.send_json_to(data)

        
        response = await communicator.receive_json_from()

        self.assertEqual(response["errorCode"], '9123')

        await communicator.disconnect()

    async def test_over_no(self):
        access_token = generate_valid_token(self.user_id)
        communicator = WebsocketCommunicator(
            application,
            f"/score/update_score/?match_id={self.match.id}&token={access_token}",
        )
        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        
        with transaction.atomic():
            striker = self.player1
            non_striker = self.player2
            bowler = self.player3

      
        data = {
            "data": {
                "inningsNo": 1,
                "runs": 0,
                "extras": 0,
                "striker": striker.player_id,
                "nonStriker": non_striker.player_id,
                "bowlerId": bowler.player_id,
                "bowlingTeam": self.myteam2.id,
                "battingTeam": self.myteam1.id,
                "wicket": 0,
            },
            "type": "add_score",
        }

        await communicator.send_json_to(data)
        response = await communicator.receive_json_from()
        self.assertEqual(response["errorCode"], "9180")

        await communicator.disconnect()


    async def test_team_same(self):
        access_token = generate_valid_token(self.user_id)
        communicator = WebsocketCommunicator(
            application,
            f"/score/update_score/?match_id={self.match.id}&token={access_token}",
        )
        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        # Get playing squad objects for the teams within the same transaction context
        with transaction.atomic():
            striker = self.player1
            non_striker = self.player2
            bowler = self.player3

        # Send data with invalid player IDs
        data = {
            "data": {
                "inningsNo": 1,
                "runs": 0,
                "extras": 0,
                "striker": striker.player_id,
                "nonStriker": non_striker.player_id,
                "bowlerId": bowler.player_id,
                "bowlingTeam": self.myteam2.id,
                "battingTeam": self.myteam2.id,
                "wicket": 0,
            },
            "type": "add_score",
        }

        await communicator.send_json_to(data)
        response = await communicator.receive_json_from()
        self.assertEqual(response["errorCode"], "9123")

        await communicator.disconnect()


    async def test_teams_not_in_match(self):
        access_token = generate_valid_token(self.user_id)
        communicator = WebsocketCommunicator(
            application,
            f"/score/update_score/?match_id={self.match.id}&token={access_token}",
        )
        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        # Get playing squad objects for the teams within the same transaction context
        with transaction.atomic():
            striker = self.player1
            non_striker = self.player2
            bowler = self.player3

        # Send data with invalid player IDs
        data = {
            "data": {
                "inningsNo": 1,
                "runs": 0,
                "extras": 0,
                "striker": striker.player_id,
                "nonStriker": non_striker.player_id,
                "bowlerId": bowler.player_id,
                "bowlingTeam": self.myteam3.id,
                "battingTeam": self.myteam4.id,
                "wicket": 0,
                "over_no":2
            },
            "type": "add_score",
        }

        await communicator.send_json_to(data)
        response = await communicator.receive_json_from()
        self.assertEqual(response["errorCode"], "9180")
        await communicator.disconnect()

    async def test_exceed_over_no(self):
        access_token = generate_valid_token(self.user_id)
        communicator = WebsocketCommunicator(
            application,
            f"/score/update_score/?match_id={self.match.id}&token={access_token}",
        )
        connected, _ = await communicator.connect()
        self.assertTrue(connected)
        data = {
            "data": {
                "inningsNo": 1,
                "runs": 0,
                "extras": 0,
                "striker":self.player1.player_id,
                "nonStriker": self.player2.player_id,
                "bowlerId": self.player3.player_id,
                "bowlingTeam": self.myteam2.id,
                "battingTeam": self.myteam1.id,
                "wicket": 0,
                "overNo":25
            },
            "type": "add_score",
        }
        await communicator.send_json_to(data)
        response = await communicator.receive_json_from()
        self.assertEqual(response["errorCode"], "9156")
        await communicator.disconnect()

    async def test_player_not_found(self):
            access_token = generate_valid_token(self.user_id)
            communicator = WebsocketCommunicator(
                application,
                f"/score/update_score/?match_id={self.match.id}&token={access_token}",
            )
            connected, _ = await communicator.connect()
            self.assertTrue(connected)
            data = {
                "data": {
                    "inningsNo": 1,
                    "runs": 0,
                    "extras": 0,
                    "striker":self.player1.player_id,
                    "nonStriker": self.player2.player_id,
                    "bowlerId": self.player3.player_id,
                    
                  
                    "battingTeam": self.myteam2.id,
                    "wicket": 0,
                    "overNo":1
                },
                "type": "add_score",
            }
            await communicator.send_json_to(data)
           
            response = await communicator.receive_json_from()
         
            self.assertEqual(response["errorCode"], "9183")
            await communicator.disconnect()


    async def test_fielder_striker_same(self):
            access_token = generate_valid_token(self.user_id)
            communicator = WebsocketCommunicator(
                application,
                f"/score/update_score/?match_id={self.match.id}&token={access_token}",
            )
            connected, _ = await communicator.connect()
            self.assertTrue(connected)
      
            data = {
                "data": {
                    "inningsNo": 1,
                    "runs": 0,
                    "extras": 0,
                    "striker": self.player1.player_id,
                    "nonStriker": self.player2.player_id,
                    "bowlerId": self.player3.player_id,
                    "bowlingTeam": self.myteam1.id,
                    "battingTeam": self.myteam2.id,
                    "wicket": 1,
                    "typeOfDismissal":2,
                    "dismissedByFielder":self.player1.player_id,
                    "overNo":2
                },
                "type": "add_score",
            }
            await communicator.send_json_to(data)
            response = await communicator.receive_json_from()
          
            self.assertEqual(response["errorCode"], "9098")

            await communicator.disconnect()

    async def test_field_non_striker_same(self):
            access_token = generate_valid_token(self.user_id)
            communicator = WebsocketCommunicator(
                application,
                f"/score/update_score/?match_id={self.match.id}&token={access_token}",
            )
            connected, _ = await communicator.connect()
            self.assertTrue(connected)
           
            data = {
                "data": {
                    "inningsNo": 1,
                    "runs": 0,
                    "extras": 0,
                    "striker": self.player1.player_id,
                    "nonStriker": self.player2.player_id,
                    "bowlerId": self.player3.player_id,
                    "bowlingTeam": self.myteam1.id,
                    "battingTeam": self.myteam2.id,
                    "wicket": 1,
                    "typeOfDismissal":2,
                    "dismissedByFielder":self.player2.player_id,
                    "overNo":2
                },
                "type": "add_score",
            }
            await communicator.send_json_to(data)
            response = await communicator.receive_json_from()
           
            self.assertEqual(response["errorCode"], "9097")

            await communicator.disconnect()

    async def test_field_non_bowler_same(self):
                access_token = generate_valid_token(self.user_id)
                communicator = WebsocketCommunicator(
                    application,
                    f"/score/update_score/?match_id={self.match.id}&token={access_token}",
                )
                connected, _ = await communicator.connect()
                self.assertTrue(connected)
               
                data = {
                    "data": {
                        "inningsNo": 1,
                        "runs": 0,
                        "extras": 0,
                        "striker": self.player1.player_id,
                        "nonStriker": self.player2.player_id,
                        "bowlerId": self.player3.player_id,
                        "bowlingTeam": self.myteam1.id,
                        "battingTeam": self.myteam2.id,
                        "wicket": 1,
                        "typeOfDismissal":2,
                        "dismissedByFielder":self.player3.player_id,
                        "overNo":2
                    },
                    "type": "add_score",
                }
                await communicator.send_json_to(data)
                response = await communicator.receive_json_from()
               
                self.assertEqual(response["errorCode"], "9099")

                await communicator.disconnect()

    async def test_fielder_striker_same(self):
                access_token = generate_valid_token(self.user_id)
                communicator = WebsocketCommunicator(
                    application,
                    f"/score/update_score/?match_id={self.match.id}&token={access_token}",
                )
                connected, _ = await communicator.connect()
                self.assertTrue(connected)
            
                data = {
                    "data": {
                        "inningsNo": 1,
                        "runs": 3,
                        "extras": 0,
                        "striker": self.player1.player_id,
                        "nonStriker": self.player2.player_id,
                        "bowlerId": self.player3.player_id,
                        "bowlingTeam": self.myteam2.id,
                        "battingTeam": self.myteam1.id,
                        "wicket": 1,
                        "typeOfDismissal":2,
                        "dismissedByFielder":self.player1.player_id,
                        "overNo":2
                    },
                    "type": "add_score",
                }
                await communicator.send_json_to(data)
                response = await communicator.receive_json_from()
               
                self.assertEqual(response["errorCode"], "9098")
                await communicator.disconnect()


    async def runs_provided_in_out(self):
                access_token = generate_valid_token(self.user_id)
                communicator = WebsocketCommunicator(
                    application,
                    f"/score/update_score/?match_id={self.match.id}&token={access_token}",
                )
                connected, _ = await communicator.connect()
                self.assertTrue(connected)
            
                data = {
                    "data": {
                        "inningsNo": 1,
                        "runs": 5,
                        "extras": 0,
                        "striker": self.player1.player_id,
                        "nonStriker": self.player2.player_id,
                        "bowlerId": self.player3.player_id,
                        "bowlingTeam": self.myteam2.id,
                        "battingTeam": self.myteam1.id,
                        "wicket": 1,
                        "typeOfDismissal":2,
                        "dismissedByFielder":self.player4.player_id,
                        "overNo":2
                    },
                    "type": "add_score",
                }
                await communicator.send_json_to(data)
                response = await communicator.receive_json_from()
                
                self.assertEqual(response["errorCode"], "9098")

                await communicator.disconnect()

    async def test_batting_team_not_in_match(self):
                    access_token = generate_valid_token(self.user_id)
                    communicator = WebsocketCommunicator(
                        application,
                        f"/score/update_score/?match_id={self.match.id}&token={access_token}",
                    )
                    connected, _ = await communicator.connect()
                    self.assertTrue(connected)
                
                    data = {
                        "data": {
                            "inningsNo": 1,
                            "runs": 5,
                            "extras": 0,
                            "striker": self.player1.player_id,
                            "nonStriker": self.player2.player_id,
                            "bowlerId": self.player3.player_id,
                            "bowlingTeam": self.myteam4.id,
                            "battingTeam": self.myteam1.id,

                            "wicket": 1,
                            "typeOfDismissal":2,
                            "dismissedByFielder":self.player4.player_id,
                            "overNo":2
                        },
                        "type": "add_score",
                    }
                    await communicator.send_json_to(data)
                    response = await communicator.receive_json_from()
                   
                    self.assertEqual(response["errorCode"], "9092")

                    await communicator.disconnect()
