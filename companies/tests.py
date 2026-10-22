from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile

from rest_framework.test import APITestCase

from rest_framework_simplejwt.tokens import RefreshToken

from .models import Application, Company, Resume, InterviewRound, OADeadline, ApplicationNote, Tag


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
class OADeadlineTest(APITestCase):

    def setUp(self):
        self.user_a = User.objects.create_user(
            username="usera",
            password="testpass123",
        )

        self.user_b = User.objects.create_user(
            username="userb",
            password="testpass123",
        )

        self.company_a = Company.objects.create(
            owner=self.user_a,
            name="Google",
        )

        self.company_b = Company.objects.create(
            owner=self.user_b,
            name="Microsoft",
        )

        self.application_a = Application.objects.create(
            owner=self.user_a,
            company=self.company_a,
            position="Software Engineer",
            status="oa",
            applied_at="2026-10-10",
            notes="",
        )

        self.application_b = Application.objects.create(
            owner=self.user_b,
            company=self.company_b,
            position="Backend Engineer",
            status="oa",
            applied_at="2026-10-10",
            notes="",
        )

        token = RefreshToken.for_user(self.user_a)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {token.access_token}"
        )

        self.deadline_data = {
            "application": self.application_a.id,
            "title": "Google Online Assessment",
            "deadline_at": "2026-10-20T18:00:00Z",
            "assessment_url": "https://example.com/assessment",
            "status": "pending",
            "notes": "Practice DSA before starting",
        }

    def test_user_can_create_oa_deadline(self):
        response = self.client.post(
            "/api/companies/oa-deadlines/",
            self.deadline_data,
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            response.data["title"],
            "Google Online Assessment",
        )
        self.assertEqual(
            response.data["owner"],
            self.user_a.id,
        )
        self.assertEqual(
            response.data["application"],
            self.application_a.id,
        )

    def test_user_can_list_own_oa_deadlines(self):
        deadline = OADeadline.objects.create(
            owner=self.user_a,
            application=self.application_a,
            title="Google OA",
            deadline_at="2026-10-20T18:00:00Z",
        )

        response = self.client.get(
            "/api/companies/oa-deadlines/"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(
            response.data[0]["id"],
            deadline.id,
        )

    def test_user_cannot_access_another_users_deadline(self):
        deadline = OADeadline.objects.create(
            owner=self.user_b,
            application=self.application_b,
            title="Private Assessment",
            deadline_at="2026-10-20T18:00:00Z",
        )

        response = self.client.get(
            f"/api/companies/oa-deadlines/{deadline.id}/"
        )

        self.assertEqual(response.status_code, 404)

    def test_user_cannot_create_deadline_for_another_users_application(self):
        data = {
            **self.deadline_data,
            "application": self.application_b.id,
        }

        response = self.client.post(
            "/api/companies/oa-deadlines/",
            data,
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertFalse(
            OADeadline.objects.filter(
                application=self.application_b,
            ).exists()
        )

    def test_user_can_update_own_oa_deadline(self):
        deadline = OADeadline.objects.create(
            owner=self.user_a,
            application=self.application_a,
            title="Google OA",
            deadline_at="2026-10-20T18:00:00Z",
        )

        response = self.client.patch(
            f"/api/companies/oa-deadlines/{deadline.id}/",
            {
                "status": "completed",
                "notes": "Assessment submitted",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "completed")
        self.assertEqual(
            response.data["notes"],
            "Assessment submitted",
        )

    def test_user_cannot_change_deadline_to_another_users_application(self):
        deadline = OADeadline.objects.create(
            owner=self.user_a,
            application=self.application_a,
            title="Google OA",
            deadline_at="2026-10-20T18:00:00Z",
        )

        response = self.client.patch(
            f"/api/companies/oa-deadlines/{deadline.id}/",
            {"application": self.application_b.id},
            format="json",
        )

        self.assertEqual(response.status_code, 400)

        deadline.refresh_from_db()
        self.assertEqual(
            deadline.application_id,
            self.application_a.id,
        )

    def test_user_can_delete_own_oa_deadline(self):
        deadline = OADeadline.objects.create(
            owner=self.user_a,
            application=self.application_a,
            title="Google OA",
            deadline_at="2026-10-20T18:00:00Z",
        )

        response = self.client.delete(
            f"/api/companies/oa-deadlines/{deadline.id}/"
        )

        self.assertEqual(response.status_code, 204)
        self.assertFalse(
            OADeadline.objects.filter(id=deadline.id).exists()
        )


class NotesAndTagsTest(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(
            username="notes_user_a",
            password="testpass123",
        )
        self.user_b = User.objects.create_user(
            username="notes_user_b",
            password="testpass123",
        )

        self.company_a = Company.objects.create(
            owner=self.user_a,
            name="Google",
        )
        self.company_b = Company.objects.create(
            owner=self.user_b,
            name="Microsoft",
        )

        self.application_a = Application.objects.create(
            owner=self.user_a,
            company=self.company_a,
            position="Software Engineer",
            status="applied",
            applied_at="2026-10-15",
        )
        self.application_b = Application.objects.create(
            owner=self.user_b,
            company=self.company_b,
            position="Backend Developer",
            status="applied",
            applied_at="2026-10-15",
        )

        token = RefreshToken.for_user(self.user_a)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {token.access_token}"
        )

        self.notes_url = "/api/companies/application-notes/"
        self.tags_url = "/api/companies/tags/"

    def test_user_can_create_list_update_and_delete_note(self):
        response = self.client.post(
            self.notes_url,
            {
                "application": self.application_a.id,
                "title": "Technical preparation",
                "content": "Revise arrays and dynamic programming.",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)

        note_id = response.data["id"]
        self.assertEqual(response.data["owner"], self.user_a.id)

        response = self.client.get(self.notes_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

        response = self.client.patch(
            f"{self.notes_url}{note_id}/",
            {"content": "Revise graphs and dynamic programming."},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data["content"],
            "Revise graphs and dynamic programming.",
        )

        response = self.client.delete(
            f"{self.notes_url}{note_id}/"
        )
        self.assertEqual(response.status_code, 204)
        self.assertFalse(
            ApplicationNote.objects.filter(id=note_id).exists()
        )

    def test_user_cannot_create_note_for_another_users_application(self):
        response = self.client.post(
            self.notes_url,
            {
                "application": self.application_b.id,
                "title": "Private note",
                "content": "This should be rejected.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertFalse(
            ApplicationNote.objects.filter(
                application=self.application_b
            ).exists()
        )

    def test_user_cannot_access_another_users_note(self):
        note = ApplicationNote.objects.create(
            owner=self.user_b,
            application=self.application_b,
            title="Private note",
            content="Private content",
        )

        response = self.client.get(
            f"{self.notes_url}{note.id}/"
        )
        self.assertEqual(response.status_code, 404)

    def test_user_can_create_list_update_and_delete_tag(self):
        response = self.client.post(
            self.tags_url,
            {
                "name": "DSA",
                "color": "#6366F1",
                "applications": [self.application_a.id],
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)

        tag_id = response.data["id"]
        self.assertEqual(response.data["owner"], self.user_a.id)

        response = self.client.get(self.tags_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

        response = self.client.patch(
            f"{self.tags_url}{tag_id}/",
            {"name": "Advanced DSA"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["name"], "Advanced DSA")

        response = self.client.delete(
            f"{self.tags_url}{tag_id}/"
        )
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Tag.objects.filter(id=tag_id).exists())

    def test_user_cannot_tag_another_users_application(self):
        response = self.client.post(
            self.tags_url,
            {
                "name": "Unauthorized tag",
                "color": "#EF4444",
                "applications": [self.application_b.id],
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertFalse(
            Tag.objects.filter(owner=self.user_a).exists()
        )

    def test_user_cannot_access_another_users_tag(self):
        tag = Tag.objects.create(
            owner=self.user_b,
            name="Private tag",
        )
        tag.applications.add(self.application_b)

        response = self.client.get(
            f"{self.tags_url}{tag.id}/"
        )
        self.assertEqual(response.status_code, 404)
class AnalyticsDashboardTest(APITestCase):

    def setUp(self):
        self.user_a = User.objects.create_user(
            username="analytics_user_a",
            password="testpass123",
        )

        self.user_b = User.objects.create_user(
            username="analytics_user_b",
            password="testpass123",
        )

        self.company_a = Company.objects.create(
            owner=self.user_a,
            name="Analytics Company A",
        )

        self.company_b = Company.objects.create(
            owner=self.user_b,
            name="Analytics Company B",
        )

        # Applications belonging to user A
        self.application_applied = Application.objects.create(
            owner=self.user_a,
            company=self.company_a,
            position="Applied Developer",
            status="applied",
            applied_at="2026-10-01",
        )

        self.application_offer = Application.objects.create(
            owner=self.user_a,
            company=self.company_a,
            position="Offer Engineer",
            status="offer",
            applied_at="2026-10-02",
        )

        self.application_rejected = Application.objects.create(
            owner=self.user_a,
            company=self.company_a,
            position="Rejected Engineer",
            status="rejected",
            applied_at="2026-10-03",
        )

        self.application_interview = Application.objects.create(
            owner=self.user_a,
            company=self.company_a,
            position="Interview Engineer",
            status="interview",
            applied_at="2026-10-04",
        )

        # Application belonging to user B
        self.other_users_application = Application.objects.create(
            owner=self.user_b,
            company=self.company_b,
            position="Private Offer Engineer",
            status="offer",
            applied_at="2026-10-05",
        )

        # OA deadlines belonging to user A
        OADeadline.objects.create(
            owner=self.user_a,
            application=self.application_applied,
            title="Completed OA",
            deadline_at="2026-10-20T18:00:00Z",
            status="completed",
        )

        OADeadline.objects.create(
            owner=self.user_a,
            application=self.application_interview,
            title="Pending OA",
            deadline_at="2026-10-21T18:00:00Z",
            status="pending",
        )

        # OA deadline belonging to user B
        OADeadline.objects.create(
            owner=self.user_b,
            application=self.other_users_application,
            title="Other User Completed OA",
            deadline_at="2026-10-22T18:00:00Z",
            status="completed",
        )

        # Interview rounds belonging to user A
        InterviewRound.objects.create(
            application=self.application_interview,
            round_number=1,
            round_type="technical",
            status="completed",
        )

        InterviewRound.objects.create(
            application=self.application_interview,
            round_number=2,
            round_type="hr",
            status="scheduled",
        )

        # Interview round belonging to user B
        InterviewRound.objects.create(
            application=self.other_users_application,
            round_number=1,
            round_type="technical",
            status="completed",
        )

        # Authenticate as user A
        token = RefreshToken.for_user(self.user_a)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {token.access_token}"
        )

        self.analytics_url = "/api/companies/analytics/"

    def test_analytics_requires_authentication(self):
        self.client.credentials()

        response = self.client.get(self.analytics_url)

        self.assertEqual(response.status_code, 401)

    def test_analytics_returns_correct_statistics_for_current_user(self):
        response = self.client.get(self.analytics_url)

        self.assertEqual(response.status_code, 200)

        self.assertEqual(
            response.data["total_applications"],
            4,
        )

        self.assertEqual(
            response.data["offers"],
            1,
        )

        self.assertEqual(
            response.data["rejections"],
            1,
        )

        self.assertEqual(
            response.data["applications_by_status"],
            {
                "applied": 1,
                "oa": 0,
                "interview": 1,
                "offer": 1,
                "rejected": 1,
                "withdrawn": 0,
            },
        )

        self.assertEqual(
            response.data["oa_completion_rate"],
            50.0,
        )

        self.assertEqual(
            response.data["interview_completion_rate"],
            50.0,
        )

        self.assertEqual(
            response.data["response_rate"],
            75.0,
        )

    def test_analytics_does_not_include_another_users_data(self):
        response = self.client.get(self.analytics_url)

        self.assertEqual(response.status_code, 200)

        # User B's application must not affect user A's statistics.
        self.assertEqual(
            response.data["total_applications"],
            4,
        )

        self.assertEqual(
            response.data["offers"],
            1,
        )

        self.assertEqual(
            response.data["oa_completion_rate"],
            50.0,
        )

        self.assertEqual(
            response.data["interview_completion_rate"],
            50.0,
        )

    def test_analytics_returns_zero_rates_when_no_records_exist(self):
        # Create a user with no applications, OAs, or interviews.
        empty_user = User.objects.create_user(
            username="analytics_empty_user",
            password="testpass123",
        )

        token = RefreshToken.for_user(empty_user)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {token.access_token}"
        )

        response = self.client.get(self.analytics_url)

        self.assertEqual(response.status_code, 200)

        self.assertEqual(
            response.data["total_applications"],
            0,
        )

        self.assertEqual(
            response.data["offers"],
            0,
        )

        self.assertEqual(
            response.data["rejections"],
            0,
        )

        self.assertEqual(
            response.data["oa_completion_rate"],
            0,
        )

        self.assertEqual(
            response.data["interview_completion_rate"],
            0,
        )

        self.assertEqual(
            response.data["response_rate"],
            0,
        )