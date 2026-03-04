/**
 * Build Resume Service
 * Collects all resume sections and prepares data for AI
 */

import ResumeRepository from "@/repositories/resume.repository";
import { JobDescription, ResumeData } from "./ai-resume.service";

class BuildResumeService {

  private repo = new ResumeRepository();

  async buildResumeData(userId: string): Promise<ResumeData> {
    const resume = await this.repo.getFullResume(userId);

    const contact = {
      name: resume?.contactInfo?.name || "Candidate",
      email: resume?.contactInfo?.email || "",
      phone: "",
      location: resume?.contactInfo?.location || "",
      linkedin: resume?.contactInfo?.linkedin || "",
      github: resume?.contactInfo?.github || "",
      portfolio: "",
    };

    const education = (resume?.education || []).map((item: any) => ({
      degree: item.degree || "",
      field: item.field || "",
      institution: item.institution || "",
      graduationYear: Number(item.endYear || item.startYear || new Date().getFullYear()),
    }));

    const experience = (resume?.experience || []).map((item: any) => ({
      title: item.jobRole || "",
      company: item.company || "",
      location: "",
      startDate: item.period?.split("-")?.[0]?.trim() || "",
      endDate: item.period?.split("-")?.[1]?.trim() || "Present",
      bullets: [item.description || ""].filter(Boolean),
      technologiesUsed: Array.isArray(item.tech) ? item.tech : [],
    }));

    const projects = (resume?.projects || []).map((item: any) => ({
      name: item.title || "",
      description: item.description || "",
      technologiesUsed: Array.isArray(item.tech) ? item.tech : [],
      url: item.link || "",
      highlights: [],
    }));

    const skillGroups = resume?.skills?.skillGroups || [];
    const allSkills = skillGroups.flatMap((group: any) =>
      (group.skills || []).map((skill: any) => skill.name).filter(Boolean)
    );

    const certifications = (resume?.certifications || []).map((item: any) => ({
      name: item.name || "",
      issuer: item.issuer || "",
      year: Number(String(item.issueDate || "").slice(0, 4)) || new Date().getFullYear(),
      credentialId: item.credentialId || "",
    }));

    return {
      contact,
      summary: resume?.contactInfo?.title || "",
      education,
      experience,
      projects,
      skills: {
        technical: allSkills,
        certifications,
      },
    };
  }

  buildResumePreview(resumeData: ResumeData): string {
    const lines: string[] = [];

    lines.push(`${resumeData.contact.name}`);
    lines.push(
      [resumeData.contact.email, resumeData.contact.location, resumeData.contact.linkedin]
        .filter(Boolean)
        .join(" | ")
    );
    lines.push("");

    if (resumeData.summary) {
      lines.push("SUMMARY");
      lines.push(resumeData.summary);
      lines.push("");
    }

    if (resumeData.experience.length) {
      lines.push("EXPERIENCE");
      for (const exp of resumeData.experience) {
        lines.push(`${exp.title} - ${exp.company} (${exp.startDate} - ${exp.endDate})`);
        for (const bullet of exp.bullets) {
          lines.push(`- ${bullet}`);
        }
      }
      lines.push("");
    }

    if (resumeData.education.length) {
      lines.push("EDUCATION");
      for (const edu of resumeData.education) {
        lines.push(`${edu.degree} in ${edu.field} - ${edu.institution} (${edu.graduationYear})`);
      }
      lines.push("");
    }

    if (resumeData.projects?.length) {
      lines.push("PROJECTS");
      for (const project of resumeData.projects) {
        lines.push(`${project.name} - ${project.description}`);
      }
      lines.push("");
    }

    const technicalSkills = resumeData.skills.technical || [];
    if (technicalSkills.length) {
      lines.push("SKILLS");
      lines.push(technicalSkills.join(", "));
      lines.push("");
    }

    return lines.join("\n").trim();
  }

  parseJobDescription(input: unknown): JobDescription | undefined {
    if (!input) return undefined;

    if (typeof input === "string" && input.trim()) {
      return {
        title: "Target Role",
        description: input.trim(),
      };
    }

    if (typeof input === "object") {
      const jd = input as Partial<JobDescription>;
      if (jd.description?.trim()) {
        return {
          title: jd.title?.trim() || "Target Role",
          company: jd.company?.trim(),
          description: jd.description.trim(),
          requiredSkills: jd.requiredSkills || [],
          preferredSkills: jd.preferredSkills || [],
          industryKeywords: jd.industryKeywords || [],
        };
      }
    }

    return undefined;
  }

  /**
   * Resume strength calculation
   */
  async checkResumeStrength(userId: string) {

    const resumeData = await this.buildResumeData(userId);

    let score = 0;
    const missingSections: string[] = [];

    if (resumeData.education.length) score += 20;
    else missingSections.push("education");

    if (resumeData.experience.length) score += 25;
    else missingSections.push("experience");

    if ((resumeData.projects || []).length) score += 20;
    else missingSections.push("projects");

    if ((resumeData.skills.technical || []).length) score += 20;
    else missingSections.push("skills");

    if ((resumeData.skills.certifications || []).length) score += 15;

    return {
      score,
      missingSections,
      resumeData
    };
  }
}

export default new BuildResumeService();
