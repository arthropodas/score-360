from rest_framework import serializers
from .models import UserData

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import make_password


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData
        fields = [
            "id",
            "email",
            "first_name",
            "password",
            "dob",
            "last_name",
            "phone_number",
            "bowling_style",
            "batting_style",
            "gender",
            "player_id"
        ]

    def create(self, validated_data):
        user = UserData.objects.create(
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            phone_number=validated_data["phone_number"],
            bowling_style=validated_data["bowling_style"],
            batting_style=validated_data["batting_style"],
            dob=validated_data["dob"],
            gender=validated_data["gender"],
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


    def update_password(self, instance, password):
        instance.password = make_password(password)
        instance.save()
        return instance


class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        """
        Custom validation to check if the email already exists in the User model.
        """
        if UserData.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already registered.")
        return value


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

      
        token["name"] = user.name
        token["email"] = user.email
        token["user_id"] = user.id
        return token


class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "bowling_style",
            "batting_style",
            "player_id"
        ]
