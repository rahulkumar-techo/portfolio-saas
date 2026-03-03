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
    console.log("Fetching full resume for userId:", userId); // Debug userId
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
    console.log("Fetching full resume for userId:", userId); // Debug userId

    const allowedSections = [
      "contactInfo",
      "experience",
      "education",
      "skills",
      "projects",
      "analytics",
    ];

    if (!allowedSections.includes(section)) {
      throw new AppError("Invalid resume section", 400);
    }

    const data = await this.resumeRepo.getResumeSection(userId, section);


    if (!data || Object.keys(data).length === 0) {
      throw new AppError("Resume section not found", 404);
    }
    console.log(`Fetched section (${section}) for userId ${userId}:`, data); // Debug fetched section data

    return data;
  }
}

export default new ResumeService();