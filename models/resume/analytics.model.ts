/**
 * Analytics Schema for Portfolio SaaS
 * Tracks portfolio performance metrics
 */

import mongoose, { Schema, models } from "mongoose";

interface IMonthlyView {
  month: string;
  views: number;
  visitors: number;
}

interface ICountryStats {
  country: string;
  visits: number;
  percentage: number;
}

interface IPageStats {
  page: string;
  views: number;
}

interface IDeviceStats {
  name: string;
  value: number;
}

interface IAnalytics {
  userId: mongoose.Types.ObjectId;
  monthlyViews: IMonthlyView[];
  topCountries: ICountryStats[];
  topPages: IPageStats[];
  devices: IDeviceStats[];
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    monthlyViews: [
      {
        month: String,
        views: Number,
        visitors: Number,
      },
    ],

    topCountries: [
      {
        country: String,
        visits: Number,
        percentage: Number,
      },
    ],

    topPages: [
      {
        page: String,
        views: Number,
      },
    ],

    devices: [
      {
        name: String,
        value: Number,
      },
    ],
  },
  { timestamps: true }
);

export default models.Analytics ||
  mongoose.model("Analytics", AnalyticsSchema);