from django.test import TestCase
from rest_framework.test import APIClient
from .models import UserData
from django.contrib.auth.hashers import make_password
from django.urls import reverse
from rest_framework import status
from unittest.mock import patch
from usermanagement.views import RegisterView
from usermanagement.serializers import UserSerializer
import jwt
from score360 import settings
from datetime import datetime, timedelta
from django.contrib.auth.hashers import check_password
from .validators import (
   validate_emails,
   validate_first_name,
   validate_last_name,
   validate_phone_number,
   validate_balling_style,
   validate_batting_style,
   validate_password,
   validate_date_of_birth,
   validate_gender
)
avani_email= "avani1@gmailcom"
pass_data="Password@2023"
mithra_mail="mithra@gmail.com"
avanis_mail="avani@gmail.com"
balling_style="Right arm pace/seam bowling"
pass_data1="newpasswordA@1"
adarsh_email='adarshvargheseaaa@gmail.com'
def generate_valid_token(self, email):
   payload = {
       "email": email,
       "exp": datetime.utcnow() + timedelta(hours=1),
   }
   return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

VALID_TOKEN='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkYXJzaHZhcmdoZXNlYWFhQGdtYWlsLmNvbSIsImV4cGlyeSI6MTc5ODk3MDEzMC4zMDY4OTZ9.tPbNlKQgC1UAyOtFo2mZCi9wHfRACNFlm8I-NZTdGqw'

class AllUserLoginTestCase(TestCase):
   def setUp(self):
       self. email = (avanis_mail,)
       self.client = APIClient()
       self.staff_user = UserData.objects.create(
           id=1,
           email=avanis_mail,
           password=make_password(pass_data),
           user_type=0,
           first_name="Avani",
           last_name="Ram",
           gender="Male",
           dob="1999-01-01",
           phone_number="9048509170",
           is_active=True,
       )


       self.login_data1 = {"email": avanis_mail, "password": pass_data}


       self.login_data2 = {"email": avanis_mail, "password": "password@20234"}
       self.login_data3 = {"email": "avan@gmail.com", "password": pass_data}


       self.login_data4 = {"email": avani_email, "password": "pass"}


       self.login_data5 = {"password": "Pass"}


       self.login_data6 = {
           "email": "avani1@gmailcom",
       }


   def test_valid_login_credentials_succes(self):
       url = reverse("user_login")
       response = self.client.post(url, self.login_data1, format="json")
       self.assertEqual(response.status_code, 200)


   def test_login_invalid_credentials_fail(self):
       url = reverse("user_login")
       response = self.client.post(url, self.login_data2, format="json")
       self.assertEqual(response.status_code, 400)


   def test_login_invalid_email_fail(self):
       url = reverse("user_login")
       response = self.client.post(url, self.login_data3, format="json")
       self.assertEqual(response.status_code, 400)


   def test_login_invalid_password_fail(self):
       url = reverse("user_login")
       response = self.client.post(url, self.login_data4, format="json")
       self.assertEqual(response.status_code, 400)


   def test_login_password_not_entered_fail(self):
       url = reverse("user_login")
       response = self.client.post(url, self.login_data5, format="json")
       self.assertEqual(response.status_code, 400)


   def test_login_email_not_entered_fail(self):
       url = reverse("user_login")
       response = self.client.post(url, self.login_data6, format="json")
       self.assertEqual(response.status_code, 400)

class EmailValidationViewTestCase(TestCase):
   def setUp(self):
       self.url = reverse("validate-email")
       self.client = APIClient()
       self.player = UserData.objects.create(
           id=1,
           email=avanis_mail,
           password=make_password(pass_data),
           user_type=0,
           first_name="Avani",
           dob="2001-01-09",
           gender="Male",
           last_name="Ram",
           phone_number="9048509170",
           is_active=True,
       )
       self.invalid_email = {"email": "asdfsd"}
       self.empty_email = {"email": ""}
       self.valid_email = {"email": adarsh_email}


   def test_email_not_entered(self):
       response = self.client.post(self.url, self.empty_email, format="json")
       self.assertEqual(response.status_code, 400)


   def test_email_invalid(self):
       response = self.client.post(self.url, self.invalid_email, format="json")
       self.assertEqual(response.status_code, 400)


   def test_email_success(self):
       response = self.client.post(self.url, self.valid_email, format="json")
       print(response.data,'zzMMMM.M>M<<<<')
       self.assertEqual(response.status_code, 200)

