from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import User, Profile


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )

        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            username=data["username"],
            password=data["password"]
        )

        if user is None:
            raise serializers.ValidationError(
                "Invalid username or password."
            )

        data["user"] = user
        return data


class ProfileSerializer(serializers.ModelSerializer):

    user = serializers.CharField(
        source="user.username"
    )

    class Meta:
        model = Profile
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at"]

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})
        username = user_data.get("username")

        if username:
            instance.user.username = username
            instance.user.save()

        return super().update(instance, validated_data)