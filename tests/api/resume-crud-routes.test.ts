import { beforeEach, describe, expect, it, vi } from "vitest";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import skillsService from "@/services/skills.service";
import educationService from "@/services/education.service";
import resumeProjectService from "@/services/resume-project.service";
import certificateService from "@/services/certificate.service";
import experienceService from "@/services/experience.service";
import {
  DELETE as skillsDelete,
  GET as skillsGet,
  PUT as skillsPut,
} from "@/app/api/resume/skills/route";
import {
  DELETE as educationDelete,
  POST as educationPost,
  PUT as educationPut,
} from "@/app/api/resume/education/route";
import {
  DELETE as projectsDelete,
  POST as projectsPost,
  PUT as projectsPut,
} from "@/app/api/resume/projects/route";
import {
  DELETE as certDelete,
  POST as certPost,
  PUT as certPut,
} from "@/app/api/resume/certifications/route";
import {
  DELETE as expDelete,
  POST as expPost,
  PUT as expPut,
} from "@/app/api/resume/experience/route";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  authOptions: {},
}));

vi.mock("@/lib/db", () => ({
  connectDB: vi.fn(),
}));

vi.mock("@/services/skills.service", () => ({
  default: {
    getSkills: vi.fn(),
    updateSkills: vi.fn(),
    addSkillGroup: vi.fn(),
    deleteSkillGroup: vi.fn(),
  },
}));

vi.mock("@/services/education.service", () => ({
  default: {
    addEducation: vi.fn(),
    updateEducation: vi.fn(),
    deleteEducation: vi.fn(),
    getEducationById: vi.fn(),
  },
}));

vi.mock("@/services/resume-project.service", () => ({
  default: {
    addProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
    getProjectById: vi.fn(),
  },
}));

vi.mock("@/services/certificate.service", () => ({
  default: {
    addCertificate: vi.fn(),
    updateCertificate: vi.fn(),
    deleteCertificate: vi.fn(),
    getCertificateById: vi.fn(),
  },
}));

vi.mock("@/services/experience.service", () => ({
  default: {
    addExperience: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getByExperienceId: vi.fn(),
  },
}));

const userSession = { user: { id: "user_1" } };

