/**
 * Portfolio Version Model
 */

import mongoose, { Schema, Document } from "mongoose";

export interface IPortfolioVersion extends Document {
  portfolioId: mongoose.Types.ObjectId;
  content: any;
  design: any;
  version: number;
  createdAt: Date;
}

const PortfolioVersionSchema = new Schema<IPortfolioVersion>({
  portfolioId: {
    type: Schema.Types.ObjectId,
    ref: "Portfolio",
    required: true,
  },
  content: Schema.Types.Mixed,
  design: Schema.Types.Mixed,
  version: Number,
}, { timestamps: true });

export const PortfolioVersion =
  mongoose.models.PortfolioVersion ||
  mongoose.model("PortfolioVersion", PortfolioVersionSchema);