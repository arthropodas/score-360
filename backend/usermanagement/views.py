

from rest_framework.views import APIView
from score360 import settings
from usermanagement.util.enum import forgot_password_token_used
from .serializers import UserSerializer,UserDataSerializer
from .models import UserData
from .utils import send_email,generate_token
from rest_framework.response import Response
from .validators import (validate_login_email,validate_login_password,validate_have_login_password,validate_token)
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.core.exceptions import ValidationError
from datetime import datetime,timedelta
from django.core.mail import send_mail
from rest_framework.permissions import IsAuthenticated
import jwt
from django.contrib.auth.hashers import check_password, make_password
from django.conf import settings
import logging
from .validators import (
    validate_first_name,
    validate_phone_number,
    validate_last_name,
    validate_balling_style,
    validate_batting_style,
    validate_password,
    validate_date_of_birth,
    validate_emails,
    validate_gender,

)

logger = logging.getLogger(__name__)


ERROR_CONFIRM_PASSWORD = {'errorCode': '2010', 'message': 'Confirm password not matching'}
ERROR_USER_NOT_FOUND = {'errorCode': '1031', 'message': 'User not found'}
ERROR_INVALID_TOKEN = {'errorCode': '1007', 'message': 'Token is invalid'}
ERROR_INVALID_LINK = {'errorCode': '2015', 'message': 'Once used link'}
ERROR_INVALID_DATA = {'errorCode': '2030', 'message': 'Provide valid fields'}
ERROR_INVALID_CURRENT_PASSWORD = {'errorCode' : '2031', 'message': 'Current password is not correct'}
ERROR_INVALID_CRIDENCIALS = {'errorCode': '2033', 'message': 'Invalid credentials'}
ERROR_LINK_EXPIRED={"errorCode": "3116", "message":"Link Expired"}
ERROR_INVALID_LOGIN_CREDENTIALS = {'errorCode': '2034', 'message': 'Invalid login credentials'}
ERROR_NEW_PASSWORD_AND_CURRENT_PASSWORD_SAME = {'errorCode':'4700', 'message':'New password and current password are same'}
ERROR_USED_TOKEN = {'errorCode':'4777', 'message':'The link was used once'}


def remove_square_brackets(json_string):
 
   updated_data = {key: value[0] for key, value in json_string.items()}


   return updated_data


baseurl=settings.BASE_URL
class RegisterView(APIView):
  def post(self, request, token=None):
    print(token)
    try:    
            email=request.data.get("email")
            decoded=jwt.decode(token,settings.SECRET_KEY,algorithms='HS256')
            exp=(decoded['expiry'])
            now=datetime.utcnow().timestamp()
            if now > exp:
                return Response(ERROR_LINK_EXPIRED,status=400)
            token_email=decoded['email']
            if token_email != request.data.get("email") :
                return Response({"errorCode":"3030","message":"please use the same email in which registration link is received"},status=400)

            if UserData.objects.filter(email=request.data.get("email")).count() >0 :
                raise ValidationError({"errorCode":"3035" ,"message":"player with the email already exists"})
            validate_emails(request.data.get("email"))
            validate_first_name(request.data.get("first_name"))
            validate_last_name(request.data.get("last_name"))
            validate_date_of_birth(request.data.get("dob"))
            validate_phone_number(request.data.get("phone_number"))
            validate_balling_style(request.data.get("bowling_style"))
            validate_batting_style(request.data.get("batting_style"))
            validate_password(request.data.get("password"))
            validate_gender(request.data.get("gender"))
            serializer = UserSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            last_id=UserData.objects.last()
            player_id="PL100" + str(last_id.id)
            last_id.player_id=player_id
            last_id.save()
            mail_subject="Registration successful"
            template='successfulRegistration.html'
            send_email(email,mail_subject,template,'/login')
            logger.info('User account created successfully')
            return Response({"message": "successfully created"}, status=200)
    except jwt.exceptions.InvalidTokenError:
            return Response({"errorCode":"3116","message":"invalid token"},status=400)
    except ValidationError as e:
            return Response(remove_square_brackets(e.message_dict),status=400)
    except Exception as e:
        return Response({"errorCode":"1907","message":f"an unexpected error occured{str(e)}"},status=500)
   