describe("Resume CRUD API Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getServerSession).mockResolvedValue(userSession as any);
    vi.mocked(connectDB).mockResolvedValue({} as any);
  });

  describe("skills route", () => {
    it("returns 401 if unauthenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null as any);
      const res = await skillsGet(new Request("http://localhost/api/resume/skills"));
      expect(res.status).toBe(401);
    });

    it("updates skill groups", async () => {
      vi.mocked(skillsService.updateSkills).mockResolvedValue({
        skillGroups: [{ category: "Frontend", color: "#000", skills: [] }],
      } as any);

      const res = await skillsPut(
        new Request("http://localhost/api/resume/skills", {
          method: "PUT",
          body: JSON.stringify({
            skillGroups: [{ category: "Frontend", color: "#000", skills: [] }],
          }),
        })
      );

      expect(res.status).toBe(200);
      expect(skillsService.updateSkills).toHaveBeenCalledWith("user_1", [
        { category: "Frontend", color: "#000", skills: [] },
      ]);
    });

    it("rejects delete without category", async () => {
      const res = await skillsDelete(
        new Request("http://localhost/api/resume/skills", {
          method: "DELETE",
          body: JSON.stringify({}),
        })
      );
      expect(res.status).toBe(400);
    });
  });

  describe("education route", () => {
    it("creates education entry", async () => {
      vi.mocked(educationService.addEducation).mockResolvedValue({ _id: "e1" } as any);
      const res = await educationPost(
        new Request("http://localhost/api/resume/education", {
          method: "POST",
          body: JSON.stringify({
            degree: "B.Tech",
            field: "CSE",
            institution: "ABC",
            startYear: 2020,
          }),
        })
      );
      expect(res.status).toBe(200);
      expect(educationService.addEducation).toHaveBeenCalled();
    });

    it("returns 404 if update target missing", async () => {
      vi.mocked(educationService.updateEducation).mockResolvedValue(null as any);
      const res = await educationPut(
        new Request("http://localhost/api/resume/education", {
          method: "PUT",
          body: JSON.stringify({ educationId: "missing", body: { degree: "MS" } }),
        })
      );
      expect(res.status).toBe(404);
    });

    it("deletes education by id", async () => {
      vi.mocked(educationService.deleteEducation).mockResolvedValue({ success: true });
      const res = await educationDelete(
        new Request("http://localhost/api/resume/education", {
          method: "DELETE",
          body: JSON.stringify({ educationId: "edu_1" }),
        })
      );
      expect(res.status).toBe(200);
    });
  });

  describe("projects route", () => {
    it("creates project with required fields", async () => {
      vi.mocked(resumeProjectService.addProject).mockResolvedValue({ _id: "p1" } as any);
      const res = await projectsPost(
        new Request("http://localhost/api/resume/projects", {
          method: "POST",
          body: JSON.stringify({
            title: "Portfolio",
            description: "Desc",
            link: "https://example.com",
            tech: ["Next.js"],
          }),
        })
      );
      expect(res.status).toBe(200);
      expect(resumeProjectService.addProject).toHaveBeenCalled();
    });

    it("returns 400 for invalid update payload", async () => {
      const res = await projectsPut(
        new Request("http://localhost/api/resume/projects", {
          method: "PUT",
          body: JSON.stringify({}),
        })
      );
      expect(res.status).toBe(400);
    });

    it("returns 404 when deleting unknown project", async () => {
      vi.mocked(resumeProjectService.deleteProject).mockResolvedValue({ success: false });
      const res = await projectsDelete(
        new Request("http://localhost/api/resume/projects", {
          method: "DELETE",
          body: JSON.stringify({ projectId: "missing" }),
        })
      );
      expect(res.status).toBe(404);
    });
  });

  describe("certifications route", () => {
    it("creates certificate", async () => {
      vi.mocked(certificateService.addCertificate).mockResolvedValue({ _id: "c1" } as any);
      const res = await certPost(
        new Request("http://localhost/api/resume/certifications", {
          method: "POST",
          body: JSON.stringify({
            name: "AWS",
            issuer: "Amazon",
            issueDate: "2025-01-01",
          }),
        })
      );
      expect(res.status).toBe(200);
    });

    it("returns 404 on missing certificate update target", async () => {
      vi.mocked(certificateService.updateCertificate).mockResolvedValue(null as any);
      const res = await certPut(
        new Request("http://localhost/api/resume/certifications", {
          method: "PUT",
          body: JSON.stringify({ certificateId: "x", body: { issuer: "New" } }),
        })
      );
      expect(res.status).toBe(404);
    });

    it("deletes certificate", async () => {
      vi.mocked(certificateService.deleteCertificate).mockResolvedValue({ success: true });
      const res = await certDelete(
        new Request("http://localhost/api/resume/certifications", {
          method: "DELETE",
          body: JSON.stringify({ certificateId: "c1" }),
        })
      );
      expect(res.status).toBe(200);
    });
  });

  describe("experience route", () => {
    it("creates experience", async () => {
      vi.mocked(experienceService.addExperience).mockResolvedValue({ _id: "x1" } as any);
      const res = await expPost(
        new Request("http://localhost/api/resume/experience", {
          method: "POST",
          body: JSON.stringify({
            jobRole: "Engineer",
            company: "ABC",
            period: "2022-2024",
            description: "Worked",
            jobType: "Full-time",
            tech: [],
            order: 0,
          }),
        })
      );
      expect(res.status).toBe(200);
    });

    it("returns 404 if update misses document", async () => {
      vi.mocked(experienceService.update).mockResolvedValue(null as any);
      const res = await expPut(
        new Request("http://localhost/api/resume/experience", {
          method: "PUT",
          body: JSON.stringify({ experienceId: "missing", body: { company: "X" } }),
        })
      );
      expect(res.status).toBe(404);
    });

    it("deletes experience", async () => {
      vi.mocked(experienceService.delete).mockResolvedValue({ success: true });
      const res = await expDelete(
        new Request("http://localhost/api/resume/experience", {
          method: "DELETE",
          body: JSON.stringify({ experienceId: "x1" }),
        })
      );
      expect(res.status).toBe(200);
    });
  });
});
