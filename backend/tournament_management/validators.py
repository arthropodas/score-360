from django.core.exceptions import ValidationError
from datetime import datetime
from usermanagement.models import UserData
from usermanagement.validators import validate_phone_number
from team_management.validators import validate_pattern
from .models import Tournament
from rest_framework import status
import re
current_date = datetime.now().date()
strip_date = '%Y-%m-%d'
tournament_not_found = {"errorCode":'4110',"message":'Tournament not found'}
ORGANIZER_NAME="Organizer name"
def validate_tournament_pattern(value, field_name, error_code):
   if not re.match(r'^(?!.*\s{2})[^\s].*[^\s]$', value):
        raise ValidationError(
            {"errorCode": error_code, "message": f"invalid {field_name}"}
        )

def validate_is_user_exist(user_id, error_code):
   try:
        UserData.objects.get(id=user_id,status=1)
   except UserData.DoesNotExist:
       data = {"errorCode": error_code, "message": "No active user found"}
       raise ValidationError(data)
   
def validate_is_tournament_exist(tournament_id):
   try:
        Tournament.objects.get(id = tournament_id,status__gte=1)
   except (ValueError,Tournament.DoesNotExist):
       data = tournament_not_found
       raise ValidationError(data)
  
def validate_not_null_or_empty(value, field_name, error_code):
 
   if value is None or value == "":
      
       data = {"errorCode": str(error_code), "message": f"{field_name} cannot be null or empty"}
       raise ValidationError(data)
  
def validate_date_format(value, field_name, error_code):
   try:
      
       datetime.strptime(str(value), strip_date)
   except ValueError:
       data = {"errorCode": error_code, "message": f"Invalid date format for {field_name}. Please provide the date in YYYY-MM-DD format."}
       raise ValidationError(data)
      
def validate_length(value, field_name, min_length, max_length, error_code):
   if not (min_length <= len(value) <= max_length):
       data = {"errorCode": error_code, "message": f"{field_name} must be between {min_length} and {max_length} characters"}
       raise ValidationError(data)


def validate_tournament_name(value):
   validate_not_null_or_empty(value, "Tournament name", 4001)
   validate_length(value, "Tournament name", 2, 100, 4013)
   validate_tournament_pattern(value,"Tourament name",'4026')


def validate_venue(value):
   validate_not_null_or_empty(value, "Venue", 4002)
   validate_length(value, "Venue", 2, 100, 4014)
   validate_tournament_pattern(value,"Venue",'4027')


def validate_ground(value):
   validate_not_null_or_empty(value, "Ground", 4003)
   validate_length(value, "Ground", 2, 100, 4015)
   validate_tournament_pattern(value,"Ground",'4028')


def validate_start_date(start_date,editmode,stored_date):
   validate_not_null_or_empty(start_date, "Start date", 4004)
   validate_date_format(start_date, "Start date", 4019)
   start_date = datetime.strptime(start_date, strip_date).date()
  
   if editmode and stored_date == start_date:
       return True
   if editmode and stored_date < current_date:
       data = {"errorCode": 4030, "message": "Start date cannot be changed after the tournament start"}
       raise ValidationError(data)


   validate_date_not_in_past(start_date, 4021,"start date")


def validate_end_date(start_date, end_date,edit_mode,stored_end_date):
   validate_not_null_or_empty(end_date, "End date", 4005)
   validate_date_format(end_date, "End date", 4020) 
   end_date = datetime.strptime(str(end_date), strip_date).date()
   start_date = datetime.strptime(str(start_date), strip_date).date()
   if(edit_mode and stored_end_date == end_date ):
       return True
   elif end_date < start_date:
           data = {"errorCode": 4023, "message": "End date less than start date"}
           raise ValidationError(data)
   validate_date_not_in_past(end_date, 4022,"end date")
      
def validate_tournament_category(value):
   validate_not_null_or_empty(value, "Tournament category", 4006)
   allowed_categories = ["open", "corporate", "school"]
   if value not in allowed_categories:
       data = {"errorCode": 4024, "message": "Invalid tournament category"}
       raise ValidationError(data)


def validate_ball_type(value):
   validate_not_null_or_empty(value, "Ball type", 4007)
   allowed_ball_types = ["tennis", "leather", "others"]
   if value.lower() not in allowed_ball_types:
       data = {"errorCode": 4025, "message": "Invalid ball type"}
       raise ValidationError(data)


def validate_description(value):
   if value is not None and value != "":
       validate_tournament_pattern(value,"Description", '4029')
           
       validate_length(value, "Description", 5, 255, 4016)
      


def validate_user_id(value):
   validate_not_null_or_empty(value,"user_id",4009)
   validate_is_user_exist(value,4010)
def validate_organizer_name(value):
   validate_not_null_or_empty(value, ORGANIZER_NAME, 4011)
   validate_length(value, ORGANIZER_NAME, 2, 100, 4017)
   validate_pattern(value,ORGANIZER_NAME,"^[a-zA-Z]+(?:[ .][a-zA-Z]+)*$",'4031')


def validate_organizer_contact(value):
   validate_not_null_or_empty(value, "Organizer contact", 4012)
   if not re.match("^\d{10}$", value):
       data = {"errorCode": 4008, "message": "Phone number must be exactly 10 digits and contain only digits (0-9)."}
       raise ValidationError(data)


def validate_tournament_data(data, edit_mode,stored_start_date,stored_end_date):  
   validate_tournament_name(data.get ("tournament_name"))
   validate_venue(data.get("venue"))
   validate_ground(data.get("ground"))
   validate_start_date(data.get("start_date"),edit_mode,stored_start_date)
   validate_end_date(data.get("start_date"), data.get("end_date"),edit_mode, stored_end_date)
   validate_tournament_category(data.get("tournament_category"))
   validate_ball_type(data.get("ball_type"))
   validate_user_id(data.get("user_id"))
   validate_organizer_name(data.get("organizer_name"))
   validate_organizer_contact(data.get("organizer_contact"))
   description = data.get("description")
   if description is not None:
       validate_description(description)


def validate_date_not_in_past(date_value, error_code,field_name):
   if date_value < current_date:
       raise ValidationError({"errorCode": error_code, "message":  f"{field_name} must not be in the past."})  