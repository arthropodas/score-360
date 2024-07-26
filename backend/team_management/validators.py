from django.core.exceptions import ValidationError
import os, re
from PIL import Image

team_name = "Team Name"
def validate_length(value, field_name, min_length, max_length, error_code):
    if not (min_length <= len(value) <= max_length):
        raise ValidationError(
            {
                "errorCode": error_code,
                "message": f"{field_name} must be between {min_length} and {max_length} characters",
            }
        )


def validate_not_null_or_empty(value, field_name, error_code):
    if value is None or value == "":

        data = {
            "errorCode": error_code,
            "message": f"{field_name} cannot be null or empty",
        }

        raise ValidationError(data)


def validate_pattern(value,field,pattern, error_code):
    if not re.match(pattern,value):
        raise ValidationError(
            {"errorCode": error_code, "message": "invalid "+field}
        )
    
def validate_pattern_city(value,error_code):
    if not re.match(r"^(?![\s.,-])[\w\s.,-]+(?<![\s.,-])$", value):
        raise ValidationError(
            {"errorCode": error_code, "message": "invalid City"}
        )

def validate_city(value):
    validate_not_null_or_empty(value, "City", "5003")
    validate_length(value, "City", 2, 100, "5004")
    validate_pattern(value,"city","^[a-zA-Z0-9.,\-]+(?: [a-zA-Z0-9.,\-]+)*$","5005")
    


def validate_logo(value):
    ERROR= {"errorCode": "5007", "message": "File uploaded in wrong format"}
    if value:
        valid_formats = ['JPEG','JPG','PNG']
        image = Image.open(value)
        image_format = image.format
        if image_format not in valid_formats:
            raise ValidationError(
               ERROR
            )
        allowed_extensions = [".jpg", ".jpeg", ".png"]
        max_logo_size = 2 * 1024 * 1024
        file_extension = os.path.splitext(value.name)[1].lower()
        if file_extension not in allowed_extensions:
            raise ValidationError(
               ERROR
            )
        

        if value.size > max_logo_size:
            raise ValidationError(
                {
                    "errorCode": "5008",
                    "message": "Uploaded logo size exceeds the maximum allowed (2 MB)",
                }
            )

    else:
        return True


def validate_team_name(value):
    validate_not_null_or_empty(value, team_name, "5001")
    validate_length(value, team_name, 2, 100, "5002")
    validate_pattern(value,"team name","^(?!.*\s{2})[^\s].*[^\s]$", "5009")
    
def validate_team_data(data):
    validate_team_name(data["teamName"])
    validate_city(data["city"])
    validate_logo(data["logo"]) 
    validate_not_null_or_empty(data["tournamentId"],"tournament id",5006)

def validate_tournament(tournament):
    value=tournament.status
    if value == 0:
        raise ValidationError({"errorCode": "4555", "message": "Tournament not found or inactive"})
    elif value  ==5:
        raise ValidationError({"errorCode": "4556", "message": "Tournament has already ended"})
    elif value > 1 :
        raise ValidationError({"errorCode": "4557", "message": "Tournament has already started, not able to delete the team"})
         