class EmailValidationView(APIView):
  def post(self, request):
      email = request.data["email"]
      try:
          validate_emails(email)
          if UserData.objects.filter(email=email).exists():
              raise ValidationError(
                  {"errorCode": "3109", "message": "Email already exists"}
              )
          else:
              token = generate_token(email)
              email_subject='Score360 Player registration'
              email_template='index.html'
              reg_link=f"/register/{token}"
              send_email(email,email_subject,email_template,reg_link)

              logger.info('Registration link successfuly sent')
              return Response({"message": "Registration link sent successfully"})
      except ValidationError as e:
          logger.error('Validation error')
          return Response(
              remove_square_brackets(e.message_dict),
              status=status.HTTP_400_BAD_REQUEST,
          )
      except Exception as e:
          logger.error('Invalid data')
          
          return Response(f'{ERROR_INVALID_DATA}{str(e)}', status=status.HTTP_400_BAD_REQUEST)

class UserLoginAPIView(APIView):
   def post(self, request, format=None):  
       email = request.data.get('email')
       password = request.data.get('password')


       try:
           validate_login_email(email)
           validate_have_login_password(password)
          
           user = authenticate(email=email, password=password)
           if user is None:
               logger.error('Invalid login credentials for email: %s', email)
               return Response(ERROR_INVALID_LOGIN_CREDENTIALS, status=status.HTTP_400_BAD_REQUEST)


           refresh = RefreshToken.for_user(user)
           data = {
               'access_token': str(refresh.access_token),
               'refresh_token': str(refresh),
               'user_type': user.user_type
           }
           logger.info('Logged in successfully')
           return Response(data, status=status.HTTP_200_OK)
          
       except ValidationError as e:
           logger.error('Validation error: %s', e)
           return Response(remove_square_brackets(e.message_dict), status=status.HTTP_400_BAD_REQUEST)
      
  