class RegisterViewTestCase(TestCase):
   def setUp(self):
       self.client = APIClient()
       self.valid_email = {"email": adarsh_email}
       self.sec="Adarsh@123"


   def test_register_user_valid_token(self):
       url = reverse("register", kwargs={"token": VALID_TOKEN})
      
       data = {
           "first_name": "testuser",
           "last_name": "sdfs",
           "phone_number": "9666666666",
           "gender": "Male",
           "dob": "2000-09-01",
           "email": self.valid_email['email'],
           "batting_style": "left",
           "bowling_style":balling_style,
           "password":  self.sec
       }


       response = self.client.post(url, data, format="json")
       print(response)

   def test_register_user_invalid_datas(self):
       self.email='adarshvarghese2k@gmail.com'
       url = reverse("register", kwargs={"token": VALID_TOKEN})
      
       data = {
           "first_name": "",
           "last_name": "sdfsdb",
           "phone_number": "9666666686",
           "gender": "Male",
           "dob": "2000-09-01",
           "email": self.email,
           "batting_style": "left",
           "balling_style":balling_style,
           "password":  self.sec
       }
       response = self.client.post(url, data, format="json")

       self.assertEqual(response.status_code, 400)

   def test_register_user_invalid_token(self, ):
       token = "token"
       url = reverse("register", kwargs={"token": token})
       data = {
           "first_name": "testuser",
           "last_name": "sdfs",
           "dob": "2001-01-01",
           "gender": "Female",
           "phone_number": "9666666666",
           "email": "testuser@example.com",
           "batting_style": "left",
           "balling_style": balling_style,
           "password":  self.sec
       }
       response = self.client.post(url, data, format="json")


       self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class ForgotPasswordTestCase(TestCase):
   def setUp(self):
       self.url = reverse("email-to-resetpassword")
       self.valid_email = mithra_mail
       self.client = APIClient()
       self.regular_user = UserData.objects.create(
           id="2",
           email=mithra_mail,
           user_type="0",
           dob="2000-09-01",
           gender="Male",
           is_active=True,
           forgotpassword_token="1",
       )
       self.forgot_password_mail1 = {
           "email": mithra_mail,
       }

       self.forgot_password_mail2 = {
           "email": "mith@gmail.com",
       }
       self.forgot_password_mail3 = {
           "email": "mith123",
       }
       self.forgot_password_mail4 = {
           "email": "",
       }
       self.forgot_password_mail5 = {}


   def test_send_reset_password_email_success(self):
       data = {"email": self.valid_email}
       response = self.client.post(self.url, data, format="json")
       self.assertEqual(response.status_code, status.HTTP_200_OK)
       self.assertEqual(
           response.data["message"], "Password reset link sent successfully"
       )

   def test_invalid_email_fail(self):
       url = reverse("email-to-resetpassword")
       response = self.client.post(url, self.forgot_password_mail2, format="json")
       self.assertEqual(response.status_code, 400)

   def test_empty_email_fail(self):
       url = reverse("email-to-resetpassword")
       response = self.client.post(url, self.forgot_password_mail3, format="json")
       self.assertEqual(response.status_code, 400)


   def test_invalid_email_format_fail(self):
       url = reverse("email-to-resetpassword")
       response = self.client.post(url, self.forgot_password_mail4, format="json")
       self.assertEqual(response.status_code, 400)


   def test_if_email_not_given_fail(self):
       url = reverse("email-to-resetpassword")
       response = self.client.post(url, self.forgot_password_mail5, format="json")
       self.assertEqual(response.status_code, 400)

class LinkValidationTestCase(TestCase):

   def setUp(self):
       self.client = APIClient()
       self.forgot_password_token = generate_valid_token(self, mithra_mail)
       self.forgot_password_token_user2 = generate_valid_token(self, avanis_mail)
       self.forgot_password_token_invalid_user = generate_valid_token(
           self, "achu@gmail.com"
       )

       self.staff_user1 = UserData.objects.create(
           id=2,
           email=mithra_mail,
           dob="2000-01-02",
           gender="Female",
           is_active=True,
           forgotpassword_token=self.forgot_password_token,
       )


       self.staff_user2 = UserData.objects.create(
           id=3,
           email=avani_email,
           is_active=True,
           forgotpassword_token="1",
           dob="2000-02-02",
       )


       self.valid_token = {"token": self.forgot_password_token}

       self.valid_token_user2 = {"token": self.forgot_password_token_user2}

       self.invalid_token = {"token": "invalid_token"}

       self.invalid_token_user3 = {"token": self.forgot_password_token_invalid_user}


   def test_valid_token_success(self):
       url = reverse("link-validation")
       response = self.client.put(url, self.valid_token, format="json")
       self.assertEqual(response.status_code, 200)


   def test_token_in_used_link_fail(self):
       url = reverse("link-validation")
       response = self.client.put(url, self.valid_token_user2, format="json")
       self.assertEqual(response.status_code, 400)


   def test_invalid_token_fail(self):
       url = reverse("link-validation")
       response = self.client.put(url, self.invalid_token, format="json")
       self.assertEqual(response.status_code, 400)


   def test_invalid_token_for_invalid_user_fail(self):
       url = reverse("link-validation")
       response = self.client.put(url, self.invalid_token_user3, format="json")
       self.assertEqual(response.status_code, 400)




