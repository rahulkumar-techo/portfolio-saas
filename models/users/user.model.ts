/**
 * User Model
 * Multi-provider SaaS ready (Credentials + Google)
 */

import mongoose, { Schema, models, Model } from "mongoose"

/* ---------------- Types ---------------- */

export type AuthProvider = "credentials" | "google"

interface Image {
  url: string
  alt?: string
  imageId?: string
}

export interface IUser {
  name: string
  username: string
  email: string

  provider: AuthProvider
  oauthId?: string

  password?: string

  title?: string
  location?: string

  github?: string
  linkedin?: string
  twitter?: string
  website?: string

  avatar?: Image
  bio?: string

  careerScore?: number
  atsScore?: number

  isVerified?: boolean
  role?: "USER" | "ADMIN"
}

/* ---------------- Schema ---------------- */

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

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    provider: {
      type: String,
      enum: ["credentials", "google"],
      required: true,
    },

    oauthId: {
      type: String,
    },

    password: {
      type: String,
      minlength: 6,
      required: function (this: IUser) {
        return this.provider === "credentials"
      },
    },

    title: {
      type: String,
      default: "Full Stack Developer",
    },

    location: {
      type: String,
      default: "India",
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

    isVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    avatar: {
      url: { type: String, default: "" },
      alt: { type: String, default: "" },
      imageId: { type: String, default: "" },
    },
  },
  { timestamps: true }
)

/* ---------------- Model Export ---------------- */

const User: Model<IUser> =
  models.User || mongoose.model<IUser>("User", UserSchema)

export default User