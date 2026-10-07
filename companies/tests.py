from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile

from rest_framework.test import APITestCase

from rest_framework_simplejwt.tokens import RefreshToken

from .models import Application, Company, Resume, InterviewRound


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


class ResumeTest(APITestCase):

    def setUp(self):
        self.user_a = User.objects.create_user(
            username="usera",
            password="testpass123"
        )

        self.user_b = User.objects.create_user(
            username="userb",
            password="testpass123"
        )

        token = RefreshToken.for_user(self.user_a)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {token.access_token}"
        )

    def test_user_can_upload_resume(self):
        resume_file = SimpleUploadedFile(
            "resume.pdf",
            b"fake pdf content",
            content_type="application/pdf"
        )

        response = self.client.post(
            "/api/companies/resumes/",
            {
                "name": "Backend Resume",
                "version": 1,
                "file": resume_file,
            },
            format="multipart"
        )

        self.assertEqual(response.status_code, 201)

        self.assertEqual(
            response.data["name"],
            "Backend Resume"
        )

        self.assertEqual(
            response.data["version"],
            1
        )

    def test_user_cannot_access_another_users_resume(self):
        resume_file = SimpleUploadedFile(
            "resume.pdf",
            b"fake pdf content",
            content_type="application/pdf"
        )

        response = self.client.post(
            "/api/companies/resumes/",
            {
                "name": "Backend Resume",
                "version": 1,
                "file": resume_file,
            },
            format="multipart"
        )

        self.assertEqual(response.status_code, 201)

        resume_id = response.data["id"]

        token = RefreshToken.for_user(self.user_b)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {token.access_token}"
        )

        response = self.client.get(
            f"/api/companies/resumes/{resume_id}/"
        )

        self.assertEqual(response.status_code, 404)


class InterviewRoundTest(APITestCase):

    def setUp(self):
        self.user_a = User.objects.create_user(
            username="usera",
            password="testpass123"
        )

        self.user_b = User.objects.create_user(
            username="userb",
            password="testpass123"
        )

        self.company_a = Company.objects.create(
            owner=self.user_a,
            name="Google"
        )

        self.company_b = Company.objects.create(
            owner=self.user_b,
            name="Microsoft"
        )

        self.application_a = Application.objects.create(
            owner=self.user_a,
            company=self.company_a,
            position="Software Engineer",
            status="interview",
            applied_at="2026-10-07",
            notes=""
        )

        self.application_b = Application.objects.create(
            owner=self.user_b,
            company=self.company_b,
            position="Backend Engineer",
            status="interview",
            applied_at="2026-10-07",
            notes=""
        )

        token = RefreshToken.for_user(self.user_a)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {token.access_token}"
        )

    def test_user_can_create_interview_round(self):
        response = self.client.post(
            "/api/companies/interview-rounds/",
            {
                "application": self.application_a.id,
                "round_number": 1,
                "round_type": "technical",
                "status": "scheduled",
                "scheduled_at": "2026-10-10T10:00:00Z",
                "interviewer": "John Doe",
                "notes": "Prepare DSA questions",
                "feedback": "",
            },
            format="json"
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            response.data["application"],
            self.application_a.id
        )
        self.assertEqual(
            response.data["round_number"],
            1
        )
        self.assertEqual(
            response.data["round_type"],
            "technical"
        )

    def test_user_can_list_own_interview_rounds(self):
        interview_round = InterviewRound.objects.create(
            application=self.application_a,
            round_number=1,
            round_type="technical",
            status="scheduled",
            interviewer="John Doe",
            notes="DSA round",
            feedback=""
        )

        response = self.client.get(
            "/api/companies/interview-rounds/"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(
            response.data[0]["id"],
            interview_round.id
        )

    def test_user_cannot_access_another_users_interview_round(self):
        interview_round = InterviewRound.objects.create(
            application=self.application_b,
            round_number=1,
            round_type="technical",
            status="scheduled",
            interviewer="Jane Doe",
            notes="Private round",
            feedback=""
        )

        response = self.client.get(
            f"/api/companies/interview-rounds/{interview_round.id}/"
        )

        self.assertEqual(response.status_code, 404)

    def test_user_cannot_create_round_for_another_users_application(self):
        response = self.client.post(
            "/api/companies/interview-rounds/",
            {
                "application": self.application_b.id,
                "round_number": 1,
                "round_type": "technical",
                "status": "scheduled",
                "scheduled_at": "2026-10-10T10:00:00Z",
                "interviewer": "Jane Doe",
                "notes": "",
                "feedback": "",
            },
            format="json"
        )

        self.assertEqual(response.status_code, 403)

    def test_user_can_update_own_interview_round(self):
        interview_round = InterviewRound.objects.create(
            application=self.application_a,
            round_number=1,
            round_type="technical",
            status="scheduled",
            interviewer="John Doe",
            notes="Initial notes",
            feedback=""
        )

        response = self.client.patch(
            f"/api/companies/interview-rounds/{interview_round.id}/",
            {
                "status": "completed",
                "feedback": "Good technical performance"
            },
            format="json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data["status"],
            "completed"
        )
        self.assertEqual(
            response.data["feedback"],
            "Good technical performance"
        )

    def test_user_can_delete_own_interview_round(self):
        interview_round = InterviewRound.objects.create(
            application=self.application_a,
            round_number=1,
            round_type="technical",
            status="scheduled",
            interviewer="John Doe",
            notes="Delete test",
            feedback=""
        )

        response = self.client.delete(
            f"/api/companies/interview-rounds/{interview_round.id}/"
        )

        self.assertEqual(response.status_code, 204)

        self.assertFalse(
            InterviewRound.objects.filter(
                id=interview_round.id
            ).exists()
        )