from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Application, Company


User = get_user_model()


class ApplicationStatusHistoryTest(APITestCase):

    def setUp(self):
        self.user_a = User.objects.create_user(
            username="usera",
            password="testpass123"
        )

        self.user_b = User.objects.create_user(
            username="userb",
            password="testpass123"
        )

        self.company = Company.objects.create(
            owner=self.user_a,
            name="Test Company"
        )

        token = RefreshToken.for_user(self.user_a)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {token.access_token}"
        )

    def test_status_history_flow(self):
        response = self.client.post(
            "/api/applications/",
            {
                "company": self.company.id,
                "position": "Software Engineer",
                "status": "applied",
                "applied_at": "2026-09-15",
                "notes": "",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)

        application_id = response.data["id"]

        response = self.client.get(
            f"/api/applications/{application_id}/status-history/"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["status"], "applied")

        response = self.client.patch(
            f"/api/applications/{application_id}/",
            {"status": "interview"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)

        response = self.client.get(
            f"/api/applications/{application_id}/status-history/"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["status"], "interview")
        self.assertEqual(response.data[1]["status"], "applied")

    def test_user_cannot_access_another_users_history(self):
        response = self.client.post(
            "/api/applications/",
            {
                "company": self.company.id,
                "position": "Backend Developer",
                "status": "applied",
                "applied_at": "2026-09-15",
                "notes": "",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)

        application_id = response.data["id"]

        token = RefreshToken.for_user(self.user_b)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {token.access_token}"
        )

        response = self.client.get(
            f"/api/applications/{application_id}/status-history/"
        )

        self.assertEqual(response.status_code, 404)