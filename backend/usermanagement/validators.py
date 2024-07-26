import datetime
from django.core.exceptions import ValidationError
import re

from datetime import datetime,date

from usermanagement.models import UserData


def validate_login_email(value):
    match = re.search(
       r'^[^@ ]+@[^@ ]+\.[^@ .]{2,}$', str(value)
    )
    if not value:
        data = {"errorCode": 2001, "message": "Email is not given"}
        raise ValidationError(data)
    elif not match:
        data = {"errorCode": 2003, "message": "Invalid email format"}
        raise ValidationError(data)

def validate_have_login_password(value):
     if not value:
        data = {"errorCode": 2005, "message": "Password not given"}
        raise ValidationError(data)

def validate_login_password(value):
    match = re.search(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$", str(value))
    if not value:
        data = {"errorCode": 2002, "message": "Password not given"}
        raise ValidationError(data)
    elif not match:
        data = {"errorCode": 2004, "message": "Invalid password format"}
        raise ValidationError(data)


def validate_emails(value):
    if value=="":
        data = {"errorCode": 3114, "errorMessage": "player email not given"}
        raise ValidationError(data)
 
    domain_pattern = r"(?:com|org|edu|in|net|ai|gov|me|co(?:\.in)?|us|au|jp|ca|uk)"
    regex_pattern = rf"^[a-z0-9](?:[a-z0-9.+]*[a-z0-9])?@[a-z0-9]+\.{domain_pattern}$"

    match = re.search(regex_pattern, value) 

    if not match:
        data = {"errorCode": 3104, "errorMessage": "Invalid email"}
        raise ValidationError(data)





def validate_first_name(value):


    data = {"errorCode": "3101", "message": "Invalid player first name"}
    if  value=="":
        raise ValidationError(
            {"errorCode": "3111", "message": "player first name not given"}
        )  
    if not re.match("^[a-zA-Z.]+$", value):
        raise ValidationError(data)

    if (len(value) < 2) or (len(value) > 50):
        raise ValidationError(data)
    return value
   




def validate_last_name(value):
    print("hii validatir",value)
    if value== "":
        raise ValidationError(
            {"errorCode": "3112", "message": " player last name not given"}
        )
    data = {"errorCode": "3102", "message": "Invalid player last name"}
    if not re.match("^[a-zA-Z.]+$", value):
        raise ValidationError(data)
    if (len(value) < 1) or (len(value) > 50):
        raise ValidationError(data)
    return value    




def validate_phone_number(value):
    error_code1 = {"errorCode": "3117", "message": "invalid phone number"}
    error_code2 = {"errorCode": "3118", "message": "phone number not given"}
    if  value=="":
        raise ValidationError(error_code2)
    if not re.match("^\d{10}$", value):
        raise ValidationError(error_code1)
    return value

def validate_balling_style(value):
     if  value=="":
        raise ValidationError(
            {"errorCode": "3119", "message": "player bowling style not given"}
        )
     if value not in [
        "Right arm pace/seam bowling",
        "Left arm pace/seam bowling",
        "Right-arm spin bowling",
        "Left-arm spin bowling",
    ]:
        raise ValidationError(
            {"errorCode": "3106", "message": "Invalid bowling style"}
        )
     return value
   
   




def validate_batting_style(value):
    if value=="":
        data = {"errorCode": "3034", "message": "player batting style not given"}
        raise ValidationError(data)
    if value not in ["right", "left"]:
        data = {"errorCode": 3105, "errorMessage": "invalid batting style"}
        raise ValidationError(data)
   




def validate_password(value):
    if  value=="":
        data = {"errorCode": 3115, "errorMessage": "password not given"}
        raise ValidationError(data)
    if not re.match(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$",value):
        data = {"errorCode": 3107, "errorMessage": "Invalid password"}
        raise ValidationError(data)
   
    return value




def validate_date_of_birth(value):
    data_invalid = {"errorCode": 3103, "errorMessage": "invalid dob"}
    no_data = {"errorCode": 3113, "errorMessage": "player dob not given"}
    if value=="":
        raise ValidationError(no_data)
    if not re.match(r"^\d{4}-\d{2}-\d{2}$",str(value)):
        raise ValidationError(data_invalid)

    value = datetime.strptime(str(value), '%Y-%m-%d').date()
    today = date.today()
    age = (
        today.year - value.year - ((today.month, today.day) < (value.month, value.day))
    )
    if age < 10:
        raise ValidationError(data_invalid)
    return value




def validate_gender(value):
    if  value=="":
        data = {"errorCode": "3119", "message": "gender not selected"}
        raise ValidationError(data)
    if value not in ["Male", "Female"]:
        data = {"errorCode": "3120", "message": "invalid gender"}
        raise ValidationError(data)
   
def validate_token(value):
    if  value=="":
        data = {"errorCode":"4700", "message": "Provide a token"}
        raise ValidationError(data)