class SendEmailToResetPassword(APIView):
    def post(self, request):
        email = request.data.get('email')
        try:
            validate_login_email(email)
            user = UserData.objects.get(email=email,status=1)


            payload = {
                'email': email,
                'exp': datetime.utcnow() + timedelta(minutes=60),
            }
            jwt_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

            user.forgotpassword_token = jwt_token
            user.save()

            reset_password_link = f'{baseurl}/resetPassword?s={jwt_token}'
            user_firstname =user.first_name
            user_lastname=user.last_name
            full_name = user_firstname + " " + user_lastname
            subject = 'Score360 - Reset your password '

            message = f"""\
            Dear {full_name},<br><br>

            A request to reset your password has been initiated for your Score360 account. To ensure the security of your account, please follow the link below to reset your password:<br>

            Click <a href="{reset_password_link}">here</a> to change your password.<br>

            If you did not request this password reset or believe this request to be in error, please disregard this message. Your account remains secure.<br><br>

            Thank you for your attention to this matter."""
            
            from_email = settings.EMAIL_HOST
            recipient_list = [email]
            
            send_mail(
                subject,
                '',
                from_email,
                recipient_list,
                html_message=message
            )
            logger.info(f'Password reset link sent successfully to {email}')
            return Response({'message': 'Password reset link sent successfully'}, status=status.HTTP_200_OK)


        except UserData.DoesNotExist:
            logger.error(f'User with email {email} not found')
            return Response(ERROR_USER_NOT_FOUND, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            logger.error(f'Validation error: {e}')
            return Response(remove_square_brackets(e.message_dict), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.exception('An error occurred while sending reset password email')
            return Response(ERROR_INVALID_DATA, status=status.HTTP_400_BAD_REQUEST)
      
class LinkValidation(APIView):
   def put(self, request):
       token = request.data.get('token')
       try:
           validate_token(token)
           payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
           email = payload.get('email')
           user = UserData.objects.get(email=email)

           if user.forgotpassword_token != forgot_password_token_used():
               logger.info('valid token')
               return Response({'message': 'success'}, status=status.HTTP_200_OK)
           else:
               logger.info('token invalid')
               return Response(ERROR_INVALID_LINK, status=status.HTTP_400_BAD_REQUEST)

       except UserData.DoesNotExist:
           logger.error('User does not exist')
           return Response(ERROR_USER_NOT_FOUND, status=status.HTTP_400_BAD_REQUEST)
       except jwt.InvalidTokenError:
           logger.error('Invalid token')
           return Response(ERROR_INVALID_TOKEN, status=status.HTTP_400_BAD_REQUEST)
       except Exception:
           logger.exception('Does not contain all the files')
           return Response(ERROR_INVALID_DATA, status=status.HTTP_400_BAD_REQUEST)
      
class ResetPassword(APIView):
  
   def put(self, request):
       token = request.data.get('token',None)
       new_password = request.data.get('newPassword',None)
       confirm_new_password = request.data.get('confirmPassword',None)
    
       try:
           try:
               validate_token(token)
               validate_login_password(new_password)
               validate_login_password(confirm_new_password)
          
           except ValidationError as e :
               logger.error('validation error in reset password')
               return Response(remove_square_brackets(e.message_dict), status=status.HTTP_400_BAD_REQUEST)
      
           if new_password != confirm_new_password:
               logger.error('Password is not matching')
               return Response(ERROR_CONFIRM_PASSWORD, status=status.HTTP_400_BAD_REQUEST)
           payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
           email = payload.get('email')
           try:
               user = UserData.objects.get(email=email)
               forgot_password_token_status= user.forgotpassword_token
               if forgot_password_token_status == forgot_password_token_used():
                   return Response(ERROR_USED_TOKEN, status=status.HTTP_400_BAD_REQUEST)
           except UserData.DoesNotExist:
               logger.error('No user found')
               return Response(ERROR_USER_NOT_FOUND, status=status.HTTP_400_BAD_REQUEST)

           serializer = UserSerializer()  
           serializer.update_password(user, new_password)
           user.forgotpassword_token = forgot_password_token_used()
           user.save()
           logger.info('Password rest successfully')
           return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)
          
       except jwt.InvalidTokenError:
           logger.error('Invalid token')
           return Response(ERROR_INVALID_TOKEN, status=status.HTTP_400_BAD_REQUEST)
       except Exception as e:
           return Response(ERROR_INVALID_DATA, status=status.HTTP_400_BAD_REQUEST)
      


class ChangePassword(APIView):
   
    permission_classes = (IsAuthenticated, )

    def put(self, request):
        user_id =request.user.id
        current_password = request.data.get('currentPassword')
        new_password = request.data.get('newPassword',None)
        confirm_new_password = request.data.get('confirmPassword',None)

        try:
            try:
                validate_login_password(new_password)
                validate_login_password(confirm_new_password)
                validate_have_login_password(current_password)
            
            except ValidationError as e :
                logger.error('validation error in change password')
                return Response(remove_square_brackets(e.message_dict), status=status.HTTP_400_BAD_REQUEST)
            if new_password == current_password:
                    return Response(ERROR_NEW_PASSWORD_AND_CURRENT_PASSWORD_SAME, status=status.HTTP_400_BAD_REQUEST)

            user = UserData.objects.get(id=user_id)
            if not check_password(current_password, user.password):
                logger.error('Invalid current password')
                return Response(ERROR_INVALID_CURRENT_PASSWORD, status=status.HTTP_400_BAD_REQUEST)

            if new_password != confirm_new_password:
                logger.error('Password is not matching with confirm password')
                return Response(ERROR_CONFIRM_PASSWORD, status=status.HTTP_400_BAD_REQUEST)
            
            
            user.password = make_password(new_password)
            user.save()
            logger.info('Password changed successfully')
            return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
           
        except UserData.DoesNotExist:
           logger.error('No user exist')
           return Response(ERROR_USER_NOT_FOUND, status=status.HTTP_400_BAD_REQUEST)


class UserDataAPIView(APIView):
   permission_classes=[IsAuthenticated]
   def get(self, request):
       try:
           serializer = UserDataSerializer(request.user)
           return Response(serializer.data, status=status.HTTP_200_OK)
       except ValidationError as e :
           return Response(e.message_dict, status=status.HTTP_400_BAD_REQUEST)
       except Exception:
           return Response({'error':"An unexpected error occured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

