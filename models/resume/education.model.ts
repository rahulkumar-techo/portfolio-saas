import mongoose, { Schema, models } from "mongoose";

export interface IEducation {
  userId: mongoose.Types.ObjectId;
  educationId: string;
  degree: string;
  field: string;
  institution: string;
  location?: string;
  startYear: number;
  endYear?: number;
  grade?: string;
  description?: string;
  order: number;
}

const EducationSchema = new Schema<IEducation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    educationId: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    field: {
      type: String,
      required: true,
      trim: true,
    },
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    startYear: {
      type: Number,
      required: true,
    },
    endYear: {
      type: Number,
    },
    grade: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

EducationSchema.index({ userId: 1, educationId: 1 }, { unique: true });

export default models.Education || mongoose.model("Education", EducationSchema);
