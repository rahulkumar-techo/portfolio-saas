/**
 * User Schema for Portfolio SaaS
 */

import mongoose, { Schema, models } from "mongoose"

const UserSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
)

export default models.User || mongoose.model("User", UserSchema)