/**
 * Projects Schema for Portfolio SaaS
 * Stores user projects with tech stack + stats
 */

import mongoose, { Schema, models } from "mongoose";

interface IProject {
  userId: mongoose.Types.ObjectId;
  projectId: string; // custom id like 'p1'
  title: string;
  description: string;
  tech: string[];
  link: string;
  image: string;
  stars: number;
}

const ProjectSchema = new Schema<IProject>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    projectId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    tech: {
      type: [String],
      default: [],
    },

    link: {
      type: String,
      required: true,
    },

    image: {
      type: String, // can be gradient or real image URL
      required: true,
    },

    stars: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Prevent duplicate project IDs per user
ProjectSchema.index({ userId: 1, projectId: 1 }, { unique: true });

export default models.Project || mongoose.model("Project", ProjectSchema);