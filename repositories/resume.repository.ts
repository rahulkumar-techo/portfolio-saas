/**
 * Resume Repository
 * Manual reference fetching with auto-create support
 */

import analyticsModel from "@/models/resume/analytics.model";
import EducationsModel from "@/models/resume/Educations.model";
import experienceModel, { IExperience } from "@/models/resume/experience.model";
import projectsModel from "@/models/resume/projects.model";
import skillsModel from "@/models/resume/skills.model";
import userModel from "@/models/users/user.model";
import { ExperienceRequestBody } from "@/types/server-types/resume";
import mongoose from "mongoose";

export default class ResumeRepository {

  // 🔹 Section → Model Mapping
  private sectionModelMap = {
    experience: experienceModel,
    education: EducationsModel,
    skills: skillsModel,
    projects: projectsModel,
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

    const sectionKeys = Object.keys(this.sectionModelMap) as Array<
      keyof typeof this.sectionModelMap
    >;

    const sectionResults = await Promise.all(
      sectionKeys.map(async (key) => {
        const model = this.sectionModelMap[key];

        let doc = await model.findOne({ userId }).lean().exec();

        // 🔥 Auto-create empty document if not exists
        if (!doc) {
          const created = await model.create({ userId });
          doc = created.toObject();
        }

        return { [key]: doc };
      })
    );

    return {
      contactInfo: user,
      ...Object.assign({}, ...sectionResults),
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
        .find({ userId: new mongoose.Types.ObjectId(userId) })
        .sort({ order: 1 })
        .lean()
        .exec();

      return experiences;
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
          skills: [],
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


}
