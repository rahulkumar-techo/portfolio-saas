/**
 * Project Repository
 * Handles direct DB operations
 */

import Project from "@/models/portfolio/project.model";

export class ProjectRepository {

  async findByUserId(userId: string) {
    return Project.find({ userId, isDeleted: false }).lean();
  }

  async findByProjectId(userId: string, projectId: string) {
    return Project.findOne({ userId, projectId, isDeleted: false }).lean();
  }

  async findById(projectId: string) {
    return Project.findOne({ _id: projectId, isDeleted: false });
  }

  async create(projectData: any) {
    return Project.create(projectData);
  }

  async updateById(projectId: string, update: any) {
    return Project.findOneAndUpdate(
      { _id: projectId, isDeleted: false },
      update,
      { new: true }
    );
  }

  async softDelete(projectId: string) {
    return Project.findOneAndUpdate(
      { _id: projectId },
      { isDeleted: true },
      { new: true }
    );
  }
}