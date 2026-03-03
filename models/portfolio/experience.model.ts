/**
 * Experience Schema for Portfolio SaaS
 * Stores professional history
 */

import mongoose, { Schema, models } from "mongoose";

export interface IExperience {
  userId: mongoose.Types.ObjectId;
  experienceId: string;
  jobRole: string;
  jobTypes: string;
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
    jobTypes: {
      type: String,
      required: true
    },

    experienceId: {
      type: String,
      required: true,
    },

    jobRole: {
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

const PORTFOLIO_EXPERIENCE_MODEL = "PortfolioExperience";

export default (models[PORTFOLIO_EXPERIENCE_MODEL] as mongoose.Model<IExperience>) ||
  mongoose.model<IExperience>(PORTFOLIO_EXPERIENCE_MODEL, ExperienceSchema, "portfolio_experiences");

/*
{
  "_id": "66fa2d...",
  "userId": "65fa91d27c23fa...",
  "experienceId": "exp_001",
  "jobRole": "Full Stack Developer",
  "company": "StartupX",
  "period": "Jan 2023 - Present",
  "description": "Developed scalable microservices using Node.js and MongoDB. Improved API response time by 40%.",
  "tech": ["Node.js", "React", "MongoDB", "Redis"],
  "order": 1,
  "createdAt": "2026-03-03T...",
  "updatedAt": "2026-03-03T..."
}
*/ 
