/**
 * Education Model
 * Stores all education entries for a resume
 */

import mongoose, { Schema, Document, Types } from "mongoose";

export interface IEducationItem {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: Date;
  endDate?: Date;
  grade?: string;
  description?: string;
}

export interface IEducation extends Document {
  userId: Types.ObjectId;
  items: IEducationItem[];
  createdAt: Date;
  updatedAt: Date;
}

const EducationItemSchema = new Schema<IEducationItem>(
  {
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    fieldOfStudy: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    grade: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { _id: true } // each education item gets its own id
);

const EducationSchema = new Schema<IEducation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: {
      type: [EducationItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Education ||
  mongoose.model<IEducation>("Education", EducationSchema);