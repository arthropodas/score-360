from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from django.test import TestCase
from rest_framework.test import APIClient
from usermanagement.models import UserData
from datetime import datetime, timedelta
from django.core.exceptions import ValidationError
from usermanagement.models import UserData
from tournament_management.models import Tournament
from tournament_management.validators import (
    validate_not_null_or_empty,
    validate_date_format,
    validate_is_user_exist,
    validate_tournament_category,
    validate_ball_type,
    validate_length,
)
from unittest.mock import patch
from .serializers import TournamentSerializer
import base64


current_date = datetime.now().date()
start_date = current_date + timedelta(days=1)


class TournamentCreateViewTestCase(APITestCase):
    def setUp(self):

        self.user = UserData.objects.create_user(
            email="emails@gmail.com", password="testpassword", dob="2000-01-01"
        )
        self.maxDiff = None
        self.client.login(email="emails@gmail.com", password="testpassword")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_create_tournament_valid_data(self):
        
        url = reverse("create-tournament")
        data = {
            "tournament_name": "Tests Tournament",
            "start_date": str(current_date),
            "end_date": str(current_date + timedelta(days=1)),
            "venue": "Tests Venue",
            "ground": "Tests Ground",
            "organizer_name": "Tests Organizer",
            "organizer_contact": "1234567890",
            "tournament_category": "open",
            "ball_type": "tennis",
            "description": "Test Descriptions",
            "user_id": str(self.user.id),
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"success": "Tournament created successfully."})

    def test_create_tournament_invalid_data(self):
        url = reverse("create-tournament")

        data = {}
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_validate_not_null_or_empty(self):

        field_name = "TestField"
        error_code = 1001
        with self.assertRaises(ValidationError) as context:
            validate_not_null_or_empty(None, field_name, error_code)
        self.assertEqual(
            context.exception.message_dict,
            {
                "errorCode": [str(error_code)],
                "message": [f"{field_name} cannot be null or empty"],
            },
        )

        with self.assertRaises(ValidationError) as context:
            validate_not_null_or_empty("", field_name, error_code)
        self.assertEqual(
            context.exception.message_dict,
            {
                "errorCode": [str(error_code)],
                "message": [f"{field_name} cannot be null or empty"],
            },
        )

    def test_validate_is_user_exist_with_non_existing_user(self):

        user_id = 2
        error_code = "1002"

        with self.assertRaises(ValidationError) as context:
            validate_is_user_exist(user_id, error_code)

        self.assertEqual(
            context.exception.message_dict,
            {"errorCode": [error_code], "message": ["No active user found"]},
        )

    def test_validate_date_format(self):

        field_name = "TestDate"
        error_code = 1003

        with self.assertRaises(ValidationError) as context:
            validate_date_format("2024--09", field_name, error_code)

        expected_message = {
            "errorCode": [str(error_code)],
            "message": [
                f"Invalid date format for {field_name}. Please provide the date in YYYY-MM-DD format."
            ],
        }
        self.assertEqual(context.exception.message_dict, expected_message)

    def test_validate_length(self):

        value = "SampleValue"
        field_name = "TestField"
        min_length = 5
        max_length = 10
        error_code = 1006

        with self.assertRaises(ValidationError) as context:
            validate_length(value, field_name, min_length, max_length, error_code)

        expected_message = {
            "errorCode": [str(error_code)],
            "message": [
                f"{field_name} must be between {min_length} and {max_length} characters"
            ],
        }
        self.assertEqual(context.exception.message_dict, expected_message)

    def test_validate_tournament_category(self):

        value = "invalid_category"
        error_code = 4024

        with self.assertRaises(ValidationError) as context:
            validate_tournament_category(value)

        expected_message = {
            "errorCode": [str(error_code)],
            "message": ["Invalid tournament category"],
        }
        self.assertEqual(context.exception.message_dict, expected_message)

    def test_validate_ball_type(self):

        value = "invalid_ball_type"
        error_code = 4025

        with self.assertRaises(ValidationError) as context:
            validate_ball_type(value)

        expected_message = {
            "errorCode": [str(error_code)],
            "message": ["Invalid ball type"],
        }
        self.assertEqual(context.exception.message_dict, expected_message)

    @patch("tournament_management.validators.validate_tournament_name")
    def test_internal_server_error(self, mock_validate_tournament_name):
        url = reverse("create-tournament")
        data = {
            "tournament_name": "Teste Tournament",
            "start_date": str(datetime.now().date()),
            "end_date": str((datetime.now() + timedelta(days=1)).date()),
            "venue": "Teste Venue",
            "ground": "Teste Ground",
            "organizer_name": "Teste Organizer",
            "organizer_contact": "1234567890",
            "tournament_category": "open",
            "ball_type": "tennis",
            "description": "Test Descriptionss",
            "id": "1",
        }

        mock_validate_tournament_name.side_effect = Exception(
            "Simulated unexpected error"
        )

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)


