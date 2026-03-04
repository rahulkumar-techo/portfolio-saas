import { IExperience } from "@/models/resume/experience.model";
import ResumeRepository from "@/repositories/resume.repository";
import { ExperienceRequestBody } from "@/types/server-types/resume";

class ExperienceService {

    private expRepo = new ResumeRepository();

    async addExperience(userId: string, experienceData:ExperienceRequestBody): Promise<IExperience> {

        return this.expRepo.addExperience(userId, experienceData);
    }

  async update(
    userId: string,
    experienceId: string,
    data: Partial<IExperience>
  ) {
    if (!experienceId) throw new Error("experienceId required");
    return this.expRepo.updateExperience(userId, experienceId, data);
  }

  async delete(userId: string, experienceId: string) {
    if (!experienceId) throw new Error("experienceId required");
    return this.expRepo.deleteExperience(userId, experienceId);
  }

  async getByExperienceId(userId: string, experienceId: string) {
    if (!experienceId) throw new Error("experienceId required");
    return this.expRepo.getExperienceById(userId, experienceId);
  }
  // async getAll(userId: string) {
  //   return this.expRepo.getExperiences(userId);
  // }
}

export default new ExperienceService();
