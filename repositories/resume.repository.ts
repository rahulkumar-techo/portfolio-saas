/**
 * Resume Repository
 * Manual reference fetching with auto-create support
 */

import analyticsModel from "@/models/resume/analytics.model";
import certificatesModel, { ICertificate } from "@/models/resume/certificates.model";
import educationModel, { IEducation } from "@/models/resume/education.model";
import experienceModel, { IExperience } from "@/models/resume/experience.model";
import projectsModel, { IProject } from "@/models/resume/projects.model";
import skillsModel from "@/models/resume/skills.model";
import userModel from "@/models/users/user.model";
import {
  CertificateRequestBody,
  EducationRequestBody,
  ExperienceRequestBody,
  ProjectRequestBody,
  SkillGroup,
} from "@/types/server-types/resume";
import mongoose from "mongoose";

export default class ResumeRepository {

  // 🔹 Single-section model mapping
  private sectionModelMap = {
    skills: skillsModel,
    analytics: analyticsModel,
  };

  /**
   * Fetch Full Resume (Parallel)
   */
  async getFullResume(userId: string) {
    const user = await userModel
      .findById(userId)
      .select("name title email location github linkedin")
      .lean()
      .exec();

    if (!user) return null;

    const [experience, education, skills, projects, certifications, analytics] =
      await Promise.all([
        experienceModel.find({ userId }).sort({ order: 1 }).lean().exec(),
        educationModel.find({ userId }).sort({ order: 1 }).lean().exec(),
        this.getSkillsById(userId),
        projectsModel.find({ userId }).sort({ createdAt: -1 }).lean().exec(),
        certificatesModel.find({ userId }).sort({ createdAt: -1 }).lean().exec(),
        this.getOrCreateAnalytics(userId),
      ]);

    return {
      contactInfo: user,
      experience,
      education,
      skills,
      projects,
      certifications,
      analytics,
    };
  }

  /**
   * Fetch Single Resume Section
   */

  async getResumeSection(userId: string, section: string) {
    // 🔐 CONTACT
    if (section === "contactInfo") {
      const user = await userModel
        .findById(userId)
        .select("name title email location github linkedin")
        .lean()
        .exec();

      return { contactInfo: user };
    }

    // 🔥 EXPERIENCE (multi-doc)
    if (section === "experience") {
      const experiences = await experienceModel
        .find({ userId })
        .sort({ order: 1 })
        .lean()
        .exec();

      return experiences;
    }

    if (section === "education") {
      return await educationModel
        .find({ userId })
        .sort({ order: 1 })
        .lean()
        .exec();
    }

    if (section === "projects") {
      return await projectsModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .lean()
        .exec();
    }

    if (section === "certifications") {
      return await certificatesModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .lean()
        .exec();
    }

    // 🔥 SKILLS (single-doc)
    if (section === "skills") {
      let skills = await skillsModel
        .findOne({ userId })
        .lean()
        .exec();

      if (!skills) {
        const created = await skillsModel.create({
          userId,
          skillGroups: [],
        });
        skills = created.toObject();
      }

      return skills;
    }

    // 🔵 OTHER SINGLE SECTIONS
    const model = this.sectionModelMap[
      section as keyof typeof this.sectionModelMap
    ];

    if (!model) return null;

    let doc = await model.findOne({ userId }).lean().exec();

    if (!doc) {
      const created = await model.create({ userId });
      doc = created.toObject();
    }

    return doc;
  }

  private async getOrCreateAnalytics(userId: string) {
    let analytics = await analyticsModel.findOne({ userId }).lean().exec();
    if (!analytics) {
      const created = await analyticsModel.create({ userId });
      analytics = created.toObject();
    }

    return analytics;
  }

  // add experience CRUD
  async addExperience(userId: string, experienceData: Partial<ExperienceRequestBody>) {
    const experienceId = `exp_${Date.now()}`;
    const newExperience = await experienceModel.create({
      userId,
      experienceId,
      ...experienceData,
    });
    return newExperience.toObject();
  }

  private buildExperienceQuery(userId: string, experienceRef: string) {
    if (mongoose.Types.ObjectId.isValid(experienceRef)) {
      return {
        userId,
        $or: [{ _id: experienceRef }, { experienceId: experienceRef }],
      };
    }

    return { userId, experienceId: experienceRef };
  }

  async updateExperience(
    userId: string,
    experienceId: string,
    updatedData: Partial<IExperience>
  ) {
    return await experienceModel
      .findOneAndUpdate(
        this.buildExperienceQuery(userId, experienceId),
        { $set: updatedData },
        { new: true }
      )
      .lean()
      .exec();
  }

  async deleteExperience(userId: string, experienceId: string) {
    const deleted = await experienceModel
      .findOneAndDelete(this.buildExperienceQuery(userId, experienceId))
      .lean()
      .exec();

    return { success: !!deleted };
  }

  async getExperienceById(userId: string, experienceId: string) {
    return await experienceModel
      .findOne(this.buildExperienceQuery(userId, experienceId))
      .lean()
      .exec();
  }

