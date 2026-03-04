import ResumeRepository from "@/repositories/resume.repository";
import { SkillGroup } from "@/types/server-types/resume";

class SkillsService {

    
  private resumeRepo = new ResumeRepository();

  private normalizeSkillGroups(groups: SkillGroup[]): SkillGroup[] {
    return groups
      .map((group) => ({
        category: group.category?.trim(),
        color: group.color?.trim() || "#6366f1",
        skills: (group.skills || [])
          .map((skill) => ({
            name: skill.name?.trim(),
            level: Math.max(0, Math.min(100, Number(skill.level) || 0)),
          }))
          .filter((skill) => skill.name.length > 0),
      }))
      .filter((group) => group.category.length > 0);
  }

  async getSkills(userId: string) {
    if (!userId) throw new Error("User ID is required");
    return this.resumeRepo.getSkillsById(userId);
  }

  async updateSkills(userId: string, skillGroups: SkillGroup[]) {
    if (!userId) throw new Error("User ID is required");
    if (!Array.isArray(skillGroups)) throw new Error("skillGroups must be an array");
    return this.resumeRepo.updateSkills(userId, this.normalizeSkillGroups(skillGroups));
  }

  async addSkillGroup(userId: string, group: SkillGroup) {
    if (!userId) throw new Error("User ID is required");
    if (!group) throw new Error("Skill group is required");

    const [normalized] = this.normalizeSkillGroups([group]);
    if (!normalized) throw new Error("Valid skill group is required");

    return this.resumeRepo.addSkillGroup(userId, normalized);
  }

  async deleteSkillGroup(userId: string, category: string) {
    if (!userId) throw new Error("User ID is required");
    if (!category?.trim()) throw new Error("Category is required");
    return this.resumeRepo.deleteSkillGroup(userId, category.trim());
  }

}

export default new SkillsService();
