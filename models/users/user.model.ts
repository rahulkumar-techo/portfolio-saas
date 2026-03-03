import mongoose, { Schema, models } from "mongoose";

interface Image{
  url: string;
  alt?: string;
  ImageId?: string;
}

export interface IUser {
  name: string;
  username: string;
  title: string;
  location: string;
  email: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  password: string;
  avatar?: Image;
  bio?: string;
  careerScore: number;
  atsScore: number;
  isverified?: boolean;
  role?: "USER" | "ADMIN";
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    title: {
      type: String,
      default: "Full Stack Developer",
    },

    location: {
      type: String,
      default: "India",
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    github: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    twitter: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "Passionate developer building modern web applications.",
    },

    careerScore: {
      type: Number,
      default: 0,
    },

    atsScore: {
      type: Number,
      default: 0,
    },
    isverified: {
      type: Boolean,
      default: false, 
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    avatar:{
      url: { type: String, default: "" },
      alt: { type: String, default: "" },
      ImageId: { type: String, default: "" },
    }
    
    
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);