class TournamentUpdateViewTestCase(APITestCase):

    def setUp(self):
        self.user = UserData.objects.create_user(
            email="user@gmail.com", password="testpassword", dob="2000-09-10"
        )
        self.maxDiff = None
        self.client.login(email="email@gmail.com", password="testpassword")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.tournament = Tournament.objects.create(
            tournament_name="TestTournament",
            venue="TestVenue",
            ground="TestGround",
            organizer_name="Organizer",
            organizer_contact="1234567890",
            start_date=datetime.now().date() + timedelta(days=1),
            end_date=datetime.now().date() + timedelta(days=7),
            tournament_category="open",
            ball_type="tennis",
            description="Test Description",
            user_id=str(self.user.id),
        )

    def test_update_tournament(self):
        url = reverse("edit-tournament")
        data = {
            "tournament_id": self.tournament.id,
            "tournament_name": "TestTournament",
            "start_date": datetime.now().date() + timedelta(days=1),
            "end_date": str(
                datetime.now().date() + timedelta(days=7),
            ),
            "venue": "TestVenue",
            "ground": "TestGround",
            "organizer_name": "TestOrganizer",
            "organizer_contact": "1234567890",
            "tournament_category": "open",
            "ball_type": "tennis",
            "description": "Test Description",
            "user_id": self.user.id,
        }
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_nonexistent_tournament(self):
        url = reverse("edit-tournament")
        data = {
            "tournament_id": 9999,
        }
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TournamentRetrieveViewTest(TestCase):
    def setUp(self):

        self.user = UserData.objects.create_user(
            email="user@example.com",
            password="testpassword",
            first_name="Test",
            last_name="User",
            dob="2000-01-01",
            phone_number="1234567890",
        )

        self.tournament = Tournament.objects.create(
            tournament_name="Tester Tournament",
            start_date=current_date,
            end_date=current_date + timedelta(days=1),
            venue="Sample Venue",
            ground="Sample Ground",
            organizer_name="Sample Organizer",
            organizer_contact="1234567890",
            tournament_category="Open",
            ball_type="tennis",
            description="",
            user=self.user,
            status=1,
        )
        self.tournament1 = Tournament.objects.create(
            tournament_name="Tester1 Tournamendt",
            start_date=current_date,
            end_date=current_date + timedelta(days=1),
            venue="S1eample Venue",
            ground="S1fample Ground",
            organizer_name="Safdsmple Organizer",
            organizer_contact="1234569890",
            tournament_category="Open",
            ball_type="tennis",
            description="",
            user=self.user,
            status=3,
        )

     
        self.url = reverse("tournament-retrieve", args=[self.tournament.id])
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_retrieve_tournament(self):

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_nonexistent_tournament(self):

        nonexistent_tournament_id = self.tournament1
       
        nonexistent_url = reverse("tournament-retrieve", args=[nonexistent_tournament_id])

        response = self.client.get(nonexistent_url)
       
        self.assertEqual(response.data["errorCode"], "4110")


class TournamentDeleteViewTest(APITestCase):
    def setUp(self):

        self.user = UserData.objects.create_user(
            email="email@gmail.com", password="testpassword", dob="2000-04-01"
        )

        self.client.force_authenticate(user=self.user)

        self.tournament = Tournament.objects.create(
            tournament_name="Test Tournament",
            venue="Test Venue",
            ground="Test Ground",
            organizer_name="Test Organizer",
            organizer_contact="1231312222",
            start_date="2024-02-10",
            end_date="2024-02-15",
            tournament_category="open",
            ball_type="tennis",
            description="This is a test tournament description.",
            status=1,
            user=self.user,
        )

    def test_delete_tournament_successfully(self):

        data = {"tournament_ids": [self.tournament.id]}

        url = reverse("delete-tournament")

        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"success": "tournament deleted successfully"})

    def test_delete_nonexistent_tournament(self):
        nonexistent_tournament_id = 999999
        data = {"tournament_ids": [nonexistent_tournament_id]}
        url = reverse("delete-tournament")
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TournamentListViewTestCase(TestCase):
    def setUp(self):
        Tournament.objects.all().delete()
        self.user = UserData.objects.create_user(
            email="user1@example.com",
            password="testpassword",
            dob="2000-01-01",
            first_name="Test",
            last_name="User",
            phone_number="1234567890",
            id=1,
        )
        tournament_data = {
            "tournament_name": "Updated Tournament",
            "venue": "Updated Venue",
            "ground": "Updated Ground",
            "organizer_name": "Updated Organizer",
            "organizer_contact": "9876543210",
            "start_date": datetime.now().date(),
            "end_date": "2024-03-10",
            "tournament_category": "open",
            "ball_type": "others",
            "description": "This is an updated tournament description.",
            "user_id": self.user.id,
        }
        self.tournament1 = Tournament.objects.create(**tournament_data)

    def test_list_tournaments(self):
        client = APIClient()
        client.login(email="testuser2@example.com", password="testpassword")
        client.force_authenticate(user=self.user)
        url = reverse("tournament-list")
        response = client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_filter_tournaments_by_search(self):
        client = APIClient()
        client.login(email="testuser3@example.com", password="testpassword")
        client.force_authenticate(user=self.user)
        url = reverse("tournament-list")
        response = client.get(url, {"search": "Tournament 1"})
        self.assertEqual(response.status_code, 200)

    def test_order_tournaments(self):
        client = APIClient()
        client.login(email="testuser4@example.com", password="testpassword")
        client.force_authenticate(user=self.user)
        url = reverse("tournament-list")
        response = client.get(url, {"order": "start_date"})
        self.assertEqual(response.status_code, 200)

    def test_filter_tournaments_by_category(self):
        client = APIClient()
        client.login(email="testuser@example.com", password="testpassword")
        client.force_authenticate(user=self.user)
        url = reverse("tournament-list")
        response = client.get(url, {"tournament_category": "Open"})
        self.assertEqual(response.status_code, 200)