class ResetPasswordTestCase(TestCase):
   def setUp(self):
       self.client = APIClient()
       self.user = UserData.objects.create(
           email="example@example.com",
           password="Hashed@1password",
           dob="2003-01-01",
           gender="Female",
           user_type=0,
           is_active=True,
           forgotpassword_token="1",
       )
       self.valid_token = self.generate_valid_token(self.user.email)
       self.invalid_user_token = self.generate_valid_token("anu@gmail.com")
       self.invalid_token = "invalid_token"
       self.password="newPassword@1"
       self.valid_data = {
           "token": self.valid_token,
           "newPassword": self.password,
           "confirmPassword": self.password,
       }
       self.invalid_data = {
           "token": self.valid_token,
           "newPassword": "shortPassword@1",
           "confirmPassword": "Mismatch@77",
       }


       self.invalid_user_data = {
           "token": self.invalid_user_token,
           "newPassword": "New@1password",
           "confirmPassword": "New@1password",
       }


       self.Invalid_data_format = {
           "token": self.valid_token,
           "newPassword": "new password",
           "confirmPassword": "new password",
       }


   def generate_valid_token(self, email):
       payload = {
           "email": email,
           "exp": datetime.utcnow() + timedelta(hours=1),
       }
       return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


   def test_valid_reset_password_success(self):
       url = reverse("reset-password")
       response = self.client.put(url, self.valid_data, format="json")
       self.assertEqual(response.status_code, 200)
       self.user.refresh_from_db()
       self.assertTrue(self.user.check_password(self.password))


   def test_valid_reset_password_reuse_fail(self):
       url = reverse("reset-password")
       self.client.put(url, self.valid_data, format="json")
       response = self.client.put(url, self.valid_data, format="json")
       self.assertEqual(response.status_code, 400)
       self.user.refresh_from_db()
       self.assertTrue(self.user.check_password(self.password))

   def test_reset_password_invalid_token(self):
       url = reverse("reset-password")
       invalid_data = {
           "token": self.invalid_token,
           "newPassword": pass_data1,
           "confirmPassword": pass_data1,
       }
       response = self.client.put(url, invalid_data, format="json")


       self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
       self.assertEqual(
           response.data, {"errorCode": "1007", "message": "Token is invalid"}
       )


   def test_reset_password_invalid_data(self):
       url = reverse("reset-password")
       response = self.client.put(url, self.invalid_data, format="json")


       self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
       self.assertEqual(
           response.data,
           {"errorCode": "2010", "message": "Confirm password not matching"},
       )


   def test_reset_password_invalid_user_data(self):
       url = reverse("reset-password")
       response = self.client.put(url, self.invalid_user_data, format="json")


       self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
       self.assertEqual(
           response.data, {"errorCode": "1031", "message": "User not found"}
       )


   def test_reset_password_invalid_password_format(self):
       url = reverse("reset-password")
       response = self.client.put(url, self.Invalid_data_format, format="json")


       self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
       self.assertEqual(
           response.data, {"errorCode": "2004", "message": "Invalid password format"}
       )




