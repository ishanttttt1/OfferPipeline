from django.conf import settings
from django.db import models


class Company(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="companies"
    )

    name = models.CharField(max_length=150)
    website = models.URLField(blank=True)
    location = models.CharField(max_length=150, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class Application(models.Model):
    STATUS_CHOICES = [
        ("applied", "Applied"),
        ("oa", "OA"),
        ("interview", "Interview"),
        ("offer", "Offer"),
        ("rejected", "Rejected"),
        ("withdrawn", "Withdrawn"),
    ]

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    position = models.CharField(max_length=150)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="applied"
    )

    applied_at = models.DateField()
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company.name} - {self.position}"

class ApplicationStatusHistory(models.Model):
    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name="status_history"
    )

    status = models.CharField(
        max_length=20,
        choices=Application.STATUS_CHOICES
    )

    changed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-changed_at"]

    def __str__(self):
        return f"{self.application} - {self.status}"
class Resume(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="resumes"
    )

    name = models.CharField(max_length=150)
    file = models.FileField(upload_to="resumes/")
    version = models.PositiveIntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class InterviewRound(models.Model):
    ROUND_TYPE_CHOICES = [
        ("technical", "Technical"),
        ("system_design", "System Design"),
        ("behavioral", "Behavioral"),
        ("hr", "HR"),
        ("managerial", "Managerial"),
        ("other", "Other"),
    ]

    STATUS_CHOICES = [
        ("scheduled", "Scheduled"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name="interview_rounds"
    )

    round_number = models.PositiveIntegerField()

    round_type = models.CharField(
        max_length=30,
        choices=ROUND_TYPE_CHOICES
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="scheduled"
    )

    scheduled_at = models.DateTimeField(
        null=True,
        blank=True
    )

    interviewer = models.CharField(
        max_length=150,
        blank=True
    )

    notes = models.TextField(blank=True)

    feedback = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["round_number"]

    def __str__(self):
        return f"{self.application} - Round {self.round_number}"

class OADeadline(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("missed", "Missed"),
    ]

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="oa_deadlines"
    )

    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name="oa_deadlines"
    )

    title = models.CharField(max_length=150)

    deadline_at = models.DateTimeField()

    assessment_url = models.URLField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["deadline_at"]

    def __str__(self):
        return f"{self.application} - {self.title}"
    

class Tag(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="application_tags",
    )

    name = models.CharField(max_length=50)
    color = models.CharField(max_length=7, default="#6366F1")
    applications = models.ManyToManyField(
        Application,
        related_name="tags",
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        constraints = [
            models.UniqueConstraint(
                fields=["owner", "name"],
                name="unique_tag_name_per_owner",
            )
        ]

    def __str__(self):
        return self.name


class ApplicationNote(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="application_notes",
    )

    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name="application_notes",
    )

    title = models.CharField(max_length=150)
    content = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.application} - {self.title}"
