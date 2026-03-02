/**
 * Skills Schema for Portfolio SaaS
 * Nested skill groups with levels
 */

import mongoose, { Schema, models } from "mongoose";

interface ISkill {
  name: string;
  level: number;
}

interface ISkillGroup {
  category: string;
  color: string;
  skills: ISkill[];
}

interface IUserSkills {
  userId: mongoose.Types.ObjectId;
  skillGroups: ISkillGroup[];
}

const SkillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { _id: false }
);

const SkillGroupSchema = new Schema<ISkillGroup>(
  {
    category: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    skills: {
      type: [SkillSchema],
      required: true,
    },
  },
  { _id: false }
);

const UserSkillsSchema = new Schema<IUserSkills>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    skillGroups: {
      type: [SkillGroupSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default models.UserSkills || mongoose.model("UserSkills", UserSkillsSchema);