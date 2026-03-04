import { beforeEach, describe, expect, it, vi } from "vitest";
import { getServerSession } from "next-auth";
import BuildResumeService from "@/services/build-resume.service";
import AIResumeService from "@/services/ai-resume.service";
import { POST as generatePost } from "@/app/api/resume/generate/route";
import { GET as previewGet } from "@/app/api/resume/preview/route";
import { POST as atsPost } from "@/app/api/resume/ats/route";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  authOptions: {},
}));

vi.mock("@/services/build-resume.service", () => ({
  default: {
    checkResumeStrength: vi.fn(),
    buildResumeData: vi.fn(),
    buildResumePreview: vi.fn(),
    parseJobDescription: vi.fn(),
  },
}));

vi.mock("@/services/ai-resume.service", () => ({
  default: {
    generateATSResume: vi.fn(),
    analyzeResume: vi.fn(),
  },
}));

describe("Resume AI Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "user_1" } } as any);
  });

  it("preview returns mapped data + preview text", async () => {
    vi.mocked(BuildResumeService.buildResumeData).mockResolvedValue({ contact: { name: "A" } } as any);
    vi.mocked(BuildResumeService.buildResumePreview).mockReturnValue("Preview text");

    const res = await previewGet(new Request("http://localhost/api/resume/preview"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.previewText).toBe("Preview text");
  });

  it("generate returns generated ATS payload", async () => {
    vi.mocked(BuildResumeService.checkResumeStrength).mockResolvedValue({
      score: 70,
      missingSections: [],
      resumeData: { contact: { name: "A" } },
    } as any);
    vi.mocked(BuildResumeService.parseJobDescription).mockReturnValue(undefined);
    vi.mocked(AIResumeService.generateATSResume).mockResolvedValue({
      rawText: "ATS TEXT",
      markdownVersion: "## ATS",
      jsonStructured: {} as any,
      wordCount: 100,
      estimatedPageCount: 1,
    });

    const res = await generatePost(
      new Request("http://localhost/api/resume/generate", {
        method: "POST",
        body: JSON.stringify({}),
      })
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.generated.rawText).toBe("ATS TEXT");
  });

  it("ats route requires job description", async () => {
    vi.mocked(BuildResumeService.parseJobDescription).mockReturnValue(undefined);

    const res = await atsPost(
      new Request("http://localhost/api/resume/ats", {
        method: "POST",
        body: JSON.stringify({}),
      })
    );
    expect(res.status).toBe(400);
  });

  it("ats route returns analysis", async () => {
    vi.mocked(BuildResumeService.parseJobDescription).mockReturnValue({
      title: "Engineer",
      description: "Need React",
    });
    vi.mocked(BuildResumeService.buildResumeData).mockResolvedValue({ contact: { name: "A" } } as any);
    vi.mocked(AIResumeService.analyzeResume).mockResolvedValue({
      score: { overall: 88, breakdown: {} as any, grade: "A" },
      missingKeywords: [],
      presentKeywords: [],
      weakBullets: [],
      suggestions: { critical: [], important: [], optional: [] },
      sectionFeedback: {},
      tailoringTips: [],
    });

    const res = await atsPost(
      new Request("http://localhost/api/resume/ats", {
        method: "POST",
        body: JSON.stringify({ jobDescription: "Need React" }),
      })
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.analysis.score.overall).toBe(88);
  });
});
