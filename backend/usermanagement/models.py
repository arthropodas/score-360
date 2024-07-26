from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
import shortuuid
from datetime import date


class UserManager(BaseUserManager):

    use_in_migration = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is Required")
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user


class UserData(AbstractUser):
    last_login = None
    is_superuser = None
    is_staff = None
    username = None
    player_id = models.CharField(
        max_length=50,null=True,default=0
    )
    first_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=6, null=True)
    last_name = models.CharField(max_length=100)
    dob = models.DateField(blank=True, null=False)
    email = models.EmailField(max_length=100, unique=True)
    phone_number = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)
    bowling_style = models.CharField(max_length=100)
    batting_style = models.CharField(max_length=100)
    user_type = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.IntegerField(default=1)
    forgotpassword_token = models.CharField(max_length=200, blank=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "phone_number"]

    class Meta:
        db_table = "players"

    def __str__(self):
        return self.first_name