class ChangePasswordTestCase(TestCase):
   def setUp(self):
       self.client = APIClient()
       self.url = reverse("change-password")
       self.user_password = "Oldpassword@1"
       self.user = UserData.objects.create(
           id=1,
           email="user@example.com",
           user_type=1,
           dob="2002-01-01",
           gender="Male",
           password=make_password(self.user_password),
       )
       


   def test_change_password_success(self):
       data = {
           "id": self.user.id,
           "currentPassword": self.user_password,
           "newPassword": pass_data1,
           "confirmPassword": pass_data1,
       }
       self.client.force_authenticate(user=self.user)
       response = self.client.put(
           self.url,
           data,
           format="json",
       )
       self.assertEqual(response.status_code, status.HTTP_200_OK)
       self.assertEqual(response.data["message"], "Password changed successfully")
       updated_user = UserData.objects.get(id=self.user.id)
       self.assertTrue(check_password(pass_data1, updated_user.password))


   def test_change_password_invalid(self):
       data = {
           "id": self.user.id,
           "currentPassword": "Wrongpassword@1",
           "newPassword": pass_data1,
           "confirmPassword": pass_data1,
       }
       self.client.force_authenticate(user=self.user)
       response = self.client.put(self.url, data, format="json")


       self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
       self.assertEqual(response.data["errorCode"], "2031")


   def test_change_password_invalid_password_format(self):
       data = {
           "id": self.user.id,
           "currentPassword": "Wrongpassword1",
           "newPassword": "newp",
           "confirmPassword": "newp",
       }
       self.client.force_authenticate(user=self.user)
       response = self.client.put(self.url, data, format="json")


       self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
       self.assertEqual(response.data["errorCode"], "2004")


   def test_change_password_mismatched_confirm_password(self):
       data = {
           "id": self.user.id,
           "currentPassword": self.user_password,
           "newPassword": pass_data1,
           "confirmPassword": "mismatched@P1",
       }
       self.client.force_authenticate(user=self.user)
       response = self.client.put(self.url, data, format="json")


       self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
       self.assertEqual(response.data["errorCode"], "2010")


   def test_change_password_current_and_newpassword_same_fail (self):
       password ='Oldpassword@1'
       data = {
           "id": 999,
           "currentPassword": password,
           "newPassword": password,
           "confirmPassword": password
       }
       self.client.force_authenticate(user=self.user)
       response = self.client.put(self.url, data, format="json")


       self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
       self.assertEqual(response.data["errorCode"], "4700")





class ValidatorsTestCase(TestCase):
   def test_validate_emails_valid(self):
       self.assertIsNone(validate_emails("test@example.com"))


   def test_validate_emails_invalid(self):
       with self.assertRaises(Exception):
           validate_emails("invalid_email")


   def test_validate_first_name_valid(self):
       self.assertEqual(validate_first_name("John"), "John")


   def test_validate_first_name_invalid(self):
       with self.assertRaises(Exception):
           validate_first_name("123")


   def test_validate_last_name_valid(self):
       self.assertEqual(validate_last_name("Doe"), "Doe")


   def test_validate_last_name_invalid(self):
       with self.assertRaises(Exception):
           validate_last_name("456")


   def test_validate_phone_number_valid(self):
       self.assertEqual(validate_phone_number("1234567890"), "1234567890")


   def test_validate_phone_number_invalid(self):
       with self.assertRaises(Exception):
           validate_phone_number("invalid_number")


   def test_validate_balling_style_valid(self):
       self.assertEqual(
           validate_balling_style(balling_style),
           balling_style,
       )


   def test_validate_balling_style_invalid(self):
       with self.assertRaises(Exception):
           validate_balling_style("Invalid Style")


   def test_validate_batting_style_valid(self):
       self.assertIsNone(validate_batting_style("right"))


   def test_validate_batting_style_invalid(self):
       with self.assertRaises(Exception):
           validate_batting_style("invalid_style")
   def test_validate_batting_style_invalids(self):
       with self.assertRaises(Exception):
           validate_batting_style("")


   def test_validate_password_valid(self):
       self.assertEqual(validate_password("Strong@123"), "Strong@123")
   def test_validate_password_invalid(self):
       with self.assertRaises(Exception):
           validate_password("")
   def test_validate_password_invalid(self):
       with self.assertRaises(Exception):
           validate_password("sdfsadf")


   def test_validate_date_of_birth_valid(self):
       dob = datetime(1990, 1, 1).date()
       self.assertEqual(validate_date_of_birth(dob), dob)


   def test_validate_date_of_birth_invalid(self):
       with self.assertRaises(Exception):
           validate_date_of_birth(datetime(2023, 1, 1).date())
   def test_validate_date_of_birth_invalids(self):
       with self.assertRaises(Exception):
           validate_date_of_birth(datetime(""))

   def test_validate_gender(self):
       with self.assertRaises(Exception):
           validate_gender("")
   def test_validate_gender_invalid(self):
       with self.assertRaises(Exception):
           validate_gender("asdf")


class UtilsTestCase(TestCase):
   def generate_valid_token(self):
       expiry_time = datetime.utcnow() + timedelta(hours=1)
       payload = {"expiry": expiry_time.timestamp()}
       return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


   def generate_expired_token(self):
       expiry_time = datetime.utcnow() - timedelta(hours=1)
       payload = {"expiry": expiry_time.timestamp()}
       return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")




       
