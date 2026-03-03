import { IExperience } from "@/models/resume/experience.model";
import ResumeRepository from "@/repositories/resume.repository";
import { ExperienceRequestBody } from "@/types/server-types/resume";

class ExperienceService {

    private expRepo = new ResumeRepository();

    async addExperience(userId: string, experienceData:ExperienceRequestBody): Promise<IExperience> {

        return this.expRepo.addExperience(userId, experienceData);
    }

    async updateExperience(userId: string, experienceId: string, experienceData: Partial<IExperience>) {

        return this.expRepo.updateExperience(userId, experienceId, experienceData);
    }

    async deleteExperience(userId: string, experienceId: string) {

        return this.expRepo.deleteExperience(userId, experienceId);
    }
}

export default new ExperienceService();
