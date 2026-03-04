/**
 * Resume Service
 * Handles business logic & validation
 */

import ResumeRepository from "@/repositories/resume.repository";
import { AppError } from "@/utils/app-error";

class ResumeService {
  private resumeRepo: ResumeRepository;

  constructor(resumeRepo = new ResumeRepository()) {
    this.resumeRepo = resumeRepo;
  }

  async getFullResume(userId: string) {
    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    const resume = await this.resumeRepo.getFullResume(userId);

    if (!resume) {
      throw new AppError("Resume not found", 404);
    }

    return resume;
  }

  async getResumeSection(userId: string, section: string) {
    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    const allowedSections = [
      "contactInfo",
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "analytics",
    ];

    if (!allowedSections.includes(section)) {
      throw new AppError("Invalid resume section", 400);
    }

    const data = await this.resumeRepo.getResumeSection(userId, section);


    if (!data) {
      throw new AppError("Resume section not found", 404);
    }

    return data;
  }
}

export default new ResumeService();
