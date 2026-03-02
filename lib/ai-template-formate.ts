/**
 * createPortfolioState
 * Generates a fully structured PortfolioState object
 */

import { LayoutType } from "@/models/portfolio/portfolio.model";



export interface PortfolioState {
  username: string;
  slug: string;
  customDomain: string;
  status: "draft" | "published" | "archived";

  theme: {
    name: string;
    version: string;
  };

  content: {
    hero: {
      name: string;
      title: string;
      summary: string;
      profileImage: string;
    };
    skills: { name: string }[];
    projects: { title: string; description: string; techStack: string[] }[];
    experience: any[];
    education: any[];
    links: any[];
    customSections: any[];
  };

  design: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    fontFamily: string;
    layout: LayoutType;
    borderRadius: string;
    spacing: string;
    darkMode: boolean;
    customCSS: string;
  };

  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string;
  };

  analytics: {
    totalViews: number;
    uniqueVisitors: number;
  };

  settings: {
    allowContactForm: boolean;
    allowDownloadResume: boolean;
    showBranding: boolean;
    isSearchIndexed: boolean;
  };

  version: number;
  publishedVersion: number | undefined;
}

/* ======================================================
   FACTORY FUNCTION
====================================================== */

export function createPortfolioState(
  username: string,
  heroName: string
): PortfolioState {

  const normalizedUsername = username.toLowerCase().replace(/\s+/g, "");
  const slug = normalizedUsername + "-portfolio";

  return {
    username: normalizedUsername,
    slug,
    customDomain: "",
    status: "draft",

    theme: {
      name: "modern",
      version: "1.0.0",
    },

    content: {
      hero: {
        name: heroName,
        title: "",
        summary: "",
        profileImage: "",
      },

      skills: [],
      projects: [],
      experience: [],
      education: [],
      links: [],
      customSections: [],
    },

    design: {
      primaryColor: "#6366f1",
      secondaryColor: "#4f46e5",
      backgroundColor: "#ffffff",
      fontFamily: "Inter",
      layout: "centered",
      borderRadius: "md",
      spacing: "normal",
      darkMode: false,
      customCSS: "",
    },

    seo: {
      metaTitle: heroName,
      metaDescription: "",
      keywords: [],
      ogImage: "",
    },

    analytics: {
      totalViews: 0,
      uniqueVisitors: 0,
    },

    settings: {
      allowContactForm: true,
      allowDownloadResume: true,
      showBranding: true,
      isSearchIndexed: true,
    },

    version: 1,
    publishedVersion: undefined,
  };
}