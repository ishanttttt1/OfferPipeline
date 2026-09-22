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


class ApplicationSearchFilterPaginationTest(APITestCase):

    def setUp(self):
        self.user_a = User.objects.create_user(
            username="usera",
            password="testpass123"
        )

        self.user_b = User.objects.create_user(
            username="userb",
            password="testpass123"
        )

        self.google = Company.objects.create(
            owner=self.user_a,
            name="Google"
        )

        self.microsoft = Company.objects.create(
            owner=self.user_a,
            name="Microsoft"
        )

        self.amazon = Company.objects.create(
            owner=self.user_a,
            name="Amazon"
        )

        self.user_b_company = Company.objects.create(
            owner=self.user_b,
            name="Google"
        )

        token = RefreshToken.for_user(self.user_a)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {token.access_token}"
        )

        applications = [
            (self.google, "Backend Developer", "interview"),
            (self.google, "Frontend Developer", "applied"),
            (self.google, "Software Engineer", "offer"),
            (self.microsoft, "Backend Engineer", "interview"),
            (self.microsoft, "Software Engineer", "rejected"),
            (self.amazon, "Data Engineer", "applied"),
            (self.amazon, "Backend Developer", "interview"),
            (self.amazon, "DevOps Engineer", "withdrawn"),
            (self.google, "Machine Learning Engineer", "applied"),
            (self.microsoft, "Full Stack Developer", "interview"),
            (self.amazon, "Software Engineer", "offer"),
            (self.google, "Product Engineer", "rejected"),
        ]

        for company, position, status in applications:
            Application.objects.create(
                owner=self.user_a,
                company=company,
                position=position,
                status=status,
                applied_at="2026-09-15",
                notes="",
            )

        Application.objects.create(
            owner=self.user_b,
            company=self.user_b_company,
            position="Backend Developer",
            status="interview",
            applied_at="2026-09-15",
            notes="",
        )

    def test_pagination(self):
        response = self.client.get(
            "/api/applications/"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 12)
        self.assertEqual(len(response.data["results"]), 10)
        self.assertIsNotNone(response.data["next"])
        self.assertIsNone(response.data["previous"])

        response = self.client.get(
            "/api/applications/?page=2"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["results"]), 2)
        self.assertIsNone(response.data["next"])
        self.assertIsNotNone(response.data["previous"])

    def test_filter_by_status(self):
        response = self.client.get(
            "/api/applications/?status=interview"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 4)

        for application in response.data["results"]:
            self.assertEqual(
                application["status"],
                "interview"
            )

    def test_filter_by_company(self):
        response = self.client.get(
            "/api/applications/?company=google"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 5)

        for application in response.data["results"]:
            self.assertEqual(
                application["company"],
                self.google.id
            )

    def test_search_by_position(self):
        response = self.client.get(
            "/api/applications/?search=backend"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 3)

        for application in response.data["results"]:
            self.assertIn(
                "backend",
                application["position"].lower()
            )

    def test_search_by_company(self):
        response = self.client.get(
            "/api/applications/?search=microsoft"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 3)

        for application in response.data["results"]:
            self.assertEqual(
                application["company"],
                self.microsoft.id
            )

    def test_combined_status_and_company_filter(self):
        response = self.client.get(
            "/api/applications/"
            "?status=interview&company=google"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 1)

        application = response.data["results"][0]

        self.assertEqual(
            application["status"],
            "interview"
        )

        self.assertEqual(
            application["company"],
            self.google.id
        )

    def test_combined_search_and_status_filter(self):
        response = self.client.get(
            "/api/applications/"
            "?search=backend&status=interview"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 3)

        for application in response.data["results"]:
            self.assertEqual(
                application["status"],
                "interview"
            )

            self.assertIn(
                "backend",
                application["position"].lower()
            )

    def test_combined_filters_with_pagination(self):
        response = self.client.get(
            "/api/applications/"
            "?status=interview&search=developer&page=1"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 3)
        self.assertEqual(len(response.data["results"]), 3)

        for application in response.data["results"]:
            self.assertEqual(
                application["status"],
                "interview"
            )

            self.assertIn(
                "developer",
                application["position"].lower()
            )

    def test_user_only_sees_own_applications(self):
        response = self.client.get(
            "/api/applications/"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 12)

        for application in response.data["results"]:
            self.assertNotEqual(
                application["company"],
                self.user_b_company.id
            )