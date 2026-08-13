from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    profile_picture = models.ImageField(
        upload_to="profile_pictures/",
        blank=True,
        null=True
    )

    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=100, blank=True)

    headline = models.CharField(max_length=150, blank=True)
    bio = models.TextField(blank=True)

    university = models.CharField(max_length=150, blank=True)
    degree = models.CharField(max_length=100, blank=True)
    graduation_year = models.PositiveIntegerField(
        blank=True,
        null=True
    )

    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)

    open_to_work = models.BooleanField(default=True)

    preferred_roles = models.TextField(blank=True)
    preferred_locations = models.TextField(blank=True)
    preferred_work_mode = models.CharField(
        max_length=50,
        blank=True
    )

    expected_salary = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"