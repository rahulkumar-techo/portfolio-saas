/**
 * Portfolio Model
 * Production-ready Mongoose + TypeScript schema
 */

import mongoose, { Schema, Document, Model } from "mongoose";

/* ======================================================
   ENUMS
====================================================== */

export type PortfolioStatus = "draft" | "published" | "archived";
export type LayoutType = "centered" | "split" | "grid";
export type BorderRadiusType = "sm" | "md" | "lg";
export type SpacingType = "compact" | "normal" | "spacious";

/* ======================================================
   INTERFACES
====================================================== */

export interface IPortfolio extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  slug: string;
  customDomain?: string;

  status: PortfolioStatus;

  theme: {
    name: string;
    version: string;
  };

  content: {
    hero: {
      name: string;
      title: string;
      summary: string;
      profileImage?: string;
    };

    skills: {
      name: string;
      category?: string;
      level?: number;
    }[];

    projects: {
      title: string;
      description: string;
      techStack: string[];
      liveUrl?: string;
      githubUrl?: string;
      featured?: boolean;
      order?: number;
    }[];

    experience: {
      company: string;
      role: string;
      startDate: Date;
      endDate?: Date;
      description?: string;
      location?: string;
      current?: boolean;
    }[];

    education: {
      institution: string;
      degree: string;
      field?: string;
      startYear?: number;
      endYear?: number;
    }[];

    links: {
      label: string;
      url: string;
      icon?: string;
    }[];

    customSections: {
      id: string;
      type: string;
      data: any;
      order?: number;
    }[];
  };

  design: {
    primaryColor: string;
    secondaryColor?: string;
    backgroundColor?: string;
    fontFamily?: string;
    layout: LayoutType;
    borderRadius: BorderRadiusType;
    spacing: SpacingType;
    darkMode: boolean;
    customCSS?: string;
  };

  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
    structuredData?: any;
  };

  analytics: {
    totalViews: number;
    uniqueVisitors: number;
    lastViewedAt?: Date;
  };

  settings: {
    allowContactForm: boolean;
    allowDownloadResume: boolean;
    showBranding: boolean;
    isSearchIndexed: boolean;
  };

  featureFlags: {
    premiumTheme: boolean;
    customDomainEnabled: boolean;
    analyticsEnabled: boolean;
  };

  version: number;
  publishedVersion?: number;

  isDeleted: boolean;
  deletedAt?: Date;
}

/* ======================================================
   SCHEMA
====================================================== */

const PortfolioSchema = new Schema<IPortfolio>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },

    slug: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    customDomain: {
      type: String,
      default: null,
      sparse: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },

    theme: {
      name: { type: String, default: "modern" },
      version: { type: String, default: "1.0.0" },
    },

    content: {
      hero: {
        name: { type: String, required: true },
        title: { type: String },
        summary: { type: String },
        profileImage: { type: String },
      },

      skills: [
        {
          name: String,
          category: String,
          level: { type: Number, min: 1, max: 5 },
        },
      ],

      projects: [
        {
          title: String,
          description: String,
          techStack: [String],
          liveUrl: String,
          githubUrl: String,
          featured: { type: Boolean, default: false },
          order: { type: Number, default: 0 },
        },
      ],

      experience: [
        {
          company: String,
          role: String,
          startDate: Date,
          endDate: Date,
          description: String,
          location: String,
          current: Boolean,
        },
      ],

      education: [
        {
          institution: String,
          degree: String,
          field: String,
          startYear: Number,
          endYear: Number,
        },
      ],

      links: [
        {
          label: String,
          url: String,
          icon: String,
        },
      ],

      customSections: [
        {
          id: String,
          type: String,
          data: Schema.Types.Mixed,
          order: Number,
        },
      ],
    },

    design: {
      primaryColor: { type: String, default: "#6366f1" },
      secondaryColor: String,
      backgroundColor: String,
      fontFamily: { type: String, default: "inter" },

      layout: {
        type: String,
        enum: ["centered", "split", "grid"],
        default: "centered",
      },

      borderRadius: {
        type: String,
        enum: ["sm", "md", "lg"],
        default: "md",
      },

      spacing: {
        type: String,
        enum: ["compact", "normal", "spacious"],
        default: "normal",
      },

      darkMode: { type: Boolean, default: false },
      customCSS: String,
    },

    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
      ogImage: String,
      structuredData: Schema.Types.Mixed,
    },

    analytics: {
      totalViews: { type: Number, default: 0 },
      uniqueVisitors: { type: Number, default: 0 },
      lastViewedAt: Date,
    },

    settings: {
      allowContactForm: { type: Boolean, default: true },
      allowDownloadResume: { type: Boolean, default: true },
      showBranding: { type: Boolean, default: true },
      isSearchIndexed: { type: Boolean, default: true },
    },

    featureFlags: {
      premiumTheme: { type: Boolean, default: false },
      customDomainEnabled: { type: Boolean, default: false },
      analyticsEnabled: { type: Boolean, default: false },
    },

    version: { type: Number, default: 1 },
    publishedVersion: { type: Number },

    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

/* ======================================================
   INDEXES
====================================================== */

PortfolioSchema.index({ userId: 1 });
PortfolioSchema.index({ slug: 1 });
PortfolioSchema.index({ customDomain: 1 }, { sparse: true });

/* ======================================================
   EXPORT
====================================================== */

export const Portfolio: Model<IPortfolio> =
  mongoose.models.Portfolio ||
  mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);