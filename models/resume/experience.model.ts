/**
 * Experience Schema for Portfolio SaaS
 * Stores professional history
 */

import mongoose, { Schema, models } from "mongoose";

export interface IExperience {
  userId: mongoose.Types.ObjectId;
  experienceId: string;
  jobRole: string;
  jobType: string;
  company: string;
  period: string;
  description: string;
  tech: string[];
  order: number;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    experienceId: {
      type: String,
      required: true,
    },

    jobRole: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    period: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    tech: {
      type: [String],
      default: [],
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

ExperienceSchema.index({ userId: 1, experienceId: 1 }, { unique: true });

export default models.UserSkills || mongoose.model("experience", ExperienceSchema);
