import { IProject } from "@/models/resume/projects.model";
import ResumeRepository from "@/repositories/resume.repository";
import { ProjectRequestBody } from "@/types/server-types/resume";

class ResumeProjectService {
  private repo = new ResumeRepository();

  async addProject(userId: string, data: ProjectRequestBody) {
    return this.repo.addResumeProject(userId, data);
  }

  async updateProject(userId: string, projectId: string, data: Partial<IProject>) {
    if (!projectId) throw new Error("projectId required");
    return this.repo.updateResumeProject(userId, projectId, data);
  }

  async deleteProject(userId: string, projectId: string) {
    if (!projectId) throw new Error("projectId required");
    return this.repo.deleteResumeProject(userId, projectId);
  }

  async getProjectById(userId: string, projectId: string) {
    if (!projectId) throw new Error("projectId required");
    return this.repo.getResumeProjectById(userId, projectId);
  }
}

const resumeProjectService = new ResumeProjectService();
export default resumeProjectService;
