
import { ProjectRepository } from "@/repositories/project.repository";
import {
  CreateProjectSchema,
  UpdateProjectSchema,
} from "@/validators/project.validator";
import { AppError } from "@/utils/app-error";

export class ProjectService {
  private repo = new ProjectRepository();

  /* ---------- Create ---------- */
  async createProject(userId: string, data: unknown) {
    const result = CreateProjectSchema.safeParse(data) as any;

    if (!result.success) {
      throw new AppError(result.error.errors[0].message, 400);
    }

    return this.repo.create({
      ...result.data,
      userId,
    });
  }

  /* ---------- Get All ---------- */
  async getUserProjects(userId: string) {
    return this.repo.findByUserId(userId);
  }

  /* ---------- Get One ---------- */
  async getProject(userId: string, projectId: string) {
    const project = await this.repo.findByProjectId(userId, projectId);

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    return project;
  }

  /* ---------- Update ---------- */
  async updateProject(userId: string, projectId: string, data: unknown) {
    const result = UpdateProjectSchema.safeParse(data) as any;

    if (!result.success) {
      throw new AppError(result.error.errors[0].message, 400);
    }

    const existing = await this.repo.findByProjectId(userId, projectId);

    if (!existing) {
      throw new AppError("Unauthorized or project not found", 404);
    }

    return this.repo.updateById(existing._id, result.data);
  }

  /* ---------- Delete (Soft) ---------- */
  async deleteProject(userId: string, projectId: string) {
    const existing = await this.repo.findByProjectId(userId, projectId);

    if (!existing) {
      throw new AppError("Unauthorized or project not found", 404);
    }

    await this.repo.softDelete(existing._id);

    return { message: "Project deleted successfully" };
  }
}