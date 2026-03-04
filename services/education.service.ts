import { IEducation } from "@/models/resume/education.model";
import ResumeRepository from "@/repositories/resume.repository";
import { EducationRequestBody } from "@/types/server-types/resume";

class EducationService {
  private repo = new ResumeRepository();

  async addEducation(userId: string, data: EducationRequestBody) {
    return this.repo.addEducation(userId, data);
  }

  async updateEducation(
    userId: string,
    educationId: string,
    data: Partial<IEducation>
  ) {
    if (!educationId) throw new Error("educationId required");
    return this.repo.updateEducation(userId, educationId, data);
  }

  async deleteEducation(userId: string, educationId: string) {
    if (!educationId) throw new Error("educationId required");
    return this.repo.deleteEducation(userId, educationId);
  }

  async getEducationById(userId: string, educationId: string) {
    if (!educationId) throw new Error("educationId required");
    return this.repo.getEducationById(userId, educationId);
  }
}

const educationService = new EducationService();
export default educationService;