  // EDUCATION📔📕📖
  private buildEducationQuery(userId: string, educationRef: string) {
    if (mongoose.Types.ObjectId.isValid(educationRef)) {
      return {
        userId,
        $or: [{ _id: educationRef }, { educationId: educationRef }],
      };
    }

    return { userId, educationId: educationRef };
  }

  async addEducation(
    userId: string,
    data: Partial<EducationRequestBody>
  ) {
    const educationId = `edu_${Date.now()}`;
    const education = await educationModel.create({
      userId,
      educationId,
      ...data,
    });

    return education.toObject();
  }

  async updateEducation(
    userId: string,
    educationId: string,
    data: Partial<IEducation>
  ) {
    return await educationModel
      .findOneAndUpdate(this.buildEducationQuery(userId, educationId), { $set: data }, { new: true })
      .lean()
      .exec();
  }

  async deleteEducation(userId: string, educationId: string) {
    const deleted = await educationModel
      .findOneAndDelete(this.buildEducationQuery(userId, educationId))
      .lean()
      .exec();

    return { success: !!deleted };
  }

  async getEducationById(userId: string, educationId: string) {
    return await educationModel
      .findOne(this.buildEducationQuery(userId, educationId))
      .lean()
      .exec();
  }

  // PROJECT 🔍
  private buildProjectQuery(userId: string, projectRef: string) {
    if (mongoose.Types.ObjectId.isValid(projectRef)) {
      return {
        userId,
        $or: [{ _id: projectRef }, { projectId: projectRef }],
      };
    }

    return { userId, projectId: projectRef };
  }

  async addResumeProject(userId: string, data: Partial<ProjectRequestBody>) {
    const projectId = `proj_${Date.now()}`;
    const project = await projectsModel.create({
      userId,
      projectId,
      ...data,
    });

    return project.toObject();
  }

  async updateResumeProject(userId: string, projectId: string, data: Partial<IProject>) {
    return await projectsModel
      .findOneAndUpdate(this.buildProjectQuery(userId, projectId), { $set: data }, { new: true })
      .lean()
      .exec();
  }

  async deleteResumeProject(userId: string, projectId: string) {
    const deleted = await projectsModel
      .findOneAndDelete(this.buildProjectQuery(userId, projectId))
      .lean()
      .exec();

    return { success: !!deleted };
  }

  async getResumeProjectById(userId: string, projectId: string) {
    return await projectsModel
      .findOne(this.buildProjectQuery(userId, projectId))
      .lean()
      .exec();
  }

  private buildCertificateQuery(userId: string, certificateRef: string) {
    if (mongoose.Types.ObjectId.isValid(certificateRef)) {
      return {
        userId,
        $or: [{ _id: certificateRef }, { certificateId: certificateRef }],
      };
    }

    return { userId, certificateId: certificateRef };
  }
  // Resume
  async addCertificate(
    userId: string,
    data: Partial<CertificateRequestBody>
  ) {
    const certificateId = `cert_${Date.now()}`;
    const certificate = await certificatesModel.create({
      userId,
      certificateId,
      ...data,
    });

    return certificate.toObject();
  }

  async updateCertificate(
    userId: string,
    certificateId: string,
    data: Partial<ICertificate>
  ) {
    return await certificatesModel
      .findOneAndUpdate(
        this.buildCertificateQuery(userId, certificateId),
        { $set: data },
        { new: true }
      )
      .lean()
      .exec();
  }

  async deleteCertificate(userId: string, certificateId: string) {
    const deleted = await certificatesModel
      .findOneAndDelete(this.buildCertificateQuery(userId, certificateId))
      .lean()
      .exec();

    return { success: !!deleted };
  }

  async getCertificateById(userId: string, certificateId: string) {
    return await certificatesModel
      .findOne(this.buildCertificateQuery(userId, certificateId))
      .lean()
      .exec();
  }

  async getSkillsById(userId: string) {
    let skills = await skillsModel
      .findOne({ userId })
      .lean()
      .exec();

    if (!skills) {
      const created = await skillsModel.create({ userId, skillGroups: [] });
      skills = created.toObject();
    }

    return skills;
  }
  async updateSkills(userId: string, skillGroups: SkillGroup[]) {
    return await skillsModel
      .findOneAndUpdate(
        { userId },
        { $set: { skillGroups } },
        { new: true, upsert: true }
      )
      .lean()
      .exec();
  }

  async addSkillGroup(userId: string, group: SkillGroup) {
    await skillsModel.updateOne(
      { userId },
      { $pull: { skillGroups: { category: group.category } } },
      { upsert: true }
    );

    return await skillsModel
      .findOneAndUpdate(
        { userId },
        { $push: { skillGroups: group } },
        { new: true, upsert: true }
      )
      .lean()
      .exec();
  }

  async deleteSkillGroup(userId: string, category: string) {
    return await skillsModel
      .findOneAndUpdate(
        { userId },
        { $pull: { skillGroups: { category } } },
        { new: true }
      )
      .lean()
      .exec();
  }




}
