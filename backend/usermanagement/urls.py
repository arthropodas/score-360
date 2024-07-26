from django.urls import path
from .views import UserLoginAPIView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView,EmailValidationView,SendEmailToResetPassword,LinkValidation,ResetPassword,ChangePassword,UserDataAPIView

urlpatterns = [
   
    path('login', UserLoginAPIView.as_view(), name='user_login'),
    path('login/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/<str:token>',RegisterView.as_view(),name='register'),
    path('validate_email',EmailValidationView.as_view() ,name='validate-email'),
    path('forgot_password',SendEmailToResetPassword.as_view(), name='email-to-resetpassword'),
    path('link_validation',LinkValidation.as_view(), name = 'link-validation'),
    path('reset_password', ResetPassword.as_view(), name= 'reset-password') ,
    path('change_password', ChangePassword.as_view(), name= 'change-password'),
    path('user-data/',UserDataAPIView.as_view(), name='user-data')
]