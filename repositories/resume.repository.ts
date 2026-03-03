/**
 * Resume Repository
 * Manual reference fetching with auto-create support
 */

import analyticsModel from "@/models/resume/analytics.model";
import EducationsModel from "@/models/resume/Educations.model";
import experienceModel from "@/models/resume/experience.model";
import projectsModel from "@/models/resume/projects.model";
import skillsModel from "@/models/resume/skills.model";
import userModel from "@/models/users/user.model";

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

    // Contact is special (comes from userModel)
    if (section === "contactInfo") {
      const user = await userModel
        .findById(userId)
        .select("name title email location github linkedin")
        .lean()
        .exec();

      return { contactInfo: user };
    }

    const model = this.sectionModelMap[
      section as keyof typeof this.sectionModelMap
    ];

    if (!model) return null;

    let doc = await model.findOne({ userId }).lean().exec();

    // 🔥 Auto-create if missing
    if (!doc) {
      const created = await model.create({ userId });
      doc = created.toObject();
    }

    return { [section]: doc };
  